#!/usr/bin/env bash
# Build canonical CI-fix context JSON from the failing pipeline.
# Output: JSON to stdout (see infra/ci-fix-contract.md).

set -euo pipefail

MAX="${CI_FIX_MAX_ITERATIONS:-5}"
API_BASE="${GITLAB_API_URL:-https://gitlab.com/api/v4}"
API_BASE="${API_BASE%/}"
DEBUG="${CI_FIX_DEBUG:-1}"

log() {
  if [[ "$DEBUG" == "1" ]]; then
    echo "collect-ci-fix-context: $*" >&2
  fi
}

PROJECT_ID="${CI_PROJECT_ID:-}"
PIPELINE_ID="${CI_PIPELINE_ID:-}"
if [[ -z "$PROJECT_ID" || -z "$PIPELINE_ID" ]]; then
  echo "collect-ci-fix-context: CI_PROJECT_ID and CI_PIPELINE_ID are required" >&2
  exit 1
fi

ITER_FILE="${CI_FIX_ITERATION_FILE:-.ci-fix-iteration}"
if [[ -f "$ITER_FILE" ]]; then
  ITER_RAW="$(tr -d '[:space:]' < "$ITER_FILE" | head -c 32 || true)"
  ITER="${ITER_RAW:-0}"
else
  ITER=0
fi
if ! [[ "$ITER" =~ ^[0-9]+$ ]]; then
  ITER=0
fi

if (( ITER >= MAX )); then
  log "skip reason=max_iterations ci_fix_iteration=${ITER} max=${MAX}"
  jq -n \
    --arg reason "max_iterations" \
    --argjson ci_fix_iteration "$ITER" \
    --argjson pipeline_id "$PIPELINE_ID" \
    --argjson gitlab_project_id "$PROJECT_ID" \
    '{skip:true, reason:$reason, ci_fix_iteration:$ci_fix_iteration, pipeline_id:$pipeline_id, gitlab_project_id:$gitlab_project_id}'
  exit 0
fi

if [[ -n "${GITLAB_TOKEN:-}" ]]; then
  GL_HEADER=(-H "PRIVATE-TOKEN: ${GITLAB_TOKEN}")
  AUTH_MODE="private_token"
else
  if [[ -z "${CI_JOB_TOKEN:-}" ]]; then
    echo "collect-ci-fix-context: need GITLAB_TOKEN or CI_JOB_TOKEN" >&2
    exit 1
  fi
  GL_HEADER=(-H "JOB-TOKEN: ${CI_JOB_TOKEN}")
  AUTH_MODE="job_token"
fi

log "project=${PROJECT_ID} pipeline=${PIPELINE_ID} auth_mode=${AUTH_MODE} gitlab_token_present=$([[ -n "${GITLAB_TOKEN:-}" ]] && echo yes || echo no)"
log "fetch pipeline metadata: ${API_BASE}/projects/${PROJECT_ID}/pipelines/${PIPELINE_ID}"
PIPELINE_JSON="$(curl -fsS "${GL_HEADER[@]}" "${API_BASE}/projects/${PROJECT_ID}/pipelines/${PIPELINE_ID}")"
SHA="$(echo "$PIPELINE_JSON" | jq -r '.sha // empty')"
REF="$(echo "$PIPELINE_JSON" | jq -r '.ref // empty')"
PIPELINE_URL="$(echo "$PIPELINE_JSON" | jq -r '.web_url // empty')"
TARGET_BRANCH="${CI_MERGE_REQUEST_TARGET_BRANCH_NAME:-}"

if [[ -z "$SHA" || -z "$REF" ]]; then
  echo "collect-ci-fix-context: pipeline metadata missing sha/ref" >&2
  exit 1
fi
if [[ -z "$PIPELINE_URL" || "$PIPELINE_URL" == "null" ]]; then
  PIPELINE_URL="${CI_PIPELINE_URL:-${CI_PROJECT_URL:-}/-/pipelines/${PIPELINE_ID}}"
fi

log "fetch pipeline jobs: ${API_BASE}/projects/${PROJECT_ID}/pipelines/${PIPELINE_ID}/jobs"
JOBS_JSON="$(curl -fsS "${GL_HEADER[@]}" "${API_BASE}/projects/${PROJECT_ID}/pipelines/${PIPELINE_ID}/jobs")"
FAILED_JSON="$(echo "$JOBS_JSON" | jq -c '[.[] | select(.status == "failed" and (.allow_failure == false or .allow_failure == null))] | sort_by(.id) | .[0] // empty')"
if [[ -z "$FAILED_JSON" || "$FAILED_JSON" == "null" ]]; then
  log "skip reason=no_failed_job"
  jq -n \
    --arg reason "no_failed_job" \
    --argjson ci_fix_iteration "$ITER" \
    --argjson pipeline_id "$PIPELINE_ID" \
    --argjson gitlab_project_id "$PROJECT_ID" \
    '{skip:true, reason:$reason, ci_fix_iteration:$ci_fix_iteration, pipeline_id:$pipeline_id, gitlab_project_id:$gitlab_project_id}'
  exit 0
fi

JOB_ID="$(echo "$FAILED_JSON" | jq -r '.id')"
JOB_NAME="$(echo "$FAILED_JSON" | jq -r '.name')"
JOB_STAGE="$(echo "$FAILED_JSON" | jq -r '.stage')"
log "selected failed job id=${JOB_ID} name=${JOB_NAME} stage=${JOB_STAGE}"
TRACE_ENDPOINT="${API_BASE}/projects/${PROJECT_ID}/jobs/${JOB_ID}/trace"
log "fetch trace: ${TRACE_ENDPOINT}"
TRACE_TMP="$(mktemp)"
TRACE_HTTP_CODE="$(
  curl -sS -o "${TRACE_TMP}" -w "%{http_code}" "${GL_HEADER[@]}" "${TRACE_ENDPOINT}" || true
)"
if [[ "${TRACE_HTTP_CODE}" != "200" ]]; then
  TRACE_ERROR_PREVIEW="$(head -c 400 "${TRACE_TMP}" | tr '\n' ' ')"
  log "trace fetch non-200 status=${TRACE_HTTP_CODE}; preview=${TRACE_ERROR_PREVIEW}"
fi
TRACE_RAW="$(cat "${TRACE_TMP}")"
rm -f "${TRACE_TMP}"
TRACE="$(printf '%s' "$TRACE_RAW" | tail -c 100000)"
log "trace bytes=${#TRACE}"

JN="$(printf '%s' "$JOB_NAME" | tr '[:upper:]' '[:lower:]')"
JS="$(printf '%s' "$JOB_STAGE" | tr '[:upper:]' '[:lower:]')"
if [[ "$JN" == *test* ]] || [[ "$JS" == "test" ]]; then
  VERIFICATION="gitlab_pipeline"
else
  VERIFICATION="local_commands"
fi

jq -n \
  --argjson gitlab_project_id "$PROJECT_ID" \
  --argjson pipeline_id "$PIPELINE_ID" \
  --arg sha "$SHA" \
  --arg ref "$REF" \
  --arg target_branch "$TARGET_BRANCH" \
  --argjson job_id "$JOB_ID" \
  --arg job_name "$JOB_NAME" \
  --arg job_stage "$JOB_STAGE" \
  --arg pipeline_url "$PIPELINE_URL" \
  --arg log_excerpt "$TRACE" \
  --argjson ci_fix_iteration "$ITER" \
  --arg source "gitlab_ci" \
  --arg verification "$VERIFICATION" \
  '{
    skip: false,
    gitlab_project_id: $gitlab_project_id,
    pipeline_id: $pipeline_id,
    sha: $sha,
    ref: $ref,
    target_branch: ($target_branch | select(length > 0)?),
    job_id: $job_id,
    job_name: $job_name,
    job_stage: $job_stage,
    pipeline_url: $pipeline_url,
    log_excerpt: $log_excerpt,
    ci_fix_iteration: $ci_fix_iteration,
    source: $source,
    verification: $verification
  }'

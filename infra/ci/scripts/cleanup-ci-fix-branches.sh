#!/usr/bin/env bash
# Delete ci-fix/* branches by target-branch disposal policy.
# Policy: once any ci-fix/* MR has been merged into target T, all other ci-fix/*
# branches targeting T are disposable (protected branches are always kept).

set -euo pipefail

API_BASE="${GITLAB_API_URL:-https://gitlab.com/api/v4}"
API_BASE="${API_BASE%/}"
PROJECT_ID="${CI_PROJECT_ID:-}"
TOKEN="${GITLAB_TOKEN:-}"
DRY_RUN="${CI_FIX_CLEANUP_DRY_RUN:-1}"

if [[ -z "$PROJECT_ID" ]]; then
  echo "ci-fix-cleanup: CI_PROJECT_ID is required" >&2
  exit 1
fi

if [[ -z "$TOKEN" ]]; then
  echo "ci-fix-cleanup: GITLAB_TOKEN is required" >&2
  exit 1
fi

urlencode() {
  jq -rn --arg value "$1" '$value|@uri'
}

gitlab_get() {
  curl -fsS -H "PRIVATE-TOKEN: ${TOKEN}" "$1"
}

gitlab_delete() {
  curl -fsS -X DELETE -H "PRIVATE-TOKEN: ${TOKEN}" "$1"
}

echo "ci-fix-cleanup: project=${PROJECT_ID} dry_run=${DRY_RUN}"

declare -A merged_target_cache
declare -A deleted_by_target

has_merged_ci_fix_mr_for_target() {
  local target_branch="$1"
  if [[ -n "${merged_target_cache[$target_branch]+x}" ]]; then
    echo "${merged_target_cache[$target_branch]}"
    return 0
  fi

  local page=1
  while :; do
    local encoded_target
    encoded_target="$(urlencode "$target_branch")"
    local mrs_url="${API_BASE}/projects/${PROJECT_ID}/merge_requests?state=merged&target_branch=${encoded_target}&per_page=100&page=${page}"
    local mrs_json
    mrs_json="$(gitlab_get "$mrs_url")"
    local mr_count
    mr_count="$(jq 'length' <<<"$mrs_json")"
    if [[ "$mr_count" -eq 0 ]]; then
      break
    fi
    local has_merged_ci_fix
    has_merged_ci_fix="$(jq 'any(.[]; (.source_branch // "") | startswith("ci-fix/"))' <<<"$mrs_json")"
    if [[ "$has_merged_ci_fix" == "true" ]]; then
      merged_target_cache["$target_branch"]="true"
      echo "true"
      return 0
    fi
    if (( mr_count < 100 )); then
      break
    fi
    page=$((page + 1))
  done

  merged_target_cache["$target_branch"]="false"
  echo "false"
}

find_target_branch_for_source() {
  local source_branch="$1"
  local encoded_source
  encoded_source="$(urlencode "$source_branch")"
  local page=1
  while :; do
    local mrs_url="${API_BASE}/projects/${PROJECT_ID}/merge_requests?state=all&source_branch=${encoded_source}&order_by=updated_at&sort=desc&per_page=100&page=${page}"
    local mrs_json
    mrs_json="$(gitlab_get "$mrs_url")"
    local mr_count
    mr_count="$(jq 'length' <<<"$mrs_json")"
    if [[ "$mr_count" -eq 0 ]]; then
      echo ""
      return 0
    fi
    local target_branch
    target_branch="$(jq -r '[.[] | select((.target_branch // "") != "")][0].target_branch // empty' <<<"$mrs_json")"
    if [[ -n "$target_branch" ]]; then
      echo "$target_branch"
      return 0
    fi
    if (( mr_count < 100 )); then
      break
    fi
    page=$((page + 1))
  done
  echo ""
}

deleted=0
kept_protected=0
kept_other=0
kept_unmapped_target=0
kept_no_trigger=0
checked=0

page=1
while :; do
  branches_url="${API_BASE}/projects/${PROJECT_ID}/repository/branches?per_page=100&page=${page}&search=ci-fix/"
  branches_json="$(gitlab_get "$branches_url")"
  branch_count="$(jq 'length' <<<"$branches_json")"
  if [[ "$branch_count" -eq 0 ]]; then
    break
  fi

  while IFS= read -r branch; do
    checked=$((checked + 1))
    name="$(jq -r '.name' <<<"$branch")"
    protected="$(jq -r '.protected // false' <<<"$branch")"
    if [[ "$name" != ci-fix/* ]]; then
      kept_other=$((kept_other + 1))
      continue
    fi
    if [[ "$protected" == "true" ]]; then
      kept_protected=$((kept_protected + 1))
      continue
    fi

    target_branch="$(find_target_branch_for_source "$name")"
    if [[ -z "$target_branch" ]]; then
      kept_unmapped_target=$((kept_unmapped_target + 1))
      continue
    fi

    has_trigger="$(has_merged_ci_fix_mr_for_target "$target_branch")"
    if [[ "$has_trigger" != "true" ]]; then
      kept_no_trigger=$((kept_no_trigger + 1))
      continue
    fi

    encoded_name="$(urlencode "$name")"
    delete_url="${API_BASE}/projects/${PROJECT_ID}/repository/branches/${encoded_name}"
    if [[ "$DRY_RUN" == "1" ]]; then
      echo "ci-fix-cleanup: dry_run delete branch=${name} target_branch=${target_branch} reason=target_disposable"
    else
      gitlab_delete "$delete_url" >/dev/null
      echo "ci-fix-cleanup: deleted branch=${name} target_branch=${target_branch} reason=target_disposable"
    fi
    deleted_by_target["$target_branch"]=$(( ${deleted_by_target["$target_branch"]:-0} + 1 ))
    deleted=$((deleted + 1))
  done < <(jq -c '.[]' <<<"$branches_json")

  if (( branch_count < 100 )); then
    break
  fi
  page=$((page + 1))
done

for target in "${!deleted_by_target[@]}"; do
  echo "ci-fix-cleanup: deleted_by_target target_branch=${target} count=${deleted_by_target[$target]}"
done

echo "ci-fix-cleanup: summary checked=${checked} deleted=${deleted} kept_protected=${kept_protected} kept_unmapped_target=${kept_unmapped_target} kept_no_trigger=${kept_no_trigger} kept_other=${kept_other}"

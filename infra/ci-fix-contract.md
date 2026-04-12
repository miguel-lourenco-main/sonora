# CI-only CI fix contract

Canonical contract for the CI-only flow:

1. Job `ci_fix` runs `infra/ci/scripts/collect-ci-fix-context.sh`, then `node infra/ci/scripts/gitlab-run-ci-fix.mjs` (same pipeline job).

This replaces the prior CI -> n8n -> executor runtime path.

## Backends (`CI_FIX_BACKEND`)

| Value | Behavior |
|-------|----------|
| `cursor` (default) | **Cursor Agent CLI** (`agent -p --force --trust`) edits the checked-out repo; runner runs ESLint gate (when enabled), bumps `.ci-fix-iteration`, **`git commit`**, **`git push`** with GitLab HTTPS Basic token auth, then opens a merge request if none exists. |
| `openai` | Legacy path: OpenAI returns JSON with full file contents; runner commits via **GitLab Repository API** (no Cursor CLI). Requires `OPENAI_API_KEY`. |

Use `openai` only if Cursor CLI cannot be installed on the runner or policy blocks it.

## Context JSON (`ci-fix-context.json`)

Produced by `collect-ci-fix-context.sh`.

### Success payload

```json
{
  "skip": false,
  "gitlab_project_id": 123456,
  "pipeline_id": 7890,
  "sha": "a1b2...",
  "ref": "main",
  "target_branch": "main",
  "job_id": 1111,
  "job_name": "test",
  "job_stage": "test",
  "pipeline_url": "https://gitlab.com/group/project/-/pipelines/7890",
  "log_excerpt": "...tail of failing trace...",
  "ci_fix_iteration": 0,
  "source": "gitlab_ci",
  "verification": "gitlab_pipeline"
}
```

### Skip payload

```json
{
  "skip": true,
  "reason": "max_iterations",
  "ci_fix_iteration": 5,
  "pipeline_id": 7890,
  "gitlab_project_id": 123456
}
```

`reason` can be:

- `max_iterations`
- `no_failed_job`

## Verification enum

- `gitlab_pipeline`: failing job looks test-like (`job_name` contains `test` or stage is `test`)
- `local_commands`: other failures (lint/typecheck/build style)

## Cursor backend (default)

- **Install:** `ci_fix` job runs the official install script (`curl … \| bash`) and adds `~/.local/bin` to `PATH` for the `agent` binary.
- **Auth:** `CURSOR_API_KEY` (masked CI variable). Optional `CURSOR_AGENT_BIN` if `agent` is not on `PATH`.
- **Prompt:** Built in-process from job metadata + `log_excerpt` (tail). The agent reads the workspace at the pipeline commit.
- **ESLint gate:** When `CI_FIX_LINT_VALIDATE` is not `0` and `verification === "local_commands"`, the runner runs ESLint on changed JS/TS paths (`pnpm --filter web exec eslint …` for files under `apps/web/` with paths relative to that package; `pnpm exec eslint …` for other packages). On failure, the runner **`git reset --hard`** + **`git clean -fd`** and the job fails.
- **Commit:** Local `git` commit with idempotency marker; **not** the GitLab commits API for file contents.
- **Push:** `git push` over HTTPS using GitLab token **Basic auth** (`username:token`, typically `oauth2:${GITLAB_TOKEN}`), via `http.extraHeader=Authorization: Basic ...`.
- **Auto-merge (optional):** When `CI_FIX_AUTO_MERGE=1`, runner requests merge-when-pipeline-succeeds on the generated/reused MR. Policy/state blockers (conflicts, approvals, not mergeable yet) are reported as non-fatal in `ci-fix-result.json`.

## Pipeline trigger behavior

- `workflow.rules` skip **push** pipelines for `ci-fix/*` branches.
- MR pipelines are still allowed, so fix validation still runs on merge requests.
- Scheduled cleanup uses `CI_PIPELINE_SOURCE == "schedule"` with `CI_FIX_CLEANUP=1`.

## Scheduled CI-fix branch disposal

- Job: `ci_fix_cleanup_branches` (scheduled only).
- Script: `infra/ci/scripts/cleanup-ci-fix-branches.sh`.
- Branch scope: only `ci-fix/*`.
- Disposal policy:
  - find target branch `T` per `ci-fix/*` source branch via MR metadata,
  - if any merged `ci-fix/*` MR exists for target `T`, all other `ci-fix/*` branches targeting `T` are disposable,
  - protected branches are always kept,
  - dry-run by default (`CI_FIX_CLEANUP_DRY_RUN=1`).
- Examples:
  - if `ci-fix/a` merges into `main`, cleanup can delete other `ci-fix/*` branches targeting `main`,
  - branches targeting `release/1.2` remain untouched unless a `ci-fix/* -> release/1.2` MR is merged.

## OpenAI backend (legacy)

`gitlab-run-ci-fix.mjs` calls OpenAI Chat Completions with JSON-only output:

```json
{
  "summary": "short summary",
  "commit_message": "ci-fix: ...",
  "files": [
    { "path": "apps/web/foo.ts", "content": "full file content after fix" }
  ]
}
```

Guardrails:

- `files` must be non-empty
- max files: `CI_FIX_MAX_FILES` (default `20`)
- per-file max bytes: `CI_FIX_MAX_BYTES_PER_FILE` (default `500000`)
- allowed paths: `CI_FIX_ALLOWED_PATH_PREFIXES`
- path traversal and absolute paths are rejected

GitLab writes use the **Repository Commits API** (create/update actions) and optionally opens an MR.

## GitLab write behavior (both backends)

- Source branch: `ci-fix/pipeline-{pipeline_id}-iter-{ci_fix_iteration}` (optional `CI_FIX_BRANCH_SUFFIX`)
- `.ci-fix-iteration` is bumped by the runner (do not let the model commit it in OpenAI mode; Cursor prompt tells the agent not to edit it)

## Result JSON (`ci-fix-result.json`)

### Success (Cursor)

```json
{
  "ok": true,
  "backend": "cursor",
  "mr_url": "https://gitlab.com/group/project/-/merge_requests/42",
  "source_branch": "ci-fix/pipeline-7890-iter-0",
  "target_branch": "main",
  "files_count": 2,
  "marker": "ci-fix-run:7890:0",
  "auto_merge": {
    "enabled": true,
    "requested": true,
    "ok": true
  }
}
```

### Success (OpenAI)

```json
{
  "ok": true,
  "mr_url": "https://gitlab.com/group/project/-/merge_requests/42",
  "source_branch": "ci-fix/pipeline-7890-iter-0",
  "target_branch": "main",
  "files_count": 2,
  "marker": "ci-fix-run:7890:0",
  "auto_merge": {
    "enabled": true,
    "requested": true,
    "ok": false,
    "reason": "blocked_by_policy_or_state"
  }
}
```

### Dry run success (`CI_FIX_DRY_RUN=1`)

```json
{
  "ok": true,
  "dry_run": true,
  "backend": "cursor",
  "source_branch": "ci-fix/pipeline-7890-iter-0",
  "target_branch": "main",
  "marker": "ci-fix-run:7890:0"
}
```

### Failure

```json
{
  "ok": false,
  "error": "human-safe error"
}
```

### Skip (already processed)

```json
{
  "ok": true,
  "skipped": true,
  "reason": "already_processed",
  "marker": "ci-fix-run:2432338633:1"
}
```

## Idempotency marker

- Marker format: `ci-fix-run:<pipeline_id>:<iteration>`.
- Runner appends this marker to successful commit messages as a stable trailer.
- Before commit/MR work, runner checks latest commit on the working branch and skips if marker matches.
- Dedupe key is `(pipeline_id, iteration)`; iteration alone is not enough because many pipelines can share the same iteration.

## Required CI/CD variables

**Default (Cursor):**

- `GITLAB_TOKEN` (GitLab API + HTTPS git push auth)
- `CURSOR_API_KEY`

**OpenAI backend (`CI_FIX_BACKEND=openai`):**

- `GITLAB_TOKEN`
- `OPENAI_API_KEY`

## Optional CI/CD variables

- `CI_FIX_BACKEND` — `cursor` (default) or `openai`
- `CURSOR_AGENT_BIN` — path to `agent` if not in `PATH`
- `GITLAB_API_URL` (default `https://gitlab.com/api/v4`)
- `OPENAI_MODEL` (default `gpt-4o-mini`) — OpenAI backend only
- `CI_FIX_MAX_ITERATIONS` (default `5`) — collect script
- `CI_FIX_ALLOWED_PATH_PREFIXES`
- `CI_FIX_MAX_FILES` — OpenAI backend
- `CI_FIX_MAX_BYTES_PER_FILE`
- `CI_FIX_LINT_VALIDATE` — set to `0` to disable ESLint gate (Cursor backend; default on except when disabled)
- `CI_FIX_DRY_RUN` (`1` => no agent push / no OpenAI writes)
- `CI_FIX_CONTEXT_PATH` (default `ci-fix-context.json`, optional path override for local/dev invocation)
- `CI_FIX_RESULT_PATH` (default `ci-fix-result.json`)
- `CI_FIX_BRANCH_SUFFIX` (optional suffix for source branch naming)
- `CI_FIX_AUTO_MERGE` (`1` => request auto-merge for CI-fix MR)
- `CI_FIX_REMOVE_SOURCE_BRANCH` (`0` => keep source branch after merge; default removes source branch)
- `CI_FIX_AUTO_MERGE_ATTEMPTS` (default `8`; retries while GitLab mergeability is still settling)
- `CI_FIX_AUTO_MERGE_DELAY_MS` (default `4000`; delay between auto-merge retries)
- `CI_FIX_CLEANUP` (`1` on scheduled pipelines to run cleanup-only workflow)
- `CI_FIX_CLEANUP_DRY_RUN` (`1` default; set `0` to actually delete disposable branches)

## Local testing

1. Build context from an existing failed pipeline:

```bash
GITLAB_TOKEN=... GITLAB_PROJECT_ID=123 \
  ./infra/ci/collect-ci-fix-context-local.sh 7890 > ci-fix-context.json
```

2. Dry-run the runner (Cursor backend; no commit/push):

```bash
export PATH="$HOME/.local/bin:$PATH"
GITLAB_TOKEN=... CURSOR_API_KEY=... CI_FIX_DRY_RUN=1 \
  node infra/ci/scripts/gitlab-run-ci-fix.mjs ci-fix-context.json
cat ci-fix-result.json
```

3. OpenAI backend dry-run:

```bash
GITLAB_TOKEN=... OPENAI_API_KEY=... CI_FIX_BACKEND=openai CI_FIX_DRY_RUN=1 \
  node infra/ci/scripts/gitlab-run-ci-fix.mjs ci-fix-context.json
```

4. Remove `CI_FIX_DRY_RUN=1` to execute real branch/commit/MR creation (use a test project).

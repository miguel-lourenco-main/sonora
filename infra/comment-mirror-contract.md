# Comment mirror contract

Canonical contract for the `comment_mirror` CI flow.

## Flow

1. Job `comment_mirror` runs `node infra/ci/scripts/gitlab-run-comment-mirror.mjs`.
2. Runner reads CI metadata from environment variables.
3. Runner updates persistent branch `comment-mirror/main` only when changes are comment-only.
4. Runner writes `comment-mirror-result.json` artifact.

## Runner input (environment)

### Required

- `CI_PROJECT_ID`
- `CI_PIPELINE_ID`
- `CI_COMMIT_SHA`
- `CI_COMMIT_REF_NAME`
- `CI_PIPELINE_SOURCE`
- `GITLAB_TOKEN`
- `CURSOR_API_KEY` (required unless `COMMENT_MIRROR_DRY_RUN=1`)

### Optional

- `CI_PIPELINE_URL`
- `GITLAB_API_URL` (default `https://gitlab.com/api/v4`)
- `CURSOR_AGENT_BIN` (default `agent`)
- `COMMENT_MIRROR_BRANCH` (default `comment-mirror/main`)
- `COMMENT_MIRROR_TARGET_BRANCH` (default `main`)
- `COMMENT_MIRROR_ALLOWED_PATH_PREFIXES` (default includes `app/`, `apps/`, `lib/`, `public/`, `scripts/`, `infra/`, and related source roots — see `gitlab-run-comment-mirror.mjs`)
- `COMMENT_MIRROR_MAX_FILES` (default `120`)
- `COMMENT_MIRROR_MAX_BYTES_PER_FILE` (default `500000`)
- `COMMENT_MIRROR_DRY_RUN` (`1` enables dry-run)
- `COMMENT_MIRROR_DEBUG` (`1` enables verbose logs)
- `COMMENT_MIRROR_RUN_ON_MAIN_ONLY` (default enabled; set `0` to disable)
- `COMMENT_MIRROR_RESULT_PATH` (default `comment-mirror-result.json`)

## Skip reasons

- `unsupported_pipeline_source`
- `non_target_branch`
- `missing_pipeline_context`
- `already_processed`
- `no_comment_changes`

## Safety guardrails

- Treat Cursor output as untrusted and validate with deterministic checks.
- Changed files must remain inside `COMMENT_MIRROR_ALLOWED_PATH_PREFIXES`.
- Reject sensitive/generated/binary files (`.env*`, lockfiles, binary extensions, build outputs).
- Reject diffs containing non-comment additions/removals.
- Limit blast radius with `COMMENT_MIRROR_MAX_FILES` and `COMMENT_MIRROR_MAX_BYTES_PER_FILE`.
- Never open MR and never auto-merge in this flow.

## Idempotency

- Marker format: `comment-mirror-run:<pipeline_id>:<short_sha>`.
- Runner checks latest commit on `COMMENT_MIRROR_BRANCH`.
- If same marker is already present, runner skips with `already_processed`.

## Result JSON (`comment-mirror-result.json`)

### Success

```json
{
  "ok": true,
  "backend": "cursor",
  "source_branch": "comment-mirror/main",
  "target_branch": "main",
  "files_count": 3,
  "marker": "comment-mirror-run:123456789:ab12cd34ef56"
}
```

### Skip

```json
{
  "ok": true,
  "skipped": true,
  "reason": "already_processed",
  "source_branch": "comment-mirror/main",
  "target_branch": "main",
  "marker": "comment-mirror-run:123456789:ab12cd34ef56"
}
```

### Dry run

```json
{
  "ok": true,
  "dry_run": true,
  "source_branch": "comment-mirror/main",
  "target_branch": "main",
  "marker": "comment-mirror-run:123456789:ab12cd34ef56"
}
```

### Failure

```json
{
  "ok": false,
  "error": "human-safe error message"
}
```

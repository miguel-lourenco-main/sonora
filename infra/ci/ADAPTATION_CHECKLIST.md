# CI Package Adaptation Checklist

Use this checklist after copying `infra/ci` into another project.

## 1) Select modules

- Keep required includes in root `.gitlab-ci.yml`:
  - `templates/base.gitlab-ci.yml`
  - `templates/jobs-quality.gitlab-ci.yml`
- Include optional templates only if needed:
  - `templates/jobs-deploy-vercel.gitlab-ci.yml`
  - `templates/jobs-comment-mirror.gitlab-ci.yml`
  - `templates/jobs-ai-ci-fix.gitlab-ci.yml`
- Set `ENABLE_*` flags to disable optional modules.

## 2) Adapt project commands and paths

- Update package manager bootstrapping if the project does not use `pnpm`.
- Update job commands for `lint`, `typecheck`, `build`, and `test`.
- Update monorepo path assumptions (example: `apps/web`, `apps/e2e`, `packages/`).

## 3) Validate branch and pipeline routing

- Confirm `workflow.rules` match the project branch strategy.
- Confirm MR-only jobs and main-branch-only jobs still match expectations.
- Confirm scheduled jobs are enabled only when explicitly configured.

## 4) Configure variables and secrets by enabled module

- Quality module: project-specific command/runtime variables.
- Vercel module: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
- CI-fix module: `GITLAB_TOKEN`, `CURSOR_API_KEY` (or `OPENAI_API_KEY` with `CI_FIX_BACKEND=openai`).
- Comment-mirror module: `GITLAB_TOKEN`, `CURSOR_API_KEY`.

Do not configure secrets for disabled modules.

## 5) Update contracts when changing data models

- If context/result JSON shape changes, update:
  - `contracts/*.schema.json`
  - `infra/ci-fix-contract.md`
  - `infra/comment-mirror-contract.md`

Keep docs and schema aligned with runtime output.

## 6) Verify DAG and runtime behavior

- Validate pipeline YAML after adaptation.
- Check `needs` do not reference disabled jobs.
- Run at least one MR pipeline and one main push pipeline in a test branch/project.
- Validate generated artifacts (`ci-fix-result.json`, `comment-mirror-result.json`) against expected schema.

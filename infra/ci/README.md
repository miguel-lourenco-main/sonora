# Reusable CI Package

This directory is the copy-and-adapt CI/CD package for this repository.

## Package layout

- `templates/base.gitlab-ci.yml`: shared workflow, stages, caches, variables, and hidden reusable job blocks.
- `templates/jobs-quality.gitlab-ci.yml`: translation sync + quality gates (`lint`, `typecheck`, `build`, `test`).
- `templates/jobs-deploy-vercel.gitlab-ci.yml`: optional Vercel preview and production jobs.
- `templates/jobs-comment-mirror.gitlab-ci.yml`: optional comment-mirror automation.
- `templates/jobs-ai-ci-fix.gitlab-ci.yml`: optional CI-fix flow and scheduled cleanup job.
- `scripts/`: stable script entrypoints used by templates.
- `contracts/`: JSON schemas for CI input and result payloads.

## Feature flags

The base template defines safe feature flags:

- `ENABLE_VERCEL_DEPLOY` (`1` by default in this repo)
- `ENABLE_COMMENT_MIRROR` (`1` by default in this repo)
- `ENABLE_CI_FIX` (`1` by default in this repo)

Set any of these to `0` per project to disable that module without editing job definitions.

## Root pipeline usage

Root `.gitlab-ci.yml` should stay thin and only compose modules via includes:

- `infra/ci/templates/base.gitlab-ci.yml`
- `infra/ci/templates/jobs-quality.gitlab-ci.yml`
- optional module templates as needed by the project

## Script entrypoints used by jobs

- `infra/ci/scripts/collect-ci-fix-context.sh`
- `infra/ci/scripts/gitlab-run-ci-fix.mjs`
- `infra/ci/scripts/cleanup-ci-fix-branches.sh`
- `infra/ci/scripts/gitlab-run-comment-mirror.mjs`

These wrappers provide stable paths for CI templates while allowing internals to evolve.

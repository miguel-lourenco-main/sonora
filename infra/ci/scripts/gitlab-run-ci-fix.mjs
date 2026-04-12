#!/usr/bin/env node
/* CI-only runner: consume context JSON; backend `cursor` (Cursor Agent CLI) or `openai`; commit + MR. */

import { execFileSync, spawnSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

/**
 * @typedef {{
 *   skip?: boolean;
 *   reason?: string;
 *   gitlab_project_id: number;
 *   pipeline_id: number;
 *   sha: string;
 *   ref: string;
 *   target_branch?: string;
 *   job_id: number;
 *   job_name: string;
 *   job_stage: string;
 *   pipeline_url: string;
 *   log_excerpt: string;
 *   verification: 'gitlab_pipeline' | 'local_commands';
 *   ci_fix_iteration: number;
 * }} FixContext
 */

/**
 * @typedef {{
 *   path: string;
 *   content: string;
 * }} ModelFile
 */

/**
 * @typedef {{
 *   summary?: string;
 *   commit_message?: string;
 *   files: ModelFile[];
 * }} ModelProposal
 */

/**
 * @typedef {{
 *   action: 'create' | 'update';
 *   file_path: string;
 *   content: string;
 * }} CommitAction
 */

const CONTEXT_PATH = process.argv[2] || process.env.CI_FIX_CONTEXT_PATH || 'ci-fix-context.json';
const RESULT_PATH = process.env.CI_FIX_RESULT_PATH || 'ci-fix-result.json';

const ENV = {
  backend: (process.env.CI_FIX_BACKEND || 'cursor').toLowerCase(),
  dryRun: process.env.CI_FIX_DRY_RUN === '1',
  apiBase: (process.env.GITLAB_API_URL || 'https://gitlab.com/api/v4').replace(/\/$/, ''),
  token: process.env.GITLAB_TOKEN || '',
  cursorApiKey: process.env.CURSOR_API_KEY || '',
  agentBin: process.env.CURSOR_AGENT_BIN || 'agent',
  openaiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  lintValidate: process.env.CI_FIX_LINT_VALIDATE !== '0',
  allowedPrefixes: normalizePathPrefixes(
    process.env.CI_FIX_ALLOWED_PATH_PREFIXES ||
      'apps/,packages/,tooling/,scripts/,infra/,.gitlab-ci.yml,.ci-fix-iteration',
  ),
  maxFiles: parsePositiveInt(process.env.CI_FIX_MAX_FILES, 20),
  maxBytesPerFile: parsePositiveInt(process.env.CI_FIX_MAX_BYTES_PER_FILE, 500000),
  branchSuffix: sanitizeBranchSuffix(process.env.CI_FIX_BRANCH_SUFFIX || ''),
  autoMerge: process.env.CI_FIX_AUTO_MERGE === '1',
  removeSourceBranch: process.env.CI_FIX_REMOVE_SOURCE_BRANCH !== '0',
  autoMergeAttempts: parsePositiveInt(process.env.CI_FIX_AUTO_MERGE_ATTEMPTS, 8),
  autoMergeDelayMs: parsePositiveInt(process.env.CI_FIX_AUTO_MERGE_DELAY_MS, 4000),
};

main().catch(async (error) => {
  const message = error instanceof Error ? error.message : String(error);
  await writeResult({ ok: false, error: message });
  console.error(`ci-fix-runner: ${message}`);
  process.exit(1);
});

async function main() {
  const context = await readContext(CONTEXT_PATH);
  if (context.skip === true) {
    const result = { ok: true, skipped: true, reason: context.reason || 'skip' };
    await writeResult(result);
    console.log(JSON.stringify(result));
    return;
  }

  validateContext(context);
  requireEnvForBackend();

  const project = await getJson(`/projects/${context.gitlab_project_id}`);
  const defaultBranch = String(project.default_branch || 'main');
  const targetBranch = resolveTargetBranch(context, defaultBranch);
  const sourceBranch = buildSourceBranch(context.pipeline_id, context.ci_fix_iteration);
  const runMarker = buildRunMarker(context);

  await createBranchIfNeeded(context.gitlab_project_id, sourceBranch, context.sha);
  const latestCommit = await getLatestCommitOnBranch(context.gitlab_project_id, sourceBranch);
  if (latestCommit) {
    const latestMarker = extractRunMarkerFromCommitMessage(String(latestCommit.message || ''));
    if (latestMarker === runMarker) {
      const result = {
        ok: true,
        skipped: true,
        reason: 'already_processed',
        marker: runMarker,
        source_branch: sourceBranch,
        target_branch: targetBranch,
      };
      await writeResult(result);
      console.log(
        `ci-fix-runner: skip reason=already_processed marker=${runMarker} commit=${latestCommit.id}`,
      );
      console.log(JSON.stringify(result));
      return;
    }
  }

  if (ENV.backend === 'cursor') {
    await runCursorBackend(context, targetBranch, sourceBranch, runMarker);
    return;
  }

  const proposal = await proposePatch(context);
  const files = validateModelFiles(proposal);

  if (ENV.dryRun) {
    const result = {
      ok: true,
      dry_run: true,
      source_branch: sourceBranch,
      target_branch: targetBranch,
      files_count: files.length,
      summary: proposal.summary || 'dry-run',
      marker: runMarker,
    };
    await writeResult(result);
    console.log(JSON.stringify(result));
    return;
  }

  const actions = [];
  for (const file of files) {
    const action = await commitActionForPath(context.gitlab_project_id, sourceBranch, file.path);
    actions.push({
      action,
      file_path: file.path,
      content: file.content,
    });
  }

  const nextIteration = Number(context.ci_fix_iteration) + 1;
  const iterationAction = await commitActionForPath(
    context.gitlab_project_id,
    sourceBranch,
    '.ci-fix-iteration',
  );
  actions.push({
    action: iterationAction,
    file_path: '.ci-fix-iteration',
    content: `${nextIteration}\n`,
  });

  const uniqueActions = dedupeActions(actions);
  console.log(
    `ci-fix-runner: commit actions=${JSON.stringify(
      uniqueActions.map((a) => ({ action: a.action, file_path: a.file_path })),
    )}`,
  );

  const commitSummary =
    sanitizeLine(proposal.commit_message) ||
    `ci-fix: pipeline ${context.pipeline_id} ${context.job_name}`;
  const commitMessage = withRunMarker(commitSummary, runMarker);

  await createCommitWithRetry(
    context.gitlab_project_id,
    sourceBranch,
    commitMessage,
    uniqueActions,
  );

  const mr = await openMergeRequestIfNeeded(context.gitlab_project_id, {
    source_branch: sourceBranch,
    target_branch: targetBranch,
    title: `ci-fix: pipeline ${context.pipeline_id} (${context.job_name})`,
    description: [
      'Automated CI fix proposal.',
      '',
      `- Pipeline: ${context.pipeline_url}`,
      `- Job: ${context.job_name} (${context.job_stage})`,
      `- Verification hint: ${context.verification}`,
      `- Summary: ${proposal.summary || 'No summary'}`,
    ].join('\n'),
  });
  const autoMerge = await requestAutoMergeIfEnabled(context.gitlab_project_id, mr, sourceBranch);

  const result = {
    ok: true,
    backend: 'openai',
    mr_url: mr.web_url,
    source_branch: sourceBranch,
    target_branch: targetBranch,
    files_count: files.length,
    marker: runMarker,
    auto_merge: autoMerge,
  };
  await writeResult(result);
  console.log(JSON.stringify(result));
}

/**
 * @param {unknown} value
 */
function sanitizeLine(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, 200);
}

/**
 * @param {string | undefined} value
 * @param {number} fallback
 */
function parsePositiveInt(value, fallback) {
  if (!value) return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) return fallback;
  return n;
}

/**
 * @param {string | undefined} value
 * @returns {string[]}
 */
function normalizePathPrefixes(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((prefix) => prefix.replace(/\\/g, '/').replace(/^\/+/, '').replace(/^\.\//, ''));
}

/**
 * @param {unknown} value
 */
function sanitizeBranchSuffix(value) {
  if (typeof value !== 'string' || !value) return '';
  const cleaned = value.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
  return cleaned ? `-${cleaned}` : '';
}

/**
 * @param {FixContext} context
 */
function buildRunMarker(context) {
  return `ci-fix-run:${context.pipeline_id}:${context.ci_fix_iteration}`;
}

/**
 * @param {string} message
 * @returns {string | null}
 */
function extractRunMarkerFromCommitMessage(message) {
  const match = message.match(/^ci-fix-run:\d+:\d+$/m);
  return match ? match[0] : null;
}

/**
 * @param {string} summary
 * @param {string} marker
 */
function withRunMarker(summary, marker) {
  const cleanSummary = summary.trim();
  return `${cleanSummary}\n\n${marker}`;
}

/**
 * @param {number} pipelineId
 * @param {number} iteration
 */
function buildSourceBranch(pipelineId, iteration) {
  return `ci-fix/pipeline-${pipelineId}-iter-${iteration}${ENV.branchSuffix}`;
}

/**
 * @param {string} path
 * @returns {Promise<FixContext>}
 */
async function readContext(path) {
  const raw = await readFile(path, 'utf8');
  return JSON.parse(raw);
}

/**
 * @param {FixContext} context
 */
function validateContext(context) {
  /** @type {(keyof FixContext)[]} */
  const required = [
    'gitlab_project_id',
    'pipeline_id',
    'sha',
    'ref',
    'job_id',
    'job_name',
    'job_stage',
    'pipeline_url',
    'log_excerpt',
    'verification',
    'ci_fix_iteration',
  ];
  for (const key of required) {
    if (context[key] === undefined || context[key] === null || context[key] === '') {
      throw new Error(`context missing ${key}`);
    }
  }
  if (!['gitlab_pipeline', 'local_commands'].includes(String(context.verification))) {
    throw new Error('context verification must be gitlab_pipeline or local_commands');
  }
}

/**
 * Prefer explicit MR target branch; never use synthetic refs/merge-requests/* as MR targets.
 * @param {FixContext} context
 * @param {string} defaultBranch
 */
function resolveTargetBranch(context, defaultBranch) {
  const explicit = String(context.target_branch || '').trim();
  if (explicit) return explicit;
  const ref = String(context.ref || '').trim();
  if (!ref) return defaultBranch;
  if (ref.startsWith('refs/')) return defaultBranch;
  return ref;
}

function requireEnvForBackend() {
  if (!ENV.token) throw new Error('GITLAB_TOKEN is required');
  if (ENV.backend === 'openai') {
    if (!ENV.openaiKey) throw new Error('OPENAI_API_KEY is required');
    return;
  }
  if (ENV.backend === 'cursor') {
    if (!ENV.cursorApiKey) throw new Error('CURSOR_API_KEY is required');
    return;
  }
  throw new Error(`CI_FIX_BACKEND must be cursor or openai (got ${ENV.backend})`);
}

/**
 * @param {FixContext} context
 * @param {string} targetBranch
 * @param {string} sourceBranch
 * @param {string} runMarker
 */
async function runCursorBackend(context, targetBranch, sourceBranch, runMarker) {
  const repoRoot = process.cwd();
  ensureGitIdentity();

  execFileSync('git', ['checkout', '-B', sourceBranch], { cwd: repoRoot, stdio: 'inherit' });

  if (ENV.dryRun) {
    const result = {
      ok: true,
      dry_run: true,
      backend: 'cursor',
      source_branch: sourceBranch,
      target_branch: targetBranch,
      marker: runMarker,
    };
    await writeResult(result);
    console.log(JSON.stringify(result));
    return;
  }

  const prompt = buildCursorAgentPrompt(context);
  runCursorAgentCli(prompt, repoRoot);

  const changed = getGitChangedPaths(repoRoot);
  if (changed.length === 0) {
    throw new Error('ci-fix: Cursor agent made no file changes');
  }

  if (shouldRunLintGate(context)) {
    runEslintOnPaths(repoRoot, changed);
  }

  await bumpCiFixIterationFile(repoRoot);

  const toStage = uniquePaths([...changed, '.ci-fix-iteration']);
  execFileSync('git', ['add', '--', ...toStage], { cwd: repoRoot, stdio: 'inherit' });

  const commitSummary = `ci-fix: pipeline ${context.pipeline_id} ${context.job_name}`;
  const commitMessage = withRunMarker(commitSummary, runMarker);
  execFileSync('git', ['commit', '-m', commitMessage], { cwd: repoRoot, stdio: 'inherit' });

  const pushToken = process.env.GITLAB_TOKEN || '';
  const projectPath = process.env.CI_PROJECT_PATH || '';
  if (!projectPath) {
    throw new Error('CI_PROJECT_PATH is required for git push in CI');
  }
  pushBranchWithTokenAuth(repoRoot, sourceBranch, pushToken);

  const mr = await openMergeRequestIfNeeded(context.gitlab_project_id, {
    source_branch: sourceBranch,
    target_branch: targetBranch,
    title: `ci-fix: pipeline ${context.pipeline_id} (${context.job_name})`,
    description: [
      'Automated CI fix (Cursor Agent CLI).',
      '',
      `- Pipeline: ${context.pipeline_url}`,
      `- Job: ${context.job_name} (${context.job_stage})`,
      `- Verification: ${context.verification}`,
    ].join('\n'),
  });
  const autoMerge = await requestAutoMergeIfEnabled(context.gitlab_project_id, mr, sourceBranch);

  const result = {
    ok: true,
    backend: 'cursor',
    mr_url: mr.web_url,
    source_branch: sourceBranch,
    target_branch: targetBranch,
    files_count: changed.length,
    marker: runMarker,
    auto_merge: autoMerge,
  };
  await writeResult(result);
  console.log(JSON.stringify(result));
}

/**
 * @param {FixContext} context
 */
function buildCursorAgentPrompt(context) {
  return [
    'You are fixing a failing CI job in this monorepo workspace.',
    'Read the files you need using your tools. Apply minimal edits; do not replace modules with stubs.',
    'Preserve exports, types, and structure unless the failure requires otherwise.',
    'Do not edit .ci-fix-iteration.',
    '',
    `job_name=${context.job_name}`,
    `job_stage=${context.job_stage}`,
    `verification=${context.verification}`,
    `ref=${context.ref}`,
    `sha=${context.sha}`,
    `pipeline_url=${context.pipeline_url}`,
    '',
    'Log excerpt:',
    String(context.log_excerpt).slice(-48000),
  ].join('\n');
}

/**
 * @param {string} prompt
 * @param {string} repoRoot
 */
function runCursorAgentCli(prompt, repoRoot) {
  const env = {
    ...process.env,
    CURSOR_API_KEY: ENV.cursorApiKey,
    PATH: process.env.PATH || '',
  };
  const homeBin = path.join(process.env.HOME || '', '.local/bin');
  if (homeBin && !env.PATH.includes(homeBin)) {
    env.PATH = `${homeBin}:${env.PATH}`;
  }
  const r = spawnSync(ENV.agentBin, ['-p', '--force', '--trust', '--output-format', 'text', prompt], {
    cwd: repoRoot,
    env,
    encoding: 'utf8',
    stdio: 'inherit',
    maxBuffer: 50 * 1024 * 1024,
  });
  if (r.error) throw r.error;
  if (r.status !== 0) {
    throw new Error(`Cursor agent exited with code ${r.status ?? 'unknown'}`);
  }
}

/**
 * @param {string} repoRoot
 * @returns {string[]}
 */
function getGitChangedPaths(repoRoot) {
  const unstaged = execFileSync('git', ['diff', '--name-only'], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  const staged = execFileSync('git', ['diff', '--cached', '--name-only'], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return uniquePaths([
    ...splitLines(unstaged),
    ...splitLines(staged),
    ...splitLines(untracked),
  ]);
}

/**
 * @param {string} s
 * @returns {string[]}
 */
function splitLines(s) {
  return s
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * @param {string[]} paths
 */
function uniquePaths(paths) {
  return [...new Set(paths)];
}

/**
 * @param {FixContext} context
 */
function shouldRunLintGate(context) {
  if (!ENV.lintValidate) return false;
  return context.verification === 'local_commands';
}

/**
 * @param {string} repoRoot
 * @param {string[]} changedPaths
 */
function runEslintOnPaths(repoRoot, changedPaths) {
  const eslintTargets = changedPaths.filter(
    (p) =>
      (p.startsWith('apps/web/') || p.startsWith('packages/') || p.startsWith('tooling/')) &&
      /\.(mjs|cjs|js|ts|tsx|jsx)$/.test(p),
  );
  if (eslintTargets.length === 0) {
    console.log('ci-fix-runner: eslint gate skipped (no matching JS/TS paths in changed files)');
    return;
  }
  console.log(`ci-fix-runner: eslint gate on ${eslintTargets.length} file(s)`);
  const webPaths = eslintTargets.filter((p) => p.startsWith('apps/web/'));
  const webRelative = webPaths.map((p) => p.slice('apps/web/'.length));
  const otherPaths = eslintTargets.filter((p) => !p.startsWith('apps/web/'));
  try {
    if (webRelative.length > 0) {
      execFileSync(
        'pnpm',
        ['--filter', 'web', 'exec', 'eslint', ...webRelative, '--max-warnings', '0'],
        { cwd: repoRoot, stdio: 'inherit' },
      );
    }
    if (otherPaths.length > 0) {
      execFileSync('pnpm', ['exec', 'eslint', ...otherPaths, '--max-warnings', '0'], {
        cwd: repoRoot,
        stdio: 'inherit',
      });
    }
  } catch {
    execFileSync('git', ['reset', '--hard', 'HEAD'], { cwd: repoRoot, stdio: 'inherit' });
    execFileSync('git', ['clean', '-fd'], { cwd: repoRoot, stdio: 'inherit' });
    throw new Error('ci-fix: ESLint gate failed on proposed changes (working tree reset)');
  }
}

/**
 * @param {string} repoRoot
 */
async function bumpCiFixIterationFile(repoRoot) {
  const iterPath = path.join(repoRoot, '.ci-fix-iteration');
  let n = 0;
  if (existsSync(iterPath)) {
    const raw = await readFile(iterPath, 'utf8');
    const m = raw.trim().match(/^\d+/);
    n = m ? Number(m[0]) : 0;
  }
  await writeFile(iterPath, `${n + 1}\n`, 'utf8');
}

function ensureGitIdentity() {
  const host = process.env.CI_SERVER_HOST || 'gitlab.com';
  const email = process.env.GITLAB_USER_EMAIL || `gitlab-ci@${host}`;
  const name = process.env.GITLAB_USER_NAME || 'GitLab CI';
  execFileSync('git', ['config', 'user.email', email], { stdio: 'pipe' });
  execFileSync('git', ['config', 'user.name', name], { stdio: 'pipe' });
}

/**
 * GitLab HTTPS push expects Basic auth (username:token), not Bearer.
 * @param {string} repoRoot
 * @param {string} sourceBranch
 * @param {string} token
 */
function pushBranchWithTokenAuth(repoRoot, sourceBranch, token) {
  if (!token) {
    throw new Error('GITLAB_TOKEN is required for git push');
  }
  const candidateUsers = uniquePaths([
    'oauth2',
    process.env.GITLAB_USER_LOGIN || '',
    'gitlab-ci-token',
  ]).filter(Boolean);

  for (const username of candidateUsers) {
    const basic = Buffer.from(`${username}:${token}`, 'utf8').toString('base64');
    try {
      execFileSync(
        'git',
        [
          '-c',
          `http.extraHeader=Authorization: Basic ${basic}`,
          'push',
          'origin',
          `HEAD:${sourceBranch}`,
        ],
        {
          cwd: repoRoot,
          env: { ...process.env },
          stdio: 'inherit',
        },
      );
      return;
    } catch {
      // Continue trying alternative GitLab-compatible usernames.
    }
  }
  throw new Error(
    'ci-fix: git push failed with token auth; verify token scope (write_repository/api) and branch permissions',
  );
}

/**
 * @param {number} projectId
 * @param {{ source_branch: string; target_branch: string; title: string; description: string }} body
 */
async function openMergeRequestIfNeeded(projectId, body) {
  const q = new URLSearchParams({
    source_branch: body.source_branch,
    target_branch: body.target_branch,
    state: 'opened',
  });
  const existing = await getJson(`/projects/${projectId}/merge_requests?${q.toString()}`);
  if (Array.isArray(existing) && existing.length > 0) {
    console.log(`ci-fix-runner: open MR already exists: ${existing[0].web_url}`);
    return existing[0];
  }
  return postJson(`/projects/${projectId}/merge_requests`, body);
}

/**
 * @param {number} projectId
 * @param {{ iid?: number; web_url?: string } | null | undefined} mr
 * @param {string} sourceBranch
 */
async function requestAutoMergeIfEnabled(projectId, mr, sourceBranch) {
  if (!ENV.autoMerge) {
    return { enabled: false, requested: false, ok: false, reason: 'disabled' };
  }
  if (!mr?.iid) {
    return { enabled: true, requested: false, ok: false, reason: 'missing_merge_request_iid' };
  }
  let lastMessage = '';
  let lastMergeStatus = 'unknown';
  let lastDetailedStatus = 'unknown';
  for (let attempt = 1; attempt <= ENV.autoMergeAttempts; attempt += 1) {
    const mrState = await getJson(
      `/projects/${projectId}/merge_requests/${mr.iid}?with_merge_status_recheck=true`,
    );
    lastMergeStatus = String(mrState?.merge_status || 'unknown');
    lastDetailedStatus = String(mrState?.detailed_merge_status || 'unknown');
    try {
      await putJson(`/projects/${projectId}/merge_requests/${mr.iid}/merge`, {
        auto_merge: true,
        merge_when_pipeline_succeeds: true,
        should_remove_source_branch: ENV.removeSourceBranch,
      });
      return {
        enabled: true,
        requested: true,
        ok: true,
        mr_iid: mr.iid,
        source_branch: sourceBranch,
        remove_source_branch: ENV.removeSourceBranch,
        attempts: attempt,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      lastMessage = sanitizeLine(message);
      const retryable =
        /Branch cannot be merged|checking|ci_must_pass|merge_status|405|409|422|method not allowed/i.test(
          message,
        );
      if (!retryable || attempt === ENV.autoMergeAttempts) break;
      await sleep(ENV.autoMergeDelayMs);
    }
  }
  const nonFatal =
    /not mergeable|cannot be merged|conflict|approval|pipeline|405|409|422|method not allowed/i.test(
      lastMessage,
    );
  if (!nonFatal) throw new Error(lastMessage || 'auto-merge request failed');
  return {
    enabled: true,
    requested: true,
    ok: false,
    non_fatal: true,
    reason: 'blocked_by_policy_or_state',
    message: lastMessage || 'auto-merge request failed',
    mr_iid: mr.iid,
    merge_status: lastMergeStatus,
    detailed_merge_status: lastDetailedStatus,
    attempts: ENV.autoMergeAttempts,
  };
}

/**
 * @param {number} ms
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {string} apiPath
 * @returns {Promise<any>}
 */
async function getJson(apiPath) {
  const response = await fetch(`${ENV.apiBase}${apiPath}`, {
    headers: { 'PRIVATE-TOKEN': ENV.token },
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`GitLab GET ${apiPath} failed: ${response.status} ${text}`);
  return JSON.parse(text);
}

/**
 * @param {string} apiPath
 * @param {unknown} body
 * @returns {Promise<any>}
 */
async function postJson(apiPath, body) {
  const response = await fetch(`${ENV.apiBase}${apiPath}`, {
    method: 'POST',
    headers: {
      'PRIVATE-TOKEN': ENV.token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`GitLab POST ${apiPath} failed: ${response.status} ${text}`);
  return text ? JSON.parse(text) : {};
}

/**
 * @param {string} apiPath
 * @param {unknown} body
 * @returns {Promise<any>}
 */
async function putJson(apiPath, body) {
  const response = await fetch(`${ENV.apiBase}${apiPath}`, {
    method: 'PUT',
    headers: {
      'PRIVATE-TOKEN': ENV.token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`GitLab PUT ${apiPath} failed: ${response.status} ${text}`);
  return text ? JSON.parse(text) : {};
}

/**
 * @param {number} projectId
 * @param {string} branch
 * @param {string} commitMessage
 * @param {CommitAction[]} actions
 */
async function createCommitWithRetry(projectId, branch, commitMessage, actions) {
  const commitPath = `/projects/${projectId}/repository/commits`;
  try {
    await postJson(commitPath, {
      branch,
      commit_message: commitMessage,
      actions,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/A file with this name already exists/i.test(message)) {
      throw error;
    }
    // GitLab can intermittently report 404 on file existence checks for new branches.
    // Retry once by forcing create->update for all non-iteration files.
    const patchedActions = actions.map((action) => {
      if (action.file_path === '.ci-fix-iteration') {
        return action;
      }
      if (action.action === 'create') {
        return { ...action, action: 'update' };
      }
      return action;
    });
    console.log(
      `ci-fix-runner: retrying commit after 'file exists' using actions=${JSON.stringify(
        patchedActions.map((a) => ({ action: a.action, file_path: a.file_path })),
      )}`,
    );
    await postJson(commitPath, {
      branch,
      commit_message: commitMessage,
      actions: patchedActions,
    });
  }
}

/**
 * @param {number} projectId
 * @param {string} branch
 * @param {string} ref
 */
async function createBranchIfNeeded(projectId, branch, ref) {
  const encodedRef = encodeURIComponent(ref);
  const encodedBranch = encodeURIComponent(branch);
  try {
    await postJson(`/projects/${projectId}/repository/branches?branch=${encodedBranch}&ref=${encodedRef}`, {});
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (!msg.includes('already exists')) throw error;
  }
}

/**
 * @param {number} projectId
 * @param {string} branch
 * @returns {Promise<{id?: string, message?: string} | null>}
 */
async function getLatestCommitOnBranch(projectId, branch) {
  const response = await fetch(
    `${ENV.apiBase}/projects/${projectId}/repository/commits?ref_name=${encodeURIComponent(branch)}&per_page=1`,
    { headers: { 'PRIVATE-TOKEN': ENV.token } },
  );
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`GitLab GET latest commit failed: ${response.status} ${text}`);
  }
  /** @type {Array<{id?: string, message?: string}>} */
  const list = text ? JSON.parse(text) : [];
  return list[0] ?? null;
}

/**
 * @param {string} path
 */
function encodePath(path) {
  return path.split('/').map(encodeURIComponent).join('/');
}

/**
 * @param {number} projectId
 * @param {string} branch
 * @param {string} path
 * @returns {Promise<'create' | 'update'>}
 */
async function commitActionForPath(projectId, branch, path) {
  const encoded = encodePath(path);
  const ref = encodeURIComponent(branch);
  const response = await fetch(
    `${ENV.apiBase}/projects/${projectId}/repository/files/${encoded}?ref=${ref}`,
    { headers: { 'PRIVATE-TOKEN': ENV.token } },
  );
  if (response.status === 200) {
    console.log(`ci-fix-runner: file lookup path=${path} ref=${branch} status=200 action=update`);
    return 'update';
  }
  if (response.status === 404) {
    console.log(`ci-fix-runner: file lookup path=${path} ref=${branch} status=404 action=create`);
    return 'create';
  }
  const text = await response.text();
  console.log(
    `ci-fix-runner: file lookup path=${path} ref=${branch} status=${response.status} body=${text.slice(0, 300)}`,
  );
  throw new Error(`GitLab file lookup failed (${path}): ${response.status} ${text}`);
}

/**
 * @param {FixContext} context
 * @returns {Promise<ModelProposal>}
 */
async function proposePatch(context) {
  const prompt = [
    'You are a senior engineer fixing CI failures in a monorepo.',
    'Return only JSON with shape:',
    '{"summary":"...","commit_message":"...","files":[{"path":"...","content":"..."}]}',
    'Rules:',
    '- files must include complete final file contents (not diff).',
    `- at most ${ENV.maxFiles} files.`,
    `- allowed prefixes only: ${ENV.allowedPrefixes.join(', ')}`,
    '- avoid path traversal and absolute paths.',
    '',
    `verification=${context.verification}`,
    `pipeline=${context.pipeline_url}`,
    `job=${context.job_name} stage=${context.job_stage}`,
    `ref=${context.ref} sha=${context.sha}`,
    'log excerpt:',
    String(context.log_excerpt).slice(-48000),
  ].join('\n');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ENV.openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: ENV.openaiModel,
      response_format: { type: 'json_object' },
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'Output valid JSON only.' },
        { role: 'user', content: prompt },
      ],
    }),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`OpenAI call failed: ${response.status} ${text}`);
  }
  const parsed = JSON.parse(text);
  const content = parsed?.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenAI response missing message content');
  let proposal;
  try {
    proposal = JSON.parse(content);
  } catch {
    throw new Error('OpenAI response content is not valid JSON');
  }
  return proposal;
}

/**
 * @param {ModelProposal} proposal
 * @returns {ModelFile[]}
 */
function validateModelFiles(proposal) {
  if (!proposal || !Array.isArray(proposal.files) || proposal.files.length === 0) {
    throw new Error('model output must contain a non-empty files array');
  }
  if (proposal.files.length > ENV.maxFiles) {
    throw new Error(`model output exceeds CI_FIX_MAX_FILES (${ENV.maxFiles})`);
  }

  const seen = new Set();
  const files = proposal.files.map((entry, index) => {
    const path = normalizePath(String(entry?.path || ''));
    const content = String(entry?.content ?? '');
    if (!path) throw new Error(`files[${index}] path is empty`);
    if (path === '.ci-fix-iteration') {
      throw new Error('model output must not include .ci-fix-iteration (reserved for runner)');
    }
    if (content.length > ENV.maxBytesPerFile) {
      throw new Error(`files[${index}] exceeds CI_FIX_MAX_BYTES_PER_FILE`);
    }
    if (!isSafePath(path)) throw new Error(`disallowed path: ${path}`);
    if (seen.has(path)) throw new Error(`duplicate path in model output: ${path}`);
    seen.add(path);
    return { path, content };
  });
  return files;
}

/**
 * @param {string} path
 */
function isSafePath(path) {
  const normalized = normalizePath(path);
  if (!normalized || normalized.includes('..')) return false;
  for (const prefix of ENV.allowedPrefixes) {
    const p = prefix.replace(/^\/+/, '');
    if (!p) continue;
    if (p.includes('/') || p.endsWith('/')) {
      const dir = p.endsWith('/') ? p.slice(0, -1) : p;
      if (normalized === dir || normalized.startsWith(`${dir}/`)) return true;
    } else if (normalized === p) {
      return true;
    }
  }
  return false;
}

/**
 * @param {string} path
 */
function normalizePath(path) {
  return path.replace(/\\/g, '/').replace(/^\/+/, '').replace(/^\.\//, '').trim();
}

/**
 * @param {CommitAction[]} actions
 * @returns {CommitAction[]}
 */
function dedupeActions(actions) {
  const byPath = new Map();
  for (const action of actions) {
    byPath.set(action.file_path, action);
  }
  return Array.from(byPath.values());
}

/**
 * @param {unknown} result
 */
async function writeResult(result) {
  await writeFile(RESULT_PATH, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
}

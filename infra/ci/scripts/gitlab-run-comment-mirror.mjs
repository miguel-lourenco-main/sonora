#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const RESULT_PATH = process.env.COMMENT_MIRROR_RESULT_PATH || 'comment-mirror-result.json'

const ENV = {
  apiBase: (process.env.GITLAB_API_URL || 'https://gitlab.com/api/v4').replace(/\/$/, ''),
  token: process.env.GITLAB_TOKEN || '',
  cursorApiKey: process.env.CURSOR_API_KEY || '',
  agentBin: process.env.CURSOR_AGENT_BIN || 'agent',
  projectId: process.env.CI_PROJECT_ID || '',
  pipelineId: process.env.CI_PIPELINE_ID || '',
  sha: process.env.CI_COMMIT_SHA || '',
  ref: process.env.CI_COMMIT_REF_NAME || '',
  pipelineUrl: process.env.CI_PIPELINE_URL || '',
  pipelineSource: process.env.CI_PIPELINE_SOURCE || '',
  sourceBranch: process.env.COMMENT_MIRROR_BRANCH || 'comment-mirror/main',
  targetBranch: process.env.COMMENT_MIRROR_TARGET_BRANCH || 'main',
  runOnMainOnly: process.env.COMMENT_MIRROR_RUN_ON_MAIN_ONLY !== '0',
  dryRun: process.env.COMMENT_MIRROR_DRY_RUN === '1',
  debug: process.env.COMMENT_MIRROR_DEBUG === '1',
  allowedPrefixes: normalizePathPrefixes(
    process.env.COMMENT_MIRROR_ALLOWED_PATH_PREFIXES ||
      'app/,apps/,packages/,components/,lib/,utils/,hooks/,types/,styles/,assets/,public/,content/,tooling/,scripts/,infra/,config/',
  ),
  maxFiles: parsePositiveInt(process.env.COMMENT_MIRROR_MAX_FILES, 120),
  maxBytesPerFile: parsePositiveInt(process.env.COMMENT_MIRROR_MAX_BYTES_PER_FILE, 500000),
}

if (isCliInvocation()) {
  main().catch(async (error) => {
    const message = error instanceof Error ? error.message : String(error)
    await writeResult({ ok: false, error: sanitizeLine(message) })
    console.error(`comment-mirror-runner: ${message}`)
    process.exit(1)
  })
}

export async function main() {
  const runMarker = buildRunMarker(ENV.pipelineId, ENV.sha)

  const skipReason = getSkipReason(ENV)
  if (skipReason) {
    const skipResult = {
      ok: true,
      skipped: true,
      reason: skipReason,
      source_branch: ENV.sourceBranch,
      target_branch: ENV.targetBranch,
      marker: runMarker,
    }
    await writeResult(skipResult)
    console.log(JSON.stringify(skipResult))
    return
  }

  requireRuntimeEnv(ENV)

  const latest = await getLatestCommitOnBranch(Number(ENV.projectId), ENV.sourceBranch)
  if (latest) {
    const marker = extractRunMarkerFromCommitMessage(String(latest.message || ''))
    if (marker === runMarker) {
      const result = {
        ok: true,
        skipped: true,
        reason: 'already_processed',
        source_branch: ENV.sourceBranch,
        target_branch: ENV.targetBranch,
        marker: runMarker,
      }
      await writeResult(result)
      console.log(JSON.stringify(result))
      return
    }
  }

  await createBranchIfNeeded(Number(ENV.projectId), ENV.sourceBranch, ENV.sha)
  await runCursorCommentMirror(runMarker)
}

/**
 * @param {typeof ENV} env
 */
export function getSkipReason(env) {
  if (env.pipelineSource !== 'push') return 'unsupported_pipeline_source'
  if (env.runOnMainOnly && env.ref !== env.targetBranch) return 'non_target_branch'
  if (!env.pipelineId || !env.sha) return 'missing_pipeline_context'
  return null
}

function requireRuntimeEnv(env) {
  if (!env.projectId) throw new Error('CI_PROJECT_ID is required')
  if (!env.token) throw new Error('GITLAB_TOKEN is required')
  if (!env.cursorApiKey && !env.dryRun) throw new Error('CURSOR_API_KEY is required')
}

async function runCursorCommentMirror(runMarker) {
  const repoRoot = process.cwd()
  ensureGitIdentity()

  checkoutWorkingBranch(repoRoot)

  if (ENV.dryRun) {
    const dryResult = {
      ok: true,
      dry_run: true,
      source_branch: ENV.sourceBranch,
      target_branch: ENV.targetBranch,
      marker: runMarker,
    }
    await writeResult(dryResult)
    console.log(JSON.stringify(dryResult))
    return
  }

  const prompt = buildCursorPrompt()
  runCursorAgentCli(prompt, repoRoot)

  discardDisallowedWorkingTreeChanges(repoRoot)

  const changedPaths = getGitChangedPaths(repoRoot)
  if (changedPaths.length === 0) {
    const result = {
      ok: true,
      skipped: true,
      reason: 'no_comment_changes',
      source_branch: ENV.sourceBranch,
      target_branch: ENV.targetBranch,
      marker: runMarker,
    }
    await writeResult(result)
    console.log(JSON.stringify(result))
    return
  }

  enforceChangeLimits(repoRoot, changedPaths)
  validateAllowedPaths(changedPaths, ENV.allowedPrefixes)

  const diff = getUnifiedDiff(repoRoot, changedPaths)
  const commentCheck = validateCommentOnlyDiff(diff)
  if (!commentCheck.ok) {
    throw new Error(
      `non-comment changes detected in ${commentCheck.violations[0].path}: ${commentCheck.violations[0].line}`,
    )
  }

  execFileSync('git', ['add', '--', ...changedPaths], { cwd: repoRoot, stdio: 'inherit' })
  const summary = `chore(comment-mirror): annotate ${ENV.targetBranch} (${ENV.pipelineId})`
  execFileSync('git', ['commit', '-m', withRunMarker(summary, runMarker)], {
    cwd: repoRoot,
    stdio: 'inherit',
  })
  pushBranchWithTokenAuth(repoRoot, ENV.sourceBranch, ENV.token)

  const result = {
    ok: true,
    backend: 'cursor',
    source_branch: ENV.sourceBranch,
    target_branch: ENV.targetBranch,
    files_count: changedPaths.length,
    marker: runMarker,
  }
  await writeResult(result)
  console.log(JSON.stringify(result))
}

function checkoutWorkingBranch(repoRoot) {
  execFileSync('git', ['fetch', '--prune', 'origin', ENV.targetBranch], { cwd: repoRoot, stdio: 'inherit' })
  if (branchExistsOnRemote(repoRoot, ENV.sourceBranch)) {
    execFileSync('git', ['fetch', '--prune', 'origin', ENV.sourceBranch], {
      cwd: repoRoot,
      stdio: 'inherit',
    })
    execFileSync('git', ['checkout', '-B', ENV.sourceBranch, `origin/${ENV.sourceBranch}`], {
      cwd: repoRoot,
      stdio: 'inherit',
    })
    execFileSync('git', ['merge', '--no-edit', `origin/${ENV.targetBranch}`], {
      cwd: repoRoot,
      stdio: 'inherit',
    })
    return
  }
  execFileSync('git', ['checkout', '-B', ENV.sourceBranch, ENV.sha], { cwd: repoRoot, stdio: 'inherit' })
}

function branchExistsOnRemote(repoRoot, branch) {
  const out = execFileSync('git', ['ls-remote', '--heads', 'origin', branch], {
    cwd: repoRoot,
    encoding: 'utf8',
  })
  return out.trim().length > 0
}

function buildCursorPrompt() {
  return [
    'You are maintaining a comment-only mirror branch for this repository.',
    'Read the codebase and add useful explanatory comments where they are missing.',
    'Hard constraints:',
    '- Only add comments. Do not change executable logic, imports, exports, APIs, formatting-only lines, dependencies, or configuration values.',
    '- Never edit lockfiles, generated files, binaries, or .env files.',
    '- Never modify images, fonts, archives, or other non-text assets (including under public/).',
    '- Keep comments concise and meaningful; skip obvious lines.',
    '- Use the existing comment style already used in each file.',
    '- If a file does not need comments, leave it unchanged.',
    '',
    `target_branch=${ENV.targetBranch}`,
    `source_branch=${ENV.sourceBranch}`,
    `pipeline_id=${ENV.pipelineId}`,
    `pipeline_url=${ENV.pipelineUrl || 'unknown'}`,
  ].join('\n')
}

function runCursorAgentCli(prompt, repoRoot) {
  const env = {
    ...process.env,
    CURSOR_API_KEY: ENV.cursorApiKey,
    PATH: process.env.PATH || '',
  }
  const homeBin = path.join(process.env.HOME || '', '.local/bin')
  if (homeBin && !env.PATH.includes(homeBin)) {
    env.PATH = `${homeBin}:${env.PATH}`
  }
  const result = spawnSync(
    ENV.agentBin,
    ['-p', '--force', '--trust', '--output-format', 'text', prompt],
    {
      cwd: repoRoot,
      env,
      encoding: 'utf8',
      stdio: 'inherit',
      maxBuffer: 50 * 1024 * 1024,
    },
  )
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`Cursor agent exited with code ${result.status ?? 'unknown'}`)
  }
}

function getGitChangedPaths(repoRoot) {
  const unstaged = execFileSync('git', ['diff', '--name-only'], { cwd: repoRoot, encoding: 'utf8' })
  const staged = execFileSync('git', ['diff', '--cached', '--name-only'], {
    cwd: repoRoot,
    encoding: 'utf8',
  })
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], {
    cwd: repoRoot,
    encoding: 'utf8',
  })
  return uniquePaths([...splitLines(unstaged), ...splitLines(staged), ...splitLines(untracked)])
}

/**
 * Drops working-tree changes the agent must not make (binaries, lockfiles, etc.).
 * Those paths are blocked in validation; reverting here keeps legitimate comment edits.
 *
 * @param {string} repoRoot
 * @returns {string[]} paths that were discarded
 */
function discardDisallowedWorkingTreeChanges(repoRoot) {
  const changedPaths = getGitChangedPaths(repoRoot)
  const discarded = []
  for (const filePath of changedPaths) {
    const normalized = filePath.replace(/\\/g, '/')
    if (!isDisallowedPath(normalized)) continue
    const abs = path.join(repoRoot, filePath)
    const tracked =
      execFileSync('git', ['ls-files', '--', filePath], { cwd: repoRoot, encoding: 'utf8' }).trim()
        .length > 0
    try {
      if (tracked) {
        execFileSync('git', ['restore', '--staged', '--worktree', '--', filePath], {
          cwd: repoRoot,
          stdio: 'pipe',
        })
      } else {
        execFileSync('git', ['clean', '-f', '--', filePath], { cwd: repoRoot, stdio: 'pipe' })
      }
    } catch {
      if (fs.existsSync(abs)) {
        try {
          fs.unlinkSync(abs)
        } catch {
          // ignore
        }
      }
    }
    discarded.push(filePath)
  }
  if (discarded.length > 0) {
    console.warn(
      `comment-mirror-runner: discarded disallowed path changes: ${discarded.join(', ')}`,
    )
  }
  return discarded
}

function getUnifiedDiff(repoRoot, changedPaths) {
  return execFileSync('git', ['diff', '--no-color', '--unified=0', '--', ...changedPaths], {
    cwd: repoRoot,
    encoding: 'utf8',
  })
}

function enforceChangeLimits(repoRoot, changedPaths) {
  if (changedPaths.length > ENV.maxFiles) {
    throw new Error(`changed files exceed COMMENT_MIRROR_MAX_FILES (${ENV.maxFiles})`)
  }
  for (const filePath of changedPaths) {
    const abs = path.join(repoRoot, filePath)
    if (!fs.existsSync(abs)) continue
    const stat = fs.statSync(abs)
    if (stat.size > ENV.maxBytesPerFile) {
      throw new Error(
        `changed file ${filePath} exceeds COMMENT_MIRROR_MAX_BYTES_PER_FILE (${ENV.maxBytesPerFile})`,
      )
    }
  }
}

/**
 * @param {string[]} changedPaths
 * @param {string[]} allowedPrefixes
 */
export function validateAllowedPaths(changedPaths, allowedPrefixes) {
  for (const filePath of changedPaths) {
    const normalized = filePath.replace(/\\/g, '/')
    if (normalized.startsWith('/') || normalized.includes('../')) {
      throw new Error(`invalid changed path: ${filePath}`)
    }
    if (isDisallowedPath(normalized)) {
      throw new Error(`disallowed file touched by comment mirror: ${filePath}`)
    }
    const allowed = allowedPrefixes.some((prefix) => normalized === prefix || normalized.startsWith(prefix))
    if (!allowed) {
      throw new Error(`path not in COMMENT_MIRROR_ALLOWED_PATH_PREFIXES: ${filePath}`)
    }
  }
}

function isDisallowedPath(filePath) {
  const baseName = path.basename(filePath)
  if (baseName === '.env' || baseName.startsWith('.env.')) return true
  const denyList = [
    'pnpm-lock.yaml',
    'package-lock.json',
    'yarn.lock',
    '.ci-fix-iteration',
  ]
  if (denyList.includes(filePath)) return true
  if (/\.(png|jpg|jpeg|gif|webp|ico|pdf|zip|tar|gz|woff2?)$/i.test(filePath)) return true
  if (filePath.includes('/dist/') || filePath.includes('/.next/') || filePath.includes('/coverage/')) {
    return true
  }
  return false
}

/**
 * @param {string} diffText
 */
export function validateCommentOnlyDiff(diffText) {
  const lines = splitLinesKeepEmpty(diffText)
  const violations = []
  let currentPath = ''
  for (const rawLine of lines) {
    if (rawLine.startsWith('diff --git ')) {
      const match = rawLine.match(/^diff --git a\/(.+?) b\/(.+)$/)
      currentPath = match?.[2] || currentPath
      continue
    }
    if (
      rawLine.startsWith('index ') ||
      rawLine.startsWith('@@') ||
      rawLine.startsWith('---') ||
      rawLine.startsWith('+++')
    ) {
      continue
    }
    if (rawLine.startsWith('\\ No newline at end of file')) continue
    if (rawLine.startsWith('Binary files ')) {
      violations.push({ path: currentPath || 'unknown', line: 'binary file change is not allowed' })
      continue
    }

    if (rawLine.startsWith('+') || rawLine.startsWith('-')) {
      const value = rawLine.slice(1).trim()
      if (!value) continue
      if (!isCommentLine(value)) {
        violations.push({ path: currentPath || 'unknown', line: sanitizeLine(value) })
      }
    }
  }
  return {
    ok: violations.length === 0,
    violations,
  }
}

/**
 * @param {string} line
 */
export function isCommentLine(line) {
  return (
    /^\/\//.test(line) ||
    /^\/\*/.test(line) ||
    /^\*/.test(line) ||
    /^\*\/$/.test(line) ||
    /^#/.test(line) ||
    /^<!--/.test(line) ||
    /^-->/.test(line) ||
    /^\{\/\*/.test(line) ||
    /^--(?!-)/.test(line)
  )
}

function ensureGitIdentity() {
  const host = process.env.CI_SERVER_HOST || 'gitlab.com'
  const email = process.env.GITLAB_USER_EMAIL || `gitlab-ci@${host}`
  const name = process.env.GITLAB_USER_NAME || 'GitLab CI'
  execFileSync('git', ['config', 'user.email', email], { stdio: 'pipe' })
  execFileSync('git', ['config', 'user.name', name], { stdio: 'pipe' })
}

function pushBranchWithTokenAuth(repoRoot, sourceBranch, token) {
  const candidateUsers = uniquePaths(['oauth2', process.env.GITLAB_USER_LOGIN || '', 'gitlab-ci-token']).filter(
    Boolean,
  )
  for (const username of candidateUsers) {
    const basic = Buffer.from(`${username}:${token}`, 'utf8').toString('base64')
    try {
      execFileSync(
        'git',
        ['-c', `http.extraHeader=Authorization: Basic ${basic}`, 'push', 'origin', `HEAD:${sourceBranch}`],
        { cwd: repoRoot, env: { ...process.env }, stdio: 'inherit' },
      )
      return
    } catch {
      // Keep trying with alternate GitLab-compatible usernames.
    }
  }
  throw new Error(
    'comment-mirror: git push failed with token auth; verify token scope (write_repository/api) and branch permissions',
  )
}

/**
 * @param {number} projectId
 * @param {string} branch
 * @param {string} ref
 */
async function createBranchIfNeeded(projectId, branch, ref) {
  const encodedRef = encodeURIComponent(ref)
  const encodedBranch = encodeURIComponent(branch)
  try {
    await postJson(`/projects/${projectId}/repository/branches?branch=${encodedBranch}&ref=${encodedRef}`, {})
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!message.includes('already exists')) throw error
  }
}

/**
 * @param {number} projectId
 * @param {string} branch
 * @returns {Promise<{id?: string, message?: string} | null>}
 */
async function getLatestCommitOnBranch(projectId, branch) {
  const query = new URLSearchParams({ ref_name: branch, per_page: '1' })
  try {
    const commits = await getJson(`/projects/${projectId}/repository/commits?${query.toString()}`)
    if (!Array.isArray(commits) || commits.length === 0) return null
    return commits[0]
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (/404/.test(message)) return null
    throw error
  }
}

/**
 * @param {string} apiPath
 * @returns {Promise<any>}
 */
async function getJson(apiPath) {
  const response = await fetch(`${ENV.apiBase}${apiPath}`, {
    headers: { 'PRIVATE-TOKEN': ENV.token },
  })
  const text = await response.text()
  if (!response.ok) throw new Error(`GitLab GET ${apiPath} failed: ${response.status} ${text}`)
  return JSON.parse(text)
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
  })
  const text = await response.text()
  if (!response.ok) throw new Error(`GitLab POST ${apiPath} failed: ${response.status} ${text}`)
  return text ? JSON.parse(text) : {}
}

/**
 * @param {unknown} value
 */
export function sanitizeLine(value) {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim().slice(0, 200)
}

/**
 * @param {string | undefined} value
 * @param {number} fallback
 */
export function parsePositiveInt(value, fallback) {
  if (!value) return fallback
  const n = Number(value)
  if (!Number.isInteger(n) || n <= 0) return fallback
  return n
}

/**
 * @param {string | undefined} value
 */
export function normalizePathPrefixes(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((prefix) => (prefix.endsWith('/') ? prefix : prefix))
}

/**
 * @param {string} pipelineId
 * @param {string} sha
 */
export function buildRunMarker(pipelineId, sha) {
  const shortSha = sha.slice(0, 12)
  return `comment-mirror-run:${pipelineId}:${shortSha}`
}

/**
 * @param {string} message
 * @returns {string | null}
 */
export function extractRunMarkerFromCommitMessage(message) {
  const match = message.match(/^comment-mirror-run:[0-9]+:[a-f0-9]{7,40}$/m)
  return match ? match[0] : null
}

/**
 * @param {string} summary
 * @param {string} marker
 */
function withRunMarker(summary, marker) {
  return `${summary.trim()}\n\n${marker}`
}

/**
 * @param {unknown} payload
 */
async function writeResult(payload) {
  await writeFile(RESULT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

/**
 * @param {string} text
 */
function splitLines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

/**
 * @param {string} text
 */
function splitLinesKeepEmpty(text) {
  if (!text) return []
  return text.split('\n')
}

/**
 * @param {string[]} values
 */
function uniquePaths(values) {
  return [...new Set(values)]
}

function isCliInvocation() {
  if (!process.argv[1]) return false
  return pathToFileURL(process.argv[1]).href === import.meta.url
}

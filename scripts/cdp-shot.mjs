/**
 * Headless Chrome screenshot + console/error capture via the DevTools Protocol.
 *
 * Usage:
 *   node scripts/cdp-shot.mjs '<json-config>'
 *
 * Config: { url, out, width?, height?, mobile?, fullPage?, wait?, scrollThrough? }
 *
 * No npm deps — uses the system Google Chrome plus Node's global fetch/WebSocket.
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const cfg = JSON.parse(process.argv[2] ?? '{}');
const {
  url,
  out = '/tmp/shot.png',
  width = 1440,
  height = 900,
  mobile = false,
  fullPage = true,
  wait = 2500,
  scrollThrough = true,
} = cfg;

if (!url) {
  console.error('config.url is required');
  process.exit(1);
}

const CHROME = '/usr/bin/google-chrome';
const PORT = 9000 + Math.floor((Date.now() % 1000));
const profile = mkdtempSync(join(tmpdir(), 'cdp-'));

const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--hide-scrollbars',
  '--mute-audio',
  '--disable-extensions',
  // Software WebGL so the Three.js hero renders in headless.
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--enable-unsafe-swiftshader',
  '--ignore-gpu-blocklist',
  '--enable-webgl',
  `--window-size=${width},${height}`,
  'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      // The per-page target socket exposes Page/Runtime/etc.; the browser-level
      // socket from /json/version does not.
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      const targets = await res.json();
      const page = targets.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error('Chrome did not expose a page debugger socket');
}

function cdpClient(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    } else if (msg.method) {
      listeners.forEach((fn) => fn(msg));
    }
  });
  const ready = new Promise((res, rej) => {
    ws.addEventListener('open', res);
    ws.addEventListener('error', rej);
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const mid = ++id;
      pending.set(mid, { resolve, reject });
      ws.send(JSON.stringify({ id: mid, method, params }));
    });
  return { ready, send, on: (fn) => listeners.push(fn), close: () => ws.close() };
}

const stage = (s) => process.stderr.write(`· ${s}\n`);
const watchdog = setTimeout(() => {
  console.log(JSON.stringify({ ok: false, error: 'watchdog timeout (60s)' }));
  try { chrome.kill('SIGKILL'); } catch {}
  process.exit(0);
}, 60000);

(async () => {
  const consoleErrors = [];
  const pageErrors = [];
  try {
    stage('waiting for chrome socket');
    const wsUrl = await getWsUrl();
    stage('connecting');
    const client = cdpClient(wsUrl);
    await client.ready;
    stage('connected');

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('Log.enable');
    stage('domains enabled');

    client.on((msg) => {
      if (msg.method === 'Runtime.exceptionThrown') {
        const d = msg.params.exceptionDetails;
        pageErrors.push(d.exception?.description || d.text || 'unknown exception');
      } else if (msg.method === 'Runtime.consoleAPICalled' && (msg.params.type === 'error' || msg.params.type === 'warning')) {
        const text = (msg.params.args || []).map((a) => a.value ?? a.description ?? a.type).join(' ');
        consoleErrors.push(`[${msg.params.type}] ${text}`);
      } else if (msg.method === 'Log.entryAdded' && (msg.params.entry.level === 'error')) {
        consoleErrors.push(`[log] ${msg.params.entry.text}`);
      }
    });

    // Full-page captures resize the surface to the whole document; keep DPR at 1
    // so the surface stays under SwiftShader's ~8192px GL texture limit.
    const dpr = cfg.dpr ?? (fullPage ? 1 : mobile ? 3 : 2);
    await client.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: dpr,
      mobile,
      screenWidth: width,
      screenHeight: height,
    });
    if (mobile) {
      await client.send('Emulation.setUserAgentOverride', {
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      });
      await client.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    }

    if (cfg.reducedMotion) {
      await client.send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
      });
    }

    // Seed localStorage before the document loads (e.g. next-themes theme) so the
    // first paint already reflects it.
    if (cfg.localStorage) {
      const entries = JSON.stringify(cfg.localStorage);
      await client.send('Page.addScriptToEvaluateOnNewDocument', {
        source: `try { const e = ${entries}; for (const k in e) localStorage.setItem(k, e[k]); } catch (_) {}`,
      });
    }

    stage(`navigating to ${url}`);
    await client.send('Page.navigate', { url });
    // Wait for load event.
    await new Promise((resolve) => {
      let done = false;
      const t = setTimeout(() => { if (!done) { done = true; resolve(); } }, 15000);
      client.on((m) => {
        if (m.method === 'Page.loadEventFired' && !done) { done = true; clearTimeout(t); resolve(); }
      });
    });
    stage('load fired; settling');
    await sleep(wait);

    // Make scrolling instant up front so scrollTo lands precisely, but keep rAF
    // alive so scroll-triggered (GSAP/Framer) reveals can actually run & complete.
    if (cfg.freeze !== false) {
      await client.send('Runtime.evaluate', {
        expression: `(() => { const s=document.createElement('style'); s.textContent='html{scroll-behavior:auto !important}*{scroll-behavior:auto !important}'; document.head.appendChild(s); })()`,
      });
    }

    // Drive lazy/scroll-triggered reveals by scrolling through the page once (rAF live).
    if (scrollThrough) {
      stage('scrolling through to trigger reveals');
      await client.send('Runtime.evaluate', {
        expression: `(async () => {
          const h = document.body.scrollHeight;
          const step = window.innerHeight * 0.8;
          for (let y = 0; y <= h; y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 220)); }
          window.scrollTo(0, 0);
          await new Promise(r => setTimeout(r, 700));
        })()`,
        awaitPromise: true,
      });
    }

    // Now freeze: pause animations, force any straggler reveals to final state, and
    // halt every rAF loop (Three.js, GSAP ticker, Lenis) so the software compositor
    // can settle a frame — captureScreenshot hangs while WebGL keeps rendering.
    if (cfg.freeze !== false) {
      stage('freezing animations');
      await client.send('Runtime.evaluate', {
        expression: `(() => {
          const s = document.createElement('style');
          s.textContent = '*,*::before,*::after{animation-play-state:paused !important;transition:none !important;}'
            + '[data-reveal],[data-card],[data-feature],[data-hero-line],[data-hero-fade]{opacity:1 !important;transform:none !important;clip-path:none !important;}';
          document.head.appendChild(s);
          window.requestAnimationFrame = function () { return 0; };
        })()`,
      });
      await sleep(250);
    }

    stage('measuring layout');
    const metrics = await client.send('Page.getLayoutMetrics');
    const contentHeight = Math.ceil(metrics.cssContentSize?.height || height);
    const { writeFileSync } = await import('node:fs');
    const written = [];

    if (fullPage) {
      // The software compositor chokes when rasterizing a large surface (esp. with
      // repeating backgrounds). Keep the viewport small and fixed, and capture the
      // page as scrolled segments — every captured surface stays well under the cliff.
      const segH = cfg.segHeight ?? 1600;
      // Keep the small viewport at the requested DPR (no resize after this point).
      await client.send('Emulation.setDeviceMetricsOverride', {
        width, height: segH, deviceScaleFactor: dpr, mobile, screenWidth: width, screenHeight: segH,
      });
      await sleep(250);
      const total = Math.min(contentHeight, cfg.maxHeight ?? 24000);
      const count = Math.max(1, Math.ceil(total / segH));
      const dot = out.lastIndexOf('.');
      const base = dot === -1 ? out : out.slice(0, dot);
      const ext = dot === -1 ? '.png' : out.slice(dot);
      for (let i = 0; i < count; i++) {
        const y = i * segH;
        const { result } = await client.send('Runtime.evaluate', {
          expression: `(() => { const el = document.scrollingElement || document.documentElement; el.scrollTop = ${y}; window.scrollTo(0, ${y}); return Math.round(el.scrollTop); })()`,
          returnByValue: true,
        });
        stage(`segment ${i + 1}/${count} target y=${y} actual=${result?.value}`);
        await sleep(350);
        const { data } = await client.send('Page.captureScreenshot', { format: 'png', fromSurface: cfg.fromSurface === true });
        const file = count === 1 ? out : `${base}-${String(i + 1).padStart(2, '0')}${ext}`;
        writeFileSync(file, Buffer.from(data, 'base64'));
        written.push(file);
      }
    } else {
      stage('capturing viewport');
      const { data } = await client.send('Page.captureScreenshot', { format: 'png', fromSurface: cfg.fromSurface === true });
      writeFileSync(out, Buffer.from(data, 'base64'));
      written.push(out);
    }

    console.log(JSON.stringify({
      ok: true,
      files: written,
      viewport: `${width}x${height}${mobile ? ' mobile' : ''} dpr${dpr}`,
      contentHeight,
      consoleErrors,
      pageErrors,
    }, null, 2));
    client.close();
  } catch (err) {
    console.log(JSON.stringify({ ok: false, error: String(err), consoleErrors, pageErrors }, null, 2));
  } finally {
    clearTimeout(watchdog);
    chrome.kill('SIGKILL');
    try { rmSync(profile, { recursive: true, force: true }); } catch {}
    process.exit(0);
  }
})();

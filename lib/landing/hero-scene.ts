'use client';

/**
 * "The story listens back" — the landing hero's WebGL signature moment.
 *
 * A framework-agnostic Three.js scene: a flowing aurora nebula, concentric
 * sound-wave rings that pulse like a voice, and a field of drifting golden motes
 * (fireflies) that parallax to the cursor. Tuned to composite over the themed
 * page background (cream in light mode, ink in dark) so headline text stays legible.
 *
 * Performance: DPR + particle budget scale with the device tier, the RAF pauses
 * when the canvas leaves the viewport or the tab is hidden, and a single static
 * frame is drawn (no loop) when the user prefers reduced motion.
 */
import * as THREE from 'three';

import { cappedDpr, getPerfTier, prefersReducedMotion, type PerfTier } from './capabilities';

interface HeroSceneOptions {
  canvas: HTMLCanvasElement;
  dark: boolean;
}

const PARTICLES: Record<PerfTier, number> = { low: 900, mid: 2200, high: 4200 };
const DPR_CAP: Record<PerfTier, number> = { low: 1.25, mid: 1.6, high: 2 };

const BG_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const BG_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uPointer;
  uniform float uAudio;
  uniform float uFade;
  uniform float uDark;
  uniform vec2  uRes;
  uniform vec3  uGreen;
  uniform vec3  uGold;
  uniform vec3  uPurple;
  uniform vec3  uPink;

  // -- value noise + fbm ----------------------------------------------------
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 p = (vUv - 0.5);
    p.x *= aspect;

    // Slow-drifting flow field.
    vec2 q = p * 1.25 + vec2(uTime * 0.018, uTime * 0.012);
    float n = fbm(q + fbm(q + uTime * 0.025));

    // Colour wash: green -> purple vertically, gold blooms in the bright folds.
    // Gold is dialled back in light mode so the wash stays cool and creamy.
    vec3 col = mix(uGreen, uPurple, smoothstep(0.0, 1.0, vUv.y * 0.7 + n * 0.5));
    col = mix(col, uGold, smoothstep(0.45, 0.95, n) * mix(0.45, 0.85, uDark));
    col = mix(col, uPink, smoothstep(0.7, 1.0, n) * 0.22);

    // Focal "listening" glow — tracks the pointer and breathes with the audio env.
    vec2 focal = vec2(uPointer.x * 0.18, 0.04 + uPointer.y * 0.12);
    float d = length(p - focal);
    float glow = exp(-d * d * 3.6) * (0.3 + uAudio * 0.7);
    col += uGold * glow * 0.4;

    // Concentric sound-wave rings radiating from the focal point.
    float rings = sin(d * 20.0 - uTime * 2.1);
    rings = smoothstep(0.82, 1.0, rings) * exp(-d * 2.0) * (0.25 + uAudio * 1.1);
    col += mix(uGold, uPink, 0.35) * rings * 0.55;

    // Soft vignette keeps the centre clear for the headline.
    col *= smoothstep(1.35, 0.15, length(p));

    // In light mode pastelise toward cream so the wash reads as soft watercolour
    // (not saturated blobs); keep it rich and saturated in dark mode.
    vec3 cream = vec3(0.99, 0.97, 0.93);
    col = mix(mix(cream, col, 0.62), col, uDark);

    // Clear the centre so the headline always reads — the effect frames the text.
    float clearC = smoothstep(0.12, 0.62, length(p));
    float intensity = mix(0.86, 1.0, uDark);
    float baseAlpha = mix(0.3, 0.7, uDark);
    float a = clamp((glow * 0.5 + rings * 0.5 + n * 0.3) * baseAlpha + baseAlpha * 0.3, 0.0, 1.0);
    a *= mix(0.28, 1.0, clearC);
    gl_FragColor = vec4(col * intensity, a * uFade);
  }
`;

const P_VERT = /* glsl */ `
  attribute float aScale;
  attribute float aPhase;
  attribute vec3  aSeed;
  uniform float uTime;
  uniform vec2  uPointer;
  uniform float uAudio;
  uniform float uFade;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying float vTone;
  void main() {
    vec3 pos = position;
    // Gentle organic drift.
    pos.x += sin(uTime * 0.25 + aPhase) * 0.35 * aSeed.x;
    pos.y += cos(uTime * 0.21 + aPhase * 1.3) * 0.35 * aSeed.y + uTime * 0.04 * aSeed.z;
    pos.z += sin(uTime * 0.18 + aPhase) * 0.25;
    // Wrap vertically so motes keep rising.
    pos.y = mod(pos.y + 6.0, 12.0) - 6.0;
    // Cursor parallax — nearer motes move more.
    float depth = (pos.z + 6.0) / 12.0;
    pos.x += uPointer.x * (0.6 + depth * 1.4);
    pos.y += uPointer.y * (0.4 + depth * 1.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // Thin out motes near screen centre so they frame (not obscure) the headline.
    vec2 ndc = gl_Position.xy / max(abs(gl_Position.w), 0.0001);
    float clearC = smoothstep(0.18, 0.85, length(ndc));

    float twinkle = 0.6 + 0.4 * sin(uTime * 1.4 + aPhase * 6.2831);
    float pulse = 1.0 + uAudio * 0.7;
    gl_PointSize = aScale * uPixelRatio * pulse * (300.0 / -mv.z);
    vAlpha = twinkle * uFade * mix(0.12, 1.0, clearC);
    vTone = aSeed.z;
  }
`;

const P_FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uGold;
  uniform vec3 uPink;
  uniform float uDark;
  varying float vAlpha;
  varying float vTone;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, r);
    glow = pow(glow, 1.7);
    // Deeper amber + lower opacity in light mode (normal-blended dots), bright
    // gold glow in dark mode (additive). Prevents blow-out over the cream page.
    vec3 amber = vec3(0.80, 0.55, 0.12);
    vec3 base = mix(amber, uGold, uDark);
    vec3 col = mix(base, uPink, vTone * 0.4);
    float alpha = glow * vAlpha * mix(0.62, 0.82, uDark);
    gl_FragColor = vec4(col, alpha);
  }
`;

function toVec3(rgb: [number, number, number]) {
  return new THREE.Vector3(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
}

export class HeroScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private bg: THREE.Mesh;
  private points: THREE.Points;
  private pMaterial!: THREE.ShaderMaterial;
  private uniforms: Record<string, THREE.IUniform>;
  private pUniforms: Record<string, THREE.IUniform>;
  private startTime = 0;
  private raf = 0;
  private running = false;
  private reduced: boolean;
  private tier: PerfTier;
  private pointer = new THREE.Vector2(0, 0);
  private pointerTarget = new THREE.Vector2(0, 0);
  private audio = 0;
  private fade = 1;
  private viewH = 1;
  private reduceMql?: MediaQueryList;
  /** Optional external audio level source (the "Hear a whisper" feature). */
  audioProvider?: () => number;
  private canvas: HTMLCanvasElement;
  private io?: IntersectionObserver;
  private onResize = () => this.resize();
  private onVisibility = () => (document.hidden ? this.pause() : this.resume());

  constructor({ canvas, dark }: HeroSceneOptions) {
    this.canvas = canvas;
    this.reduced = prefersReducedMotion();
    this.tier = getPerfTier();

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: this.tier !== 'low',
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(cappedDpr(DPR_CAP[this.tier]));

    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    this.camera.position.z = 6;

    const green = toVec3([21, 66, 18]);
    const gold = toVec3([255, 205, 70]);
    const purple = toVec3([138, 43, 226]);
    const pink = toVec3([233, 85, 155]);

    // -- aurora background (fullscreen quad) --------------------------------
    this.uniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uAudio: { value: 0 },
      uFade: { value: 1 },
      uDark: { value: dark ? 1 : 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uGreen: { value: green.clone() },
      uGold: { value: gold.clone() },
      uPurple: { value: purple.clone() },
      uPink: { value: pink.clone() },
    };
    const bgMat = new THREE.ShaderMaterial({
      vertexShader: BG_VERT,
      fragmentShader: BG_FRAG,
      uniforms: this.uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    this.bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
    this.bg.frustumCulled = false;
    this.bg.renderOrder = -1;
    this.scene.add(this.bg);

    // -- golden motes -------------------------------------------------------
    const count = PARTICLES[this.tier];
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);
    const seeds = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      scales[i] = 0.5 + Math.random() * 2.4;
      phases[i] = Math.random() * Math.PI * 2;
      seeds[i * 3] = Math.random() * 2 - 1;
      seeds[i * 3 + 1] = Math.random() * 2 - 1;
      seeds[i * 3 + 2] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));

    this.pUniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uAudio: { value: 0 },
      uFade: { value: 1 },
      uPixelRatio: { value: this.renderer.getPixelRatio() },
      uGold: { value: gold.clone() },
      uPink: { value: pink.clone() },
      uDark: { value: dark ? 1 : 0 },
    };
    const pMat = new THREE.ShaderMaterial({
      vertexShader: P_VERT,
      fragmentShader: P_FRAG,
      uniforms: this.pUniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: dark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.pMaterial = pMat;
    this.points = new THREE.Points(geo, pMat);
    this.points.frustumCulled = false;
    this.scene.add(this.points);

    this.resize();
    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onVisibility);

    // React to the user toggling reduced motion mid-session.
    this.reduceMql = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reduceMql.addEventListener?.('change', this.onReducedMotionChange);

    // Pause when the hero scrolls out of view.
    this.io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? this.resume() : this.pause()),
      { threshold: 0.01 },
    );
    this.io.observe(canvas);
  }

  /** Pointer in normalised [-1, 1] coordinates. */
  setPointer(x: number, y: number) {
    this.pointerTarget.set(x, y);
  }

  /** Simulated/real audio envelope in [0, 1]. */
  setAudio(level: number) {
    this.audio = level;
  }

  private resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    // Cache the hero height so the per-frame scroll math needs no layout reads.
    this.viewH = h;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    (this.uniforms.uRes.value as THREE.Vector2).set(w, h);
    this.pUniforms.uPixelRatio.value = this.renderer.getPixelRatio();
    if (this.reduced) this.renderOnce();
  }

  private onReducedMotionChange = (e: MediaQueryListEvent) => {
    this.reduced = e.matches;
    if (this.reduced) {
      this.pause();
      this.renderOnce();
    } else {
      this.startTime = 0;
      this.resume();
    }
  };

  private renderOnce() {
    // A single rich, motionless frame for reduced-motion users.
    this.uniforms.uTime.value = 12.0;
    this.pUniforms.uTime.value = 12.0;
    this.uniforms.uAudio.value = 0.3;
    this.pUniforms.uAudio.value = 0.3;
    this.renderer.render(this.scene, this.camera);
  }

  private tick = () => {
    if (!this.running) return;
    const t = (performance.now() - this.startTime) / 1000;

    // Fade the aurora out as the hero scrolls away. The canvas sits at the top of
    // the document, so scrollY / heroHeight is the progress — no layout read, and
    // this only runs while the scene is active (paused when off-screen/hidden).
    const progress = Math.min(1, window.scrollY / Math.max(1, this.viewH));
    this.fade = Math.max(0, 1 - progress * 1.15);

    // Simulated breathing "voice" envelope when no real audio is wired in.
    const env = (Math.sin(t * 1.6) * 0.5 + 0.5) * (Math.sin(t * 0.7) * 0.25 + 0.75);
    const live = this.audioProvider ? this.audioProvider() : 0;
    // Real narration (when playing) dominates; otherwise the gentle idle breath.
    const audio = Math.max(this.audio, live, env * 0.6);

    this.pointer.lerp(this.pointerTarget, 0.05);

    this.uniforms.uTime.value = t;
    this.uniforms.uAudio.value = audio;
    this.uniforms.uFade.value = this.fade;
    (this.uniforms.uPointer.value as THREE.Vector2).copy(this.pointer);

    this.pUniforms.uTime.value = t;
    this.pUniforms.uAudio.value = audio;
    this.pUniforms.uFade.value = this.fade;
    (this.pUniforms.uPointer.value as THREE.Vector2).copy(this.pointer);

    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame(this.tick);
  };

  start() {
    if (this.reduced) {
      this.renderOnce();
      return;
    }
    this.resume();
  }

  private resume() {
    if (this.running || this.reduced) return;
    this.running = true;
    if (!this.startTime) this.startTime = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private pause() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  setDark(dark: boolean) {
    this.uniforms.uDark.value = dark ? 1 : 0;
    this.pUniforms.uDark.value = dark ? 1 : 0;
    this.pMaterial.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    this.pMaterial.needsUpdate = true;
    if (this.reduced) this.renderOnce();
  }

  dispose() {
    this.pause();
    this.audioProvider = undefined;
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.reduceMql?.removeEventListener?.('change', this.onReducedMotionChange);
    this.io?.disconnect();
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose?.();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat?.dispose?.();
    });
    // Actively release the WebGL context, not just the JS-side resources.
    this.renderer.forceContextLoss?.();
    this.renderer.dispose();
  }
}

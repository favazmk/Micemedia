import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { Renderer, Camera, Geometry, Program, Mesh, Transform } from 'ogl';
import { ArrowUpRight } from 'lucide-react';

/**
 * Scroll-driven 3D particle sculpture for the home page. One particle cloud reshapes itself
 * as you scroll: a brand "idea" sphere -> an exhibition stand -> a stage with truss, screen and
 * light beams. Built on ogl (already used by Particles.tsx) to keep the bundle small.
 */

// ---------------------------------------------------------------------------
// Shape sampling
// ---------------------------------------------------------------------------
// Shapes are drawn mostly as outlines (box edges, truss chords) with only light surface fill:
// a particle cloud reads as an object through its silhouette and its signature details,
// not through solid volumes. Parts flagged `g` glow white (logos, screens, light beams).

type Vec3 = [number, number, number];
type Geo =
  | { box: [Vec3, Vec3] } // filled volume / surface
  | { seg: [Vec3, Vec3] } // line
  | { cone: { top: Vec3; bottom: Vec3; radius: number } } // light beam
  | { band: { center: Vec3; radius: number; height: number } }; // hanging ring banner
type Part = Geo & { w?: number; g?: number };

const len = (a: Vec3, b: Vec3) => Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);

// Particle share per part: surfaces by area, lines by length, scaled by the part's `w`
function partWeight(p: Part) {
  let base: number;
  if ('box' in p) {
    const d = p.box[1].map((v, i) => Math.abs(v - p.box[0][i])).sort((x, y) => y - x);
    base = d[0] * d[1];
  } else if ('seg' in p) base = len(p.seg[0], p.seg[1]) * 0.35;
  else if ('cone' in p) base = len(p.cone.top, p.cone.bottom) * p.cone.radius;
  else base = 2 * Math.PI * p.band.radius * Math.max(p.band.height, 0.2);
  return base * (p.w ?? 1);
}

function samplePart(p: Part, rand: () => number): Vec3 {
  if ('box' in p) {
    const [a, b] = p.box;
    return [a[0] + (b[0] - a[0]) * rand(), a[1] + (b[1] - a[1]) * rand(), a[2] + (b[2] - a[2]) * rand()];
  }
  if ('seg' in p) {
    const [a, b] = p.seg;
    const t = rand();
    const j = () => (rand() - 0.5) * 0.03;
    return [a[0] + (b[0] - a[0]) * t + j(), a[1] + (b[1] - a[1]) * t + j(), a[2] + (b[2] - a[2]) * t + j()];
  }
  if ('cone' in p) {
    // denser near the fixture, spreading toward the floor
    const { top, bottom, radius } = p.cone;
    const t = Math.pow(rand(), 0.8);
    const r = radius * t * Math.sqrt(rand());
    const ang = rand() * Math.PI * 2;
    return [top[0] + (bottom[0] - top[0]) * t + Math.cos(ang) * r, top[1] + (bottom[1] - top[1]) * t, top[2] + (bottom[2] - top[2]) * t + Math.sin(ang) * r];
  }
  const { center, radius, height } = p.band;
  const ang = rand() * Math.PI * 2;
  return [center[0] + Math.cos(ang) * radius, center[1] + (rand() - 0.5) * height, center[2] + Math.sin(ang) * radius];
}

function sampleParts(parts: Part[], count: number, rand: () => number, scale = 1) {
  const pos = new Float32Array(count * 3);
  const glow = new Float32Array(count);
  const weights = parts.map(partWeight);
  const total = weights.reduce((x, y) => x + y, 0);
  let acc = 0;
  const cumulative = weights.map((w) => (acc += w / total));
  for (let i = 0; i < count; i++) {
    const r = rand();
    const k = cumulative.findIndex((c) => r <= c);
    const part = parts[k === -1 ? parts.length - 1 : k];
    pos.set(samplePart(part, rand).map((v) => v * scale), i * 3);
    glow[i] = part.g ?? 0;
  }
  return { pos, glow };
}

// The 12 edges of a box, as line parts
function edges(a: Vec3, b: Vec3, extra: { w?: number; g?: number } = {}): Part[] {
  const [x0, y0, z0] = a;
  const [x1, y1, z1] = b;
  const c: Vec3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]];
  const pairs = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  return pairs.map(([i, j]) => ({ seg: [c[i], c[j]] as [Vec3, Vec3], ...extra }));
}

// Outline of a flat panel facing +z (screens, graphics)
function frameZ(x0: number, y0: number, x1: number, y1: number, z: number, extra: { w?: number; g?: number } = {}): Part[] {
  return [
    { seg: [[x0, y0, z], [x1, y0, z]], ...extra },
    { seg: [[x1, y0, z], [x1, y1, z]], ...extra },
    { seg: [[x1, y1, z], [x0, y1, z]], ...extra },
    { seg: [[x0, y1, z], [x0, y0, z]], ...extra },
  ];
}

// A square box truss between two points (vertical or along x): four chords plus zig-zag lacing
function truss(a: Vec3, b: Vec3, h = 0.13): Part[] {
  const parts: Part[] = [];
  const vertical = Math.abs(b[1] - a[1]) > Math.abs(b[0] - a[0]);
  const off = (u: number, v: number): Vec3 => (vertical ? [u, 0, v] : [0, u, v]);
  const add = (p: Vec3, o: Vec3): Vec3 => [p[0] + o[0], p[1] + o[1], p[2] + o[2]];
  for (const u of [-h, h]) for (const v of [-h, h]) parts.push({ seg: [add(a, off(u, v)), add(b, off(u, v))], w: 1.4 });
  const n = Math.round(len(a, b) / 0.32);
  for (let i = 0; i < n; i++) {
    const p0: Vec3 = [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n, a[2]];
    const p1: Vec3 = [a[0] + ((b[0] - a[0]) * (i + 1)) / n, a[1] + ((b[1] - a[1]) * (i + 1)) / n, a[2]];
    const s = i % 2 ? -h : h;
    parts.push({ seg: [add(p0, off(-h, s)), add(p1, off(h, s))], w: 0.7 });
    parts.push({ seg: [add(p0, off(s, -h)), add(p1, off(s, h))], w: 0.7 });
  }
  return parts;
}

// Shape 1: a softly banded sphere, the starting idea
function sphere(count: number, rand: () => number) {
  const pos = new Float32Array(count * 3);
  const glow = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const r = 2.1 + (rand() - 0.5) * 0.12;
    pos.set([Math.cos(theta) * ring * r, y * r, Math.sin(theta) * ring * r], i * 3);
    glow[i] = rand() > 0.93 ? 1 : 0;
  }
  return { pos, glow };
}

// Shape 2: a corner exhibition stand: raised floor, back and side walls with a glowing "M"
// brand mark and a wall screen, reception counter, product plinths, and the classic
// suspended ring banner hanging above it.
function standParts(): Part[] {
  const F = -1.9; // floor top
  const H = 0.75; // wall top
  const parts: Part[] = [
    ...edges([-2.4, F - 0.15, -1.6], [2.4, F, 1.6], { w: 1.3 }), // platform
    { box: [[-2.4, F, -1.6], [2.4, F + 0.01, 1.6]], w: 0.18 }, // floor surface
    ...edges([-2.4, F, -1.6], [2.4, H, -1.45]), // back wall
    { box: [[-2.4, F, -1.6], [2.4, H, -1.59]], w: 0.18 },
    ...edges([-2.4, F, -1.45], [-2.25, H, 0.6]), // side wall
    { box: [[-2.4, F, -1.45], [-2.39, H, 0.6]], w: 0.18 },
    // brand mark on the back wall
    { seg: [[-0.8, -1.0, -1.43], [-0.8, 0.3, -1.43]], g: 1, w: 2.2 },
    { seg: [[-0.8, 0.3, -1.43], [0, -0.45, -1.43]], g: 1, w: 2.2 },
    { seg: [[0, -0.45, -1.43], [0.8, 0.3, -1.43]], g: 1, w: 2.2 },
    { seg: [[0.8, 0.3, -1.43], [0.8, -1.0, -1.43]], g: 1, w: 2.2 },
    // screen on the side wall
    { box: [[-2.23, -0.9, -1.1], [-2.22, 0.1, -0.1]], g: 1, w: 0.6 },
    // reception counter with a lit top edge
    ...edges([0.4, F, 0.6], [1.8, F + 1.0, 1.15]),
    { seg: [[0.4, F + 1.0, 1.15], [1.8, F + 1.0, 1.15]], g: 1, w: 1.6 },
    // product plinths
    ...edges([-1.7, F, -0.4], [-1.2, F + 0.7, 0.1], { w: 0.8 }),
    ...edges([1.4, F, -1.0], [1.9, F + 0.5, -0.5], { w: 0.8 }),
    // suspended ring banner and its hanging wires
    { band: { center: [0.1, 1.75, 0], radius: 1.4, height: 0.5 }, g: 0.7, w: 0.55 },
    { band: { center: [0.1, 2.0, 0], radius: 1.4, height: 0.02 }, w: 0.5 },
    { band: { center: [0.1, 1.5, 0], radius: 1.4, height: 0.02 }, w: 0.5 },
  ];
  for (const ang of [0.4, 2.0, 3.6, 5.2]) {
    const x = 0.1 + Math.cos(ang) * 1.4;
    const z = Math.sin(ang) * 1.4;
    parts.push({ seg: [[x, 2.0, z], [x, 3.0, z]], w: 0.5 });
  }
  return parts;
}

// Shape 3: a conference stage seen from the audience: deck and steps, truss goalpost with
// moving heads and light beams, a glowing LED screen, lectern, hanging speakers and rows of chairs.
function stageParts(): Part[] {
  const D = -1.1; // deck top
  const T = 2.2; // truss height
  const parts: Part[] = [
    ...edges([-3, D - 0.45, -1.4], [3, D, 0.9], { w: 1.3 }), // deck
    { box: [[-3, D, -1.4], [3, D + 0.01, 0.9]], w: 0.15 },
    ...edges([-0.8, D - 0.3, 0.9], [0.8, D - 0.15, 1.2], { w: 0.8 }), // steps
    ...edges([-0.8, D - 0.45, 1.2], [0.8, D - 0.3, 1.5], { w: 0.8 }),
    // LED screen
    { box: [[-2.0, -0.55, -1.3], [2.0, 1.6, -1.29]], g: 1, w: 1.5 },
    ...frameZ(-2.05, -0.6, 2.05, 1.65, -1.28, { w: 1.4 }),
    // lectern
    ...edges([-2.0, D, 0.0], [-1.5, D + 0.95, 0.35]),
    // truss goalpost
    ...truss([-2.75, D, -0.6], [-2.75, T, -0.6]),
    ...truss([2.75, D, -0.6], [2.75, T, -0.6]),
    ...truss([-2.75, T, -0.6], [2.75, T, -0.6]),
  ];
  // moving-head fixtures on the truss and the beams they throw onto the deck
  for (const x of [-1.6, 0, 1.6]) {
    parts.push(...edges([x - 0.12, T - 0.4, -0.72], [x + 0.12, T - 0.15, -0.48], { g: 1, w: 0.8 }));
    parts.push({ cone: { top: [x, T - 0.4, -0.6], bottom: [x * 0.7, D, 0.4], radius: 0.6 }, g: 0.85, w: 1.1 });
  }
  // line-array speakers hanging outside the truss
  for (const x of [-3.4, 3.4]) {
    for (let i = 0; i < 5; i++) parts.push(...edges([x - 0.22, T - 0.3 - i * 0.28, -0.75], [x + 0.22, T - 0.06 - i * 0.28, -0.4], { w: 0.5 }));
  }
  // audience: rows of chairs facing the stage, with a centre aisle
  const floor = D - 0.45;
  for (let row = 0; row < 4; row++) {
    const z = 2.0 + row * 0.75;
    for (let c = -4; c <= 4; c++) {
      if (c === 0) continue;
      const x = c * 0.6;
      parts.push({ seg: [[x - 0.2, floor + 0.4, z], [x + 0.2, floor + 0.4, z]], w: 0.55 }); // seat
      parts.push({ seg: [[x - 0.2, floor + 0.4, z + 0.3], [x + 0.2, floor + 0.4, z + 0.3]], w: 0.55 });
      parts.push({ seg: [[x - 0.2, floor + 0.4, z + 0.3], [x - 0.2, floor + 0.95, z + 0.35]], w: 0.55 }); // backrest
      parts.push({ seg: [[x + 0.2, floor + 0.4, z + 0.3], [x + 0.2, floor + 0.95, z + 0.35]], w: 0.55 });
      parts.push({ seg: [[x - 0.2, floor + 0.95, z + 0.35], [x + 0.2, floor + 0.95, z + 0.35]], w: 0.55 });
    }
  }
  return parts;
}

// Deterministic PRNG so the sculpture looks the same on every visit
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Shaders
// ---------------------------------------------------------------------------

const vertex = /* glsl */ `
  attribute vec3 position;   // shape 1 (sphere)
  attribute vec3 aStand;     // shape 2
  attribute vec3 aStage;     // shape 3
  attribute vec3 aDir;       // scatter direction used mid-morph
  attribute float aRand;
  attribute vec3 aGlow;      // highlight per shape (logos, screens, beams): sphere, stand, stage

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uMorph;      // 0 = sphere, 1 = stand, 2 = stage
  uniform float uTime;
  uniform float uSize;

  varying float vAlpha;
  varying float vHeat;

  void main() {
    // each particle starts its move slightly later than the last, so shapes dissolve and reform
    float s1 = smoothstep(0.0, 1.0, clamp(clamp(uMorph, 0.0, 1.0) * 1.5 - aRand * 0.5, 0.0, 1.0));
    float s2 = smoothstep(0.0, 1.0, clamp(clamp(uMorph - 1.0, 0.0, 1.0) * 1.5 - aRand * 0.5, 0.0, 1.0));
    vec3 p = mix(mix(position, aStand, s1), aStage, s2);

    // burst outward while in transit, settle when the shape lands
    float burst = sin(3.14159 * s1) + sin(3.14159 * s2);
    p += aDir * burst * 1.1;
    p += 0.03 * vec3(sin(uTime * 0.9 + aRand * 40.0), cos(uTime * 0.7 + aRand * 30.0), sin(uTime * 0.8 + aRand * 20.0));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.5 + aRand * 0.7) * (1.0 + burst * 0.4) / -mv.z;

    float glow = mix(mix(aGlow.x, aGlow.y, s1), aGlow.z, s2);
    vHeat = clamp(burst + glow, 0.0, 1.0);
    vAlpha = mix(0.5 + 0.4 * aRand, 1.0, glow);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform vec3 uRed;
  uniform vec3 uWarm;
  varying float vAlpha;
  varying float vHeat;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(mix(uRed, uWarm, vHeat), a * vAlpha);
  }
`;

const STAGES = [
  {
    eyebrow: '01 / Brand Experiences',
    title: <>It starts with <span className="accent-word text-red-500 text-[1.15em]">one idea.</span></>,
    body: 'Launches and activations built around a single, clear idea: yours.',
  },
  {
    eyebrow: '02 / Exhibition Stands',
    title: <>Shaped into a <span className="accent-word text-red-500 text-[1.15em]">stand.</span></>,
    body: 'Custom and modular stands, designed and built for the trade show floor.',
  },
  {
    eyebrow: '03 / Staging & AV Production',
    title: <>Lit up on <span className="accent-word text-red-500 text-[1.15em]">stage.</span></>,
    body: 'Staging, lighting, screens and sound, run end-to-end by our own crew.',
  },
];

// Scroll progress keyframes for each caption. Every track spans the full 0-1 range: motion hands
// opacity to the browser's scroll timeline, which rejects offsets outside 0-1 and drops the value
// back to its default past the last keyframe.
const CAPTION_KEYS: { at: number[]; opacity: number[]; y: number[] }[] = [
  { at: [0, 0.24, 0.31, 1], opacity: [1, 1, 0, 0], y: [0, 0, -40, -40] },
  { at: [0, 0.36, 0.44, 0.57, 0.64, 1], opacity: [0, 0, 1, 1, 0, 0], y: [40, 40, 0, 0, -40, -40] },
  { at: [0, 0.7, 0.78, 1], opacity: [0, 0, 1, 1], y: [40, 40, 0, 0] },
];

function Caption({ progress, index, onExplore }: { progress: MotionValue<number>; index: number; onExplore: () => void }) {
  const keys = CAPTION_KEYS[index];
  const opacity = useTransform(progress, keys.at, keys.opacity);
  const y = useTransform(progress, keys.at, keys.y);
  // hidden captions must not catch clicks (the last one holds a button)
  const pointerEvents = useTransform(opacity, (v) => (v > 0.5 ? 'auto' : 'none'));
  const stage = STAGES[index];
  return (
    <motion.div style={{ opacity, y, pointerEvents }} className="absolute inset-x-0 bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
      <span className="inline-block font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white font-bold bg-black/60 backdrop-blur-sm border border-red-500/60 rounded-full px-3 py-1.5">
        {stage.eyebrow}
      </span>
      <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.05] mt-4 [text-shadow:0_4px_24px_rgba(0,0,0,0.9)]">
        {stage.title}
      </h2>
      <p className="font-sans text-sm sm:text-base text-neutral-300 mt-4 max-w-sm leading-relaxed">{stage.body}</p>
      {index === STAGES.length - 1 && (
        <button
          type="button"
          onClick={onExplore}
          className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-widest uppercase font-bold text-black bg-white rounded-full px-6 py-4 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
        >
          Explore Our Services <ArrowUpRight className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

export default function MorphScene({ onExplore }: { onExplore: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  // hold each shape for a while, morph in between
  const morph = useTransform(scrollYProgress, [0, 0.16, 0.42, 0.58, 0.84, 1], [0, 0, 1, 1, 2, 2]);
  const barScale = scrollYProgress;

  useEffect(() => {
    const host = canvasHostRef.current;
    const section = sectionRef.current;
    if (!host || !section) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true, antialias: false });
    } catch {
      return; // no WebGL: the captions still tell the story
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(gl.canvas);

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const count = coarse ? 7000 : 14000;
    const rand = mulberry32(2026);
    const dir = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const u = rand() * 2 - 1;
      const t = rand() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      dir.set([Math.cos(t) * s, u, Math.sin(t) * s], i * 3);
      rnd[i] = rand();
    }

    const shapes = [sphere(count, rand), sampleParts(standParts(), count, rand, 0.9), sampleParts(stageParts(), count, rand, 0.72)];
    const glow = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) glow.set([shapes[0].glow[i], shapes[1].glow[i], shapes[2].glow[i]], i * 3);
    const geometry = new Geometry(gl, {
      position: { size: 3, data: shapes[0].pos },
      aStand: { size: 3, data: shapes[1].pos },
      aStage: { size: 3, data: shapes[2].pos },
      aDir: { size: 3, data: dir },
      aRand: { size: 1, data: rnd },
      aGlow: { size: 3, data: glow },
    });
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uMorph: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: 0 },
        uRed: { value: [0.86, 0.3, 0.29] },
        uWarm: { value: [1.0, 0.86, 0.8] },
      },
      transparent: true,
      depthTest: false,
    });
    program.setBlendFunc(gl.SRC_ALPHA, gl.ONE); // additive glow

    const scene = new Transform();
    const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });
    mesh.setParent(scene);
    const camera = new Camera(gl, { fov: 35 });

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.perspective({ aspect: width / height });
      const narrow = width < 768;
      // sit the sculpture right of the captions on desktop, above them on phones
      if (narrow) {
        camera.position.set(0, -2.1, 23);
      } else {
        // pull back until the ~3.6-unit-wide sculpture fits in the right ~58% of the frame,
        // then shift the camera left so the sculpture sits there
        const tanHalf = Math.tan((35 / 2) * (Math.PI / 180));
        const z = Math.max(13, 6.2 / (tanHalf * camera.aspect));
        camera.position.set(-0.42 * z * tanHalf * camera.aspect, 0, z);
      }
      program.uniforms.uSize.value = (narrow ? 62 : 50) * Math.min(window.devicePixelRatio, 2);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!coarse) window.addEventListener('pointermove', onMove, { passive: true });

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let running = false;
    let shown = 0; // eased copy of the scroll morph, so fast scrolls still glide
    const start = performance.now();
    let last = start;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const now = performance.now();
      const t = (now - start) / 1000;
      // time-based easing so the glide feels the same at any frame rate
      const dt = Math.min((now - last) / 1000, 0.5);
      last = now;
      shown += (morph.get() - shown) * (reduce ? 1 : 1 - Math.exp(-dt * 4));
      const ease = 1 - Math.exp(-dt * 3);
      pointer.x += (pointer.tx - pointer.x) * ease;
      pointer.y += (pointer.ty - pointer.y) * ease;
      program.uniforms.uMorph.value = shown;
      program.uniforms.uTime.value = reduce ? 0 : t;
      // each shape has its own best viewing angle: the stand from a three-quarter corner view,
      // the stage almost head-on from the audience; a gentle sway keeps the depth visible
      const k = Math.min(Math.max(shown - 1, 0), 1);
      const baseY = shown < 1 ? -0.3 - shown * 0.35 : -0.65 + k * 0.45;
      const sway = reduce ? 0 : Math.sin(t * 0.35) * 0.12;
      mesh.rotation.y = baseY + sway + pointer.x * 0.2;
      mesh.rotation.x = 0.32 + k * 0.08 + pointer.y * 0.08;
      camera.lookAt([camera.position.x, camera.position.y, 0]);
      renderer.render({ scene, camera });
    };

    // only animate while the section is on screen
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(section);

    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      geometry.remove();
      program.remove();
      gl.canvas.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [morph]);

  return (
    <section ref={sectionRef} id="home-3d" className="relative w-full h-[400vh]" aria-label="What we build">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* soft red floor glow behind the particles */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_65%_55%,rgba(220,77,73,0.14)_0%,transparent_60%)]" />
        <div ref={canvasHostRef} className="absolute inset-0" />

        <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 pointer-events-none">
          <div className="relative h-full md:w-1/2 pb-20 md:pb-0">
            {STAGES.map((_, i) => (
              <Caption key={i} progress={scrollYProgress} index={i} onExplore={onExplore} />
            ))}
          </div>
        </div>

        {/* progress rail */}
        <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 w-[60%] max-w-xs pointer-events-none">
          <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div style={{ scaleX: barScale }} className="h-full origin-left bg-red-500" />
          </div>
        </div>
      </div>
    </section>
  );
}

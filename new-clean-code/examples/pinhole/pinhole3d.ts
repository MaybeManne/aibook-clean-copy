// The pinhole apparatus as a registered WebGL viz — the escape-hatch path (registerViz),
// browser-only by design. Object (a tree) → barrier with a pinhole → screen. Rays travel in
// straight lines, cross at the hole, and paint an inverted image of height h' = h·v/u.
//
// DECLARATIVE, NOT IMPERATIVE. The reference single-file lesson drove an equivalent scene with
// eleven imperative verbs (`frame`, `showRays`, `moveScreen`, `highlightInversion`, …) fired as
// GSAP tweens on a global timeline. That cannot work here: the live host is clockless and a beat
// may be entered by advancing, by a wrong answer's detour, or by replay — an imperative verb
// stream has no meaning under seek. So each beat instead states the DESIRED STATE as props and
// this module eases from wherever it currently is toward that state:
//
//   yaw, pitch, radius   orbit camera        u, v      object / screen distance
//   rays, image, labels   what is visible    spin      idle auto-orbit
//   highlight            "inversion" | null  grab      learner may drag the tree / screen
//
// Same discipline as the ValueTracker decision: a changing scalar is a PARAM, and per-frame
// recompute happens at the render leaf. Here the leaf owns its own rAF loop (VizView has no
// clock to lend) and its own easing — imported from @lessonstudio/timeline so 3-D motion uses
// the same Manim rate functions as every 2-D storyboard rather than a second easing dialect.
//
// The learner's drag is the one thing that flows OUTWARD: dragging the tree or the screen emits
// `demo.set {key:"u"|"v"}` through VizApi.send, so a manipulation becomes recorded, replayable
// lesson state (the reference file wired the same drag to a local callback, where it was
// invisible to the tutor). Camera angle stays inside — ephemeral render state, never sent.

import * as THREE from "three";
import { easings } from "@lessonstudio/timeline";
import { registerViz, type VizApi, type VizHandle, type VizProps } from "@lessonstudio/render-web";
import { SYMBOL_COLOR } from "./palette.js";

/** The apparatus' full authored state. Every field is a target the scene eases toward. */
export interface PinholeProps {
  yaw?: number; // orbit azimuth (radians)
  pitch?: number; // orbit elevation (radians)
  radius?: number; // camera distance
  u?: number; // object distance from the hole (scene units)
  v?: number; // screen distance from the hole
  rays?: boolean; // draw the three principal rays
  image?: boolean; // draw the projected (inverted) image
  labels?: boolean; // draw the h / h' / u / v annotations
  spin?: boolean; // idle auto-orbit
  highlight?: "inversion" | null;
  grab?: boolean; // learner may drag the tree (u) and the screen (v)
}

/** The apparatus state with every field present — what the render loop actually reads. */
type Resolved = { [K in keyof PinholeProps]-?: PinholeProps[K] };

const DEFAULTS: Resolved = {
  yaw: 1.4, pitch: 0.14, radius: 30, u: 7, v: 7,
  rays: false, image: false, labels: false, spin: false, highlight: null, grab: false,
};

/**
 * Props arrive as an open bag: authored literals from a beat, plus slider values the
 * learner moved, plus any agent `workspace.set` patch — all merged upstream. Coerce
 * rather than trust, so a stringy slider value or a missing key can never NaN the scene.
 */
function resolve(props: VizProps): Resolved {
  const num = (k: keyof PinholeProps, dflt: number): number => {
    const n = Number(props[k as string]);
    return Number.isFinite(n) ? n : dflt;
  };
  const bool = (k: keyof PinholeProps, dflt: boolean): boolean =>
    props[k as string] === undefined ? dflt : !!props[k as string];
  return {
    yaw: num("yaw", DEFAULTS.yaw),
    pitch: num("pitch", DEFAULTS.pitch),
    radius: num("radius", DEFAULTS.radius),
    u: Math.max(1, num("u", DEFAULTS.u)),
    v: Math.max(1, num("v", DEFAULTS.v)),
    rays: bool("rays", DEFAULTS.rays),
    image: bool("image", DEFAULTS.image),
    labels: bool("labels", DEFAULTS.labels),
    spin: bool("spin", DEFAULTS.spin),
    grab: bool("grab", DEFAULTS.grab),
    highlight: props.highlight === "inversion" ? "inversion" : null,
  };
}

const OBJH = 4.2; // object height in scene units — the "h" of h' = h·v/u
const COL = {
  tree: 0x4caf50, trunk: 0x9d806f, pin: 0xfbbf24, barrier: 0x3a4250, screen: 0xcbd5e1,
  ray: [0x34d399, 0xf59e0b, 0x818cf8], axis: 0x3b3b57, bg: 0x0f0e17,
};
const EASE = easings.smooth; // the Manim default, shared with every 2-D storyboard
const TWEEN_MS = 900;

/** One eased scalar: `set(target)` starts a tween from the current value; `at(now)` reads it. */
function scalar(initial: number): { set(to: number, now: number): void; at(now: number): number } {
  let from = initial, to = initial, start = -1;
  return {
    set(next, now) {
      if (next === to) return;
      from = this.at(now);
      to = next;
      start = now;
    },
    at(now) {
      if (start < 0 || now >= start + TWEEN_MS) return to;
      return from + (to - from) * EASE((now - start) / TWEEN_MS);
    },
  };
}

function makeTree(): THREE.Group {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.3, 2, 8),
    new THREE.MeshStandardMaterial({ color: COL.trunk, roughness: 0.85, transparent: true }),
  );
  trunk.position.y = 1;
  g.add(trunk);
  const fol = new THREE.MeshStandardMaterial({ color: COL.tree, roughness: 0.7, transparent: true });
  for (const [x, y, z, r] of [[0, 2.6, 0, 1.15], [0.7, 2.1, 0.2, 0.9], [-0.6, 1.9, -0.3, 0.75], [0, 3.5, 0.1, 0.8]] as const) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), fol);
    m.position.set(x, y, z);
    g.add(m);
  }
  return g;
}

/** A canvas-drawn text sprite — cheap 3-D labels without loading a font atlas. */
function makeLabel(text: string, color: string): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.font = "600 40px ui-sans-serif, system-ui, sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 128, 32);
  }
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true }));
  sprite.scale.set(3.2, 0.8, 1);
  return sprite;
}

function pinholeFactory(el: HTMLElement, initial: VizProps, api: VizApi): VizHandle {
  // ── mount ──
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "width:100%;height:100%;display:block;border-radius:12px;cursor:grab";
  el.style.cssText = "width:100%;height:100%;min-height:320px";
  el.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COL.bg);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500);
  const root = new THREE.Group();
  scene.add(root);

  scene.add(new THREE.AmbientLight(0xffffff, 0.85));
  scene.add(new THREE.HemisphereLight(0xbcd4ff, 0x202033, 1.1));
  const dir = new THREE.DirectionalLight(0xffffff, 0.5);
  dir.position.set(6, 10, 8);
  scene.add(dir);

  // optical axis
  root.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -20), new THREE.Vector3(0, 0, 20)]),
    new THREE.LineBasicMaterial({ color: COL.axis }),
  ));

  // barrier: a 16×16 plate with a real hole punched through it (Shape + Path hole)
  const plate = new THREE.Shape();
  plate.moveTo(-8, -8); plate.lineTo(8, -8); plate.lineTo(8, 8); plate.lineTo(-8, 8); plate.lineTo(-8, -8);
  const hole = new THREE.Path();
  hole.absarc(0, 0, 0.32, 0, Math.PI * 2, true);
  plate.holes.push(hole);
  root.add(new THREE.Mesh(
    new THREE.ShapeGeometry(plate),
    new THREE.MeshStandardMaterial({ color: COL.barrier, side: THREE.DoubleSide, transparent: true, opacity: 0.92, roughness: 0.9 }),
  ));
  const pin = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), new THREE.MeshBasicMaterial({ color: COL.pin }));
  root.add(pin);

  // object (tree) and its inverted projection
  const tree = makeTree();
  root.add(tree);
  const projTree = makeTree();
  projTree.traverse((n) => {
    if ((n as THREE.Mesh).isMesh) {
      const m = (n as THREE.Mesh).material as THREE.MeshStandardMaterial;
      (n as THREE.Mesh).material = m.clone();
    }
  });
  root.add(projTree);

  // screen
  const screenGroup = new THREE.Group();
  screenGroup.add(new THREE.Mesh(
    new THREE.PlaneGeometry(16, 16),
    new THREE.MeshStandardMaterial({ color: COL.screen, side: THREE.DoubleSide, transparent: true, opacity: 0.16 }),
  ));
  screenGroup.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(16, 16)),
    new THREE.LineBasicMaterial({ color: 0x64708a }),
  ));
  root.add(screenGroup);

  // three principal rays: from the top, middle and base of the object
  const rays = COL.ray.map((c) => {
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]),
      new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0 }),
    );
    root.add(line);
    return line;
  });

  // Label hues come from the shared palette, so the amber `u` floating in the scene is the
  // same amber as the `u` in the lesson's `h' = h·v/u` (see ./palette.ts).
  const labels = {
    h: makeLabel("h", SYMBOL_COLOR.h), hp: makeLabel("h′", SYMBOL_COLOR.hp),
    u: makeLabel("u", SYMBOL_COLOR.u), v: makeLabel("v", SYMBOL_COLOR.v),
  };
  for (const s of Object.values(labels)) { s.material.opacity = 0; root.add(s); }

  // ── eased state ──
  const p0 = resolve(initial);
  const S = {
    yaw: scalar(p0.yaw), pitch: scalar(p0.pitch), radius: scalar(p0.radius),
    u: scalar(p0.u), v: scalar(p0.v),
    rays: scalar(p0.rays ? 1 : 0), image: scalar(p0.image ? 1 : 0), labels: scalar(p0.labels ? 1 : 0),
  };
  let want: Resolved = p0;
  let spinPhase = 0;
  let t0 = -1;

  // ── learner interaction: orbit always; drag the tree/screen when `grab` ──
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let orbiting = false, lastX = 0, lastY = 0;
  let grabbed: "u" | "v" | null = null;
  let manual = { u: null as number | null, v: null as number | null }; // learner overrides until the next authored change

  const toNdc = (e: PointerEvent): void => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  };

  const onDown = (e: PointerEvent): void => {
    canvas.setPointerCapture(e.pointerId);
    toNdc(e);
    if (want.grab) {
      ray.setFromCamera(ndc, camera);
      const hitTree = ray.intersectObject(tree, true).length > 0;
      const hitScreen = ray.intersectObject(screenGroup, true).length > 0;
      if (hitTree || hitScreen) {
        grabbed = hitTree ? "u" : "v";
        canvas.style.cursor = "grabbing";
        return;
      }
    }
    orbiting = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.style.cursor = "grabbing";
  };

  const onMove = (e: PointerEvent): void => {
    if (grabbed) {
      // Drag along the optical axis: project the pointer onto the z-axis at the object's height.
      toNdc(e);
      ray.setFromCamera(ndc, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hit = new THREE.Vector3();
      if (!ray.ray.intersectPlane(plane, hit)) return;
      const dist = Math.max(2.5, Math.min(16, Math.abs(hit.z)));
      const rounded = Math.round(dist * 2) / 2;
      manual[grabbed] = rounded;
      // OUTBOUND: the manipulation becomes recorded, replayable lesson state.
      api.send({ type: "demo.set", payload: { key: grabbed, value: rounded } });
      return;
    }
    if (!orbiting) return;
    const yaw = S.yaw.at(performance.now()) - (e.clientX - lastX) * 0.008;
    const pitch = Math.max(-0.5, Math.min(0.9, S.pitch.at(performance.now()) + (e.clientY - lastY) * 0.005));
    // Camera is EPHEMERAL render state: retarget locally, never send it outward.
    S.yaw.set(yaw, -1);
    S.pitch.set(pitch, -1);
    want = { ...want, yaw, pitch };
    lastX = e.clientX;
    lastY = e.clientY;
  };

  const onUp = (e: PointerEvent): void => {
    orbiting = false;
    grabbed = null;
    canvas.style.cursor = want.grab ? "grab" : "grab";
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
  };

  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);

  // ── per-frame recompute ──
  function layout(now: number): void {
    const u = manual.u ?? S.u.at(now);
    const v = manual.v ?? S.v.at(now);
    const m = v / u; // magnification — the whole lesson in one ratio
    const showRays = S.rays.at(now);
    const showImage = S.image.at(now);
    const showLabels = S.labels.at(now);

    tree.position.z = -u;
    screenGroup.position.z = v;

    // The image: scaled by m and MIRRORED in y (negative scale) — that is the inversion.
    projTree.position.set(0, 0, v - 0.05);
    projTree.scale.set(m, -m, 0.02);
    projTree.visible = showImage > 0.01;
    const pulse = want.highlight === "inversion" ? 0.55 + 0.45 * Math.abs(Math.sin(now / 320)) : 1;
    projTree.traverse((n) => {
      const mesh = n as THREE.Mesh;
      if (mesh.isMesh) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = showImage * pulse;
        mat.transparent = true;
      }
    });

    // Rays: object point → hole at the origin → the mirrored point on the screen.
    const heights = [OBJH, OBJH / 2, 0];
    rays.forEach((line, i) => {
      const y = heights[i] ?? 0;
      const pts = [
        new THREE.Vector3(0, y, -u),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, (-y * v) / u, v),
      ];
      line.geometry.setFromPoints(pts);
      (line.material as THREE.LineBasicMaterial).opacity = showRays;
      line.visible = showRays > 0.01;
    });

    pin.scale.setScalar(want.highlight === "inversion" ? 1 : 1 + 0.35 * Math.sin(now / 260) * showRays);

    labels.h.position.set(0, OBJH + 0.9, -u);
    labels.hp.position.set(0, -OBJH * m - 0.9, v);
    labels.u.position.set(0, -0.9, -u / 2);
    labels.v.position.set(0, -0.9, v / 2);
    labels.hp.scale.set(3.2, 0.8, 1);
    for (const [k, s] of Object.entries(labels)) {
      s.material.opacity = k === "hp" ? showLabels * showImage : showLabels;
      s.visible = s.material.opacity > 0.01;
    }

    // Camera. The authored `radius` is a FLOOR, not an absolute: pushing the screen out to
    // v = 14 would otherwise walk the apparatus off the edge of the panel, and a beat should
    // not have to predict how far the learner will drag a slider.
    if (want.spin) spinPhase += 0.0022;
    const yaw = S.yaw.at(now) + spinPhase;
    const pitch = S.pitch.at(now);
    const r = Math.max(S.radius.at(now), 2.2 * Math.max(u, v) + 6);
    camera.position.set(r * Math.cos(pitch) * Math.sin(yaw), r * Math.sin(pitch) + 1, r * Math.cos(pitch) * Math.cos(yaw));
    camera.lookAt(0, 0, 0);
  }

  function resize(): void {
    const w = el.clientWidth || 480;
    const h = el.clientHeight || 360;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(el);

  let raf = 0;
  const loop = (now: number): void => {
    if (t0 < 0) t0 = now;
    layout(now);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return {
    update(next: VizProps): void {
      const now = performance.now();
      const p = resolve(next);
      // An authored u/v supersedes a learner's drag, but only when it actually CHANGES —
      // otherwise re-rendering the same beat would keep snapping the apparatus back.
      if (p.u !== want.u) manual.u = null;
      if (p.v !== want.v) manual.v = null;
      S.yaw.set(p.yaw, now);
      S.pitch.set(p.pitch, now);
      S.radius.set(p.radius, now);
      S.u.set(p.u, now);
      S.v.set(p.v, now);
      S.rays.set(p.rays ? 1 : 0, now);
      S.image.set(p.image ? 1 : 0, now);
      S.labels.set(p.labels ? 1 : 0, now);
      want = p;
      canvas.style.cursor = "grab";
    },
    // Closes the export hole for this beat: the live framebuffer as a PNG data URL.
    // (`preserveDrawingBuffer: true` above is what makes this readable after a render.)
    poster(): string | null {
      try {
        return renderer.domElement.toDataURL("image/png");
      } catch {
        return null;
      }
    },
    destroy(): void {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      renderer.dispose();
      el.innerHTML = "";
    },
  };
}

export const PINHOLE_VIZ = "pinhole-3d";
registerViz(PINHOLE_VIZ, pinholeFactory);

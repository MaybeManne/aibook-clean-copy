import * as THREE from "three";
import { easings } from "@lessonstudio/timeline";
import { registerViz, type VizApi, type VizHandle, type VizProps } from "@lessonstudio/web";
import type { Theme } from "@lessonstudio/theme";
import { symbolColors } from "./palette.js";

/** The apparatus' full authored state. Every field is a target the scene eases toward. */
export interface PinholeProps {
  yaw?: number;
  pitch?: number;
  radius?: number;
  u?: number;
  v?: number;
  rays?: boolean;
  image?: boolean;
  labels?: boolean;
  spin?: boolean;
  highlight?: "inversion" | null;
  grab?: boolean;
}

type Resolved = { [K in keyof PinholeProps]-?: PinholeProps[K] };

const DEFAULTS: Resolved = {
  yaw: 1.4, pitch: 0.14, radius: 30, u: 7, v: 7,
  rays: false, image: false, labels: false, spin: false, highlight: null, grab: false,
};

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

const OBJH = 4.2;

/** Object colours that are PHYSICAL facts of the apparatus — a tree is green in either mode. */
const OBJECT_COL = { tree: 0x4caf50, trunk: 0x9d806f, pin: 0xfbbf24, barrier: 0x3a4250 };

const hex = (css: string): number => new THREE.Color(css).getHex();

/**
 * The apparatus colours that DO depend on the theme: the ground it floats on, the optical axis, the
 * projection screen, and the three light rays (which are data marks, so they come from `series`).
 *
 * A WebGL viz has to paint its own background, so it is the one figure kind that cannot inherit the
 * page. `VizApi.theme` supplies it at mount and `VizHandle.setTheme` on every switch after — without
 * a remount, so the learner keeps the camera angle they dragged to.
 */
function themeCol(theme: Theme): { bg: number; axis: number; screen: number; screenEdge: number; ray: number[] } {
  const series = theme.figure.series;
  return {
    bg: hex(theme.color.stage),
    axis: hex(theme.figure.axis),
    // The screen is a translucent plane, so it needs to be the OPPOSITE of the ground to read at all.
    screen: hex(theme.figure.ink),
    screenEdge: hex(theme.figure.muted),
    ray: [series[2], series[4], series[0]].map((c, i) => hex(c ?? [theme.color.correct, theme.color.alert, theme.color.accent][i]!)),
  };
}
const EASE = easings.smooth;
const TWEEN_MS = 900;

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
    new THREE.MeshStandardMaterial({ color: OBJECT_COL.trunk, roughness: 0.85, transparent: true }),
  );
  trunk.position.y = 1;
  g.add(trunk);
  const fol = new THREE.MeshStandardMaterial({ color: OBJECT_COL.tree, roughness: 0.7, transparent: true });
  for (const [x, y, z, r] of [[0, 2.6, 0, 1.15], [0.7, 2.1, 0.2, 0.9], [-0.6, 1.9, -0.3, 0.75], [0, 3.5, 0.1, 0.8]] as const) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), fol);
    m.position.set(x, y, z);
    g.add(m);
  }
  return g;
}

function paintLabel(canvas: HTMLCanvasElement, text: string, color: string): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "600 40px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 128, 32);
}

/**
 * A symbol label as a sprite. `recolour` repaints the same canvas texture rather than building a new
 * sprite, so the lesson's symbol key can follow a mode switch in place — the label for `v` stays the
 * same blue as `v` in the prose, in both modes.
 */
function makeLabel(text: string, color: string): THREE.Sprite & { recolour: (c: string) => void } {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  paintLabel(canvas, text, color);
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
  sprite.scale.set(3.2, 0.8, 1);
  return Object.assign(sprite, {
    recolour(next: string): void {
      paintLabel(canvas, text, next);
      texture.needsUpdate = true;
    },
  });
}

function pinholeFactory(el: HTMLElement, initial: VizProps, api: VizApi): VizHandle {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "width:100%;height:100%;display:block;border-radius:12px;cursor:grab";
  el.style.cssText = "width:100%;height:100%;min-height:320px";
  el.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  let COL = themeCol(api.theme);
  let symbols = symbolColors(api.theme.mode);
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

  const axisMat = new THREE.LineBasicMaterial({ color: COL.axis });
  root.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -20), new THREE.Vector3(0, 0, 20)]),
    axisMat,
  ));

  const plate = new THREE.Shape();
  plate.moveTo(-8, -8); plate.lineTo(8, -8); plate.lineTo(8, 8); plate.lineTo(-8, 8); plate.lineTo(-8, -8);
  const hole = new THREE.Path();
  hole.absarc(0, 0, 0.32, 0, Math.PI * 2, true);
  plate.holes.push(hole);
  root.add(new THREE.Mesh(
    new THREE.ShapeGeometry(plate),
    new THREE.MeshStandardMaterial({ color: OBJECT_COL.barrier, side: THREE.DoubleSide, transparent: true, opacity: 0.92, roughness: 0.9 }),
  ));
  const pin = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), new THREE.MeshBasicMaterial({ color: OBJECT_COL.pin }));
  root.add(pin);

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

  const screenGroup = new THREE.Group();
  const screenMat = new THREE.MeshStandardMaterial({ color: COL.screen, side: THREE.DoubleSide, transparent: true, opacity: 0.16 });
  screenGroup.add(new THREE.Mesh(new THREE.PlaneGeometry(16, 16), screenMat));
  const screenEdgeMat = new THREE.LineBasicMaterial({ color: COL.screenEdge });
  screenGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(16, 16)), screenEdgeMat));
  root.add(screenGroup);

  const rays = COL.ray.map((c) => {
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]),
      new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0 }),
    );
    root.add(line);
    return line;
  });

  const labels = {
    h: makeLabel("h", symbols.h!), hp: makeLabel("h′", symbols.hp!),
    u: makeLabel("u", symbols.u!), v: makeLabel("v", symbols.v!),
  };
  for (const s of Object.values(labels)) { s.material.opacity = 0; root.add(s); }

  const p0 = resolve(initial);
  const S = {
    yaw: scalar(p0.yaw), pitch: scalar(p0.pitch), radius: scalar(p0.radius),
    u: scalar(p0.u), v: scalar(p0.v),
    rays: scalar(p0.rays ? 1 : 0), image: scalar(p0.image ? 1 : 0), labels: scalar(p0.labels ? 1 : 0),
  };
  let want: Resolved = p0;
  let spinPhase = 0;
  let t0 = -1;

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let orbiting = false, lastX = 0, lastY = 0;
  let grabbed: "u" | "v" | null = null;
  let manual = { u: null as number | null, v: null as number | null };

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
      toNdc(e);
      ray.setFromCamera(ndc, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hit = new THREE.Vector3();
      if (!ray.ray.intersectPlane(plane, hit)) return;
      const dist = Math.max(2.5, Math.min(16, Math.abs(hit.z)));
      const rounded = Math.round(dist * 2) / 2;
      manual[grabbed] = rounded;
      api.send({ type: "demo.set", payload: { key: grabbed, value: rounded } });
      return;
    }
    if (!orbiting) return;
    const yaw = S.yaw.at(performance.now()) - (e.clientX - lastX) * 0.008;
    const pitch = Math.max(-0.5, Math.min(0.9, S.pitch.at(performance.now()) + (e.clientY - lastY) * 0.005));
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

  function layout(now: number): void {
    const u = manual.u ?? S.u.at(now);
    const v = manual.v ?? S.v.at(now);
    const m = v / u;
    const showRays = S.rays.at(now);
    const showImage = S.image.at(now);
    const showLabels = S.labels.at(now);

    tree.position.z = -u;
    screenGroup.position.z = v;

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
    setTheme(theme: Theme): void {
      COL = themeCol(theme);
      symbols = symbolColors(theme.mode);
      scene.background = new THREE.Color(COL.bg);
      axisMat.color.setHex(COL.axis);
      screenMat.color.setHex(COL.screen);
      screenEdgeMat.color.setHex(COL.screenEdge);
      rays.forEach((line, i) => {
        const c = COL.ray[i];
        if (c !== undefined) (line.material as THREE.LineBasicMaterial).color.setHex(c);
      });
      labels.h.recolour(symbols.h!);
      labels.hp.recolour(symbols.hp!);
      labels.u.recolour(symbols.u!);
      labels.v.recolour(symbols.v!);
      // No explicit repaint: the rAF loop below renders every frame, so the new colours land next tick.
    },

    update(next: VizProps): void {
      const now = performance.now();
      const p = resolve(next);
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

/**
 * WHAT THE APPARATUS ACCEPTS, for a director.
 *
 * `Record<keyof Resolved, string>` rather than a hand-kept list: adding a prop to `PinholeProps`
 * without documenting it here is a type error, so the description cannot fall behind the code.
 * Every prop is optional (each one eases from wherever it is), which is why the doc says so once
 * instead of marking ten names.
 */
const PINHOLE_PROP_DOCS: Record<keyof Resolved, string> = {
  u: "object distance, barrier to tree (clamped to >= 1)",
  v: "image distance, barrier to screen (clamped to >= 1)",
  rays: "draw the three ray bundles through the hole",
  image: "draw the inverted image on the screen",
  labels: "draw the h, h', u, v dimension labels",
  highlight: '"inversion" to emphasize the crossing at the hole, or null',
  spin: "slowly orbit the camera",
  grab: "let the learner drag to orbit",
  yaw: "camera azimuth, radians",
  pitch: "camera elevation, radians",
  radius: "camera distance from the apparatus",
};

/**
 * The `visuals` argument for `observe()` / `directorSystem()`. Exported from beside the viz so the
 * schema and the code that reads the props are one file apart at most, and passed in by the host
 * because `lesson/` may not import `web/`.
 */
export const PINHOLE_VIZ_SCHEMA = {
  [PINHOLE_VIZ]: {
    props: PINHOLE_PROP_DOCS as Record<string, string>,
    doc:
      "The 3-D apparatus: tree, barrier with one hole, screen. Geometry only — it has NO aperture " +
      "size, brightness or blur, so a question about a wider hole needs a NEW figure (a `scene` " +
      "beat, or an `explorable` with a `declarative` viz), not a prop on this one.",
  },
};

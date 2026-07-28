// The Pinhole Camera & Image Formation — the reference single-file explainer rebuilt on
// lessonStudio. Same physics, same script, same 3-D apparatus; the differences are structural:
//
//   • ONE persistent apparatus. The reference lesson fired imperative verbs at a global GSAP
//     timeline; here every beat declares the STATE it wants (camera, u, v, what's visible) and
//     the viz eases there — so entering a beat by advancing, by a wrong answer's detour, or by
//     replay all look identical.
//   • The learner's drag is lesson state. `grab: true` lets them pull the tree or the screen
//     along the axis; the viz reports `demo.set {u|v}` back into the session, which is what
//     turns a manipulation into something the tutor can observe (the reference wired the same
//     drag to a local callback where nothing could see it).
//   • Remediation is routed, not scripted. Both gates carry `onWrong` detours that rejoin the
//     main line — the reference's "branch acts" as ordinary graph edges.
//
// Cards: the reference had six bespoke card types (title/derivation/split/graph/bar-chart/recap).
// Five of them are just prose structure, and `article()` already parses headings, lists, callouts
// and `$…$`/`$$…$$` KaTeX — so they are authored as prose here rather than as new components.

import { defineLesson, explain, explorable, freeResponse, mcq } from "@lessonstudio/lesson";
import { article, md } from "@lessonstudio/render-contract";
import { tex } from "./palette.js";
import { PINHOLE_VIZ, type PinholeProps } from "./pinhole3d.js";

// Colour-coded variables, from the same palette the 3-D label sprites use: the amber `u` in an
// equation is the amber `u` floating along the optical axis in the figure. Authoring pays for it
// by writing `${U}` instead of `u` inside the TeX — cheap, and it is what makes the figure and
// the algebra one diagram instead of two. (`tex()` emits `\textcolor{…}{u}`; KaTeX does the rest.)
const H = tex("h"), HP = tex("hp"), U = tex("u"), V = tex("v"), M = tex("m");
const LR = tex("Lr"), LI = tex("Li"), RHO = tex("rho"), OMEGA = tex("Omega"), WI = tex("omega"), NRM = tex("normal");

/**
 * Every beat drives the same mounted apparatus; `persistent` keeps it to ONE WebGL context.
 * Typing the argument as `PinholeProps` is what keeps a mistyped field (`highligh: …`) a
 * compile error — the cast to the intent's open prop bag happens once, here.
 */
const apparatus = (props: PinholeProps): { name: string; props: Record<string, unknown>; persistent: true } => ({
  name: PINHOLE_VIZ,
  props: props as Record<string, unknown>,
  persistent: true,
});

export const lessonSpec = {
  id: "pinhole-camera",
  version: 1,
  title: "The Pinhole Camera & Image Formation",
  flow: [
    // ══ PART 1 — the blank-wall puzzle ═══════════════════════════════════════════════
    explain({
      id: "wall-1",
      narration:
        "Look at a blank wall. Why don't you see a picture of the room reflected on it? " +
        "The wall is clearly lit, yet there is no image.",
      viz: apparatus({ yaw: 1.4, pitch: 0.14, radius: 30, u: 7, v: 7 }),
      text: article(
        "# The Pinhole Camera\n" +
          "How does one small hole turn light into a picture?\n\n" +
          "> Why does a blank wall show no image — yet a single pinhole does?\n\n" +
          "*Drag the figure to look around the apparatus.*",
      ),
      next: "wall-2",
    }),

    explain({
      id: "wall-2",
      narration:
        "The reason is that every point on a matte wall gathers light arriving from all " +
        "directions at once, and reflects a blend of all of it.",
      viz: apparatus({ yaw: 1.55, pitch: 0.2, radius: 28, u: 7, v: 7 }),
      text: article(
        "## Reflection off a matte (Lambertian) wall\n\n" +
          `$$${LR} = \\frac{${RHO}}{\\pi} \\int_{${OMEGA}} ${LI}(${WI})\\,(${WI} \\cdot ${NRM})\\; d${WI}$$\n\n` +
          `Integrate the incoming light $${LI}$ over the whole hemisphere $${OMEGA}$ of directions $${WI}$.\n\n` +
          `$$${LR} \\;\\approx\\; \\langle ${LI} \\rangle$$\n\n` +
          `The reflected light $${LR}$ is essentially an **average** over every incoming ray.`,
      ),
      next: "wall-3",
    }),

    explain({
      id: "wall-3",
      narration:
        "Because the wall reflects an average of all those incoming rays, its brightness tells " +
        "us almost nothing about which ray came from which direction. To turn light into a " +
        "picture, we have to do the opposite of averaging: we have to sort the rays out by the " +
        "direction they came from.",
      viz: apparatus({ yaw: 1.3, pitch: 0.1, radius: 28, u: 7, v: 7 }),
      text: article(
        `The reflected intensity $${LR}$ says little about the light $${LI}(${WI})$ from any single direction $${WI}$.\n\n` +
          "> [tip] **To form an image we must sort the rays by direction.**",
      ),
      next: "hole-1",
    }),

    // ══ PART 2 — the pinhole sorts the rays ══════════════════════════════════════════
    explain({
      id: "hole-1",
      narration:
        "A pinhole camera is nothing more than a light-tight box with one small hole and a " +
        "surface to catch the light.",
      viz: apparatus({ yaw: 1.4, pitch: 0.12, radius: 30, u: 7, v: 7 }),
      text: article(
        "## A hole that sorts the rays\n\n" +
          "An object, a barrier with a single small hole, and a screen to catch what gets through. That is the entire camera.",
      ),
      next: "hole-2",
    }),

    explain({
      id: "hole-2",
      narration:
        "Here is the trick. For any single point on that surface, light can only arrive from " +
        "one direction: the straight line joining the point and the hole.",
      viz: apparatus({ yaw: 1.25, pitch: 0.16, radius: 26, u: 7, v: 7, rays: true }),
      text: article(
        "### Wall vs. pinhole\n\n" +
          "- **Blank wall:** each point receives rays from *all* directions at once — they average into a blur, so **no image** forms.\n" +
          "- **Pinhole:** each screen point receives rays from just *one* direction — the straight line through the hole — so **an image** forms.",
      ),
      next: "hole-3",
    }),

    explain({
      id: "hole-3",
      narration:
        "That one-direction rule turns the cacophony of light into a clean image. And because " +
        "the rays cross at the hole, the picture lands upside-down.",
      viz: apparatus({ yaw: 1.55, pitch: 0.1, radius: 24, u: 7, v: 7, rays: true, image: true, highlight: "inversion" }),
      text: article("Each screen point sees exactly **one** direction — the image is organized, and **inverted**."),
      next: "gate-invert",
    }),

    // ── Gate 1: is the image inverted? ───────────────────────────────────────────────
    mcq({
      id: "gate-invert",
      prompt: md("Through a pinhole, the image formed on the screen is…"),
      choices: [
        { text: "Upright and the same size", misconception: "pinhole-upright" },
        { text: "Inverted (upside-down)", correct: true },
        { text: "Blurry unless you focus it", misconception: "pinhole-needs-focus" },
        { text: "Just one bright spot", misconception: "pinhole-single-spot" },
      ],
      skill: "pinhole-inversion",
      correctFeedback: "Correct — because the rays cross at the pinhole, the image is inverted.",
      wrongFeedback: "Not quite. Follow one ray from the top of the object and see where it lands.",
      onWrong: "why-flips",
      next: "triangles",
    }),

    explain({
      id: "why-flips",
      narration:
        "The ray from the top of the object passes through the hole and keeps going in a " +
        "straight line to the bottom of the screen. Up becomes down, so the whole image is inverted.",
      viz: apparatus({ yaw: 1.55, pitch: 0.1, radius: 24, u: 7, v: 7, rays: true, image: true, highlight: "inversion" }),
      text: article(
        "**Why it flips.** Watch the top ray. It travels in a straight line, through the hole, and continues — " +
          "landing at the *bottom* of the screen. Every ray does the same, so up becomes down and the whole image is inverted.\n\n" +
          "A pinhole also needs no focusing, and every object point maps to its own screen point — so a full image forms, not a single spot.",
      ),
      next: "triangles",
    }),

    // ══ PART 3 — image geometry ══════════════════════════════════════════════════════
    explain({
      id: "triangles",
      narration:
        "How big is that image? The rays from the top and bottom of the object make two " +
        "triangles that meet at the hole, and they are similar. So the image height is the " +
        "object height scaled by v over u, and the crossing at the hole flips it upside-down.",
      viz: apparatus({ yaw: 1.5, pitch: 0.06, radius: 24, u: 7, v: 7, rays: true, image: true, labels: true }),
      text: article(
        "## Image height from similar triangles\n\n" +
          "The two triangles share their apex at the hole, so\n\n" +
          `$$\\frac{${HP}}{${H}} = \\frac{${V}}{${U}} \\qquad\\Longrightarrow\\qquad ${HP} = ${H}\\,\\frac{${V}}{${U}}.$$\n\n` +
          `The size ratio is the **magnification** $${M} = ${V}/${U}$ — written $${M} = -${V}/${U}$ when the minus sign is used to record that the image is inverted.\n\n` +
          `- $${H}$ — object height\n` +
          `- $${HP}$ — image height\n` +
          `- $${U}$ — object distance\n` +
          `- $${V}$ — screen distance\n\n` +
          "*Each symbol is the same colour here as it is in the figure.*",
      ),
      next: "move-screen",
    }),

    // ══ PART 4 — move the screen (the two-paper experiment) ══════════════════════════
    explorable({
      id: "move-screen",
      narration:
        "You can build this yourself with two sheets of paper — one with a small hole, and a " +
        "blank sheet as the screen. Slide the screen farther from the hole and the image grows " +
        "larger, while staying perfectly sharp. Pull it back in and the image shrinks again.",
      viz: apparatus({ yaw: 1.35, pitch: 0.14, radius: 32, u: 7, rays: true, image: true, labels: true, grab: true }),
      controls: [
        { key: "v", label: "screen distance  v", kind: "slider", min: 4, max: 14, step: 1, unit: " m" },
        { key: "__next", label: "I've got it — continue →", kind: "button" },
      ],
      defaults: { v: 7 },
      goal: { key: "v", min: 12 },
      task: md(`**Push the screen out to $${V} \\ge 12$** — with the slider, or by dragging the screen itself in the figure. Watch $${HP}$ grow while the image stays sharp.`),
      success: md(`The image height grows in exact proportion: $${HP} = ${H}\\,${V}/${U}$ is a straight line through the origin — and every point stays perfectly sharp. That sharpness at *any* distance is **infinite depth of field**.`),
      note:
        "A pinhole never needs focusing. Only one ray direction reaches each screen point, so no " +
        "cone of light is ever spread across the surface — there is nothing to defocus.",
      next: "gate-m",
    }),

    // ── Gate 2: compute the magnification ────────────────────────────────────────────
    freeResponse({
      id: "gate-m",
      prompt: md(`An object at $${U} = 5\\,\\text{m}$ forms an image on a screen at $${V} = 15\\,\\text{m}$. The magnification $${M} = ${V}/${U}$ is…`),
      accept: ["3", "3.0", "3x", "×3", "x3"],
      hint: `Magnification is just $${V}/${U} = 15/5$.`,
      correctFeedback: `$${M} = 15/5 = 3$, so the image is 3× the object (and inverted).`,
      wrongFeedback: "Not quite — it is the ratio of the two distances. Let's walk it through.",
      skill: "magnification",
      misconception: "magnification-arithmetic",
      onWrong: "m-walkthrough",
      next: "move-object",
    }),

    explain({
      id: "m-walkthrough",
      narration: "Magnification is just the ratio of the two distances.",
      viz: apparatus({ yaw: 1.5, pitch: 0.08, radius: 26, u: 5, v: 15, rays: true, image: true, labels: true }),
      text: article(
        `## $${M}$ for $${U} = 5$, $${V} = 15$\n\n` +
          `$$${M} = \\frac{${V}}{${U}} \\qquad\\text{(definition)}$$\n\n` +
          `$$${M} = \\frac{15}{5} = 3 \\qquad\\text{(substitute)}$$\n\n` +
          "The figure is now set to exactly this case — the image is three times the object's height, and inverted.",
      ),
      next: "move-object",
    }),

    // ══ PART 4b — move the object ════════════════════════════════════════════════════
    explorable({
      id: "move-object",
      narration:
        "Now leave the screen fixed and move the object instead. Bring it close to the hole and " +
        "the image gets larger. Move it far away and the image gets smaller, because the height " +
        "depends on v over u.",
      viz: apparatus({ yaw: 1.45, pitch: 0.14, radius: 30, v: 7, rays: true, image: true, labels: true, grab: true }),
      controls: [
        { key: "u", label: "object distance  u", kind: "slider", min: 3, max: 14, step: 1, unit: " m" },
        { key: "__next", label: "Continue →", kind: "button" },
      ],
      defaults: { u: 12 },
      goal: { key: "u", equals: 7 },
      task: md(`The screen is fixed at $${V} = 7$. **Bring the object to $${U} = 7$** — drag the tree, or use the slider — and watch what the image height does.`),
      success: md(`At $${U} = ${V}$ the magnification is $${M} = 1$: the image is exactly the same size as the object, just flipped.`),
      note: `Close object ⇒ large image; distant object ⇒ small image. Only the ratio $${V}/${U}$ matters, never either distance alone.`,
      next: "sharp",
    }),

    // ══ PART 5 — why sharp, and why it matters ═══════════════════════════════════════
    explain({
      id: "sharp",
      narration:
        "Why is it never blurry? Because only one ray direction reaches each screen point, no " +
        "smeared cone of light ever forms. The same idea explains a lot around us: the camera " +
        "obscura, the eye, even the little images cast through gaps in leaves during a solar eclipse.",
      viz: apparatus({ yaw: 1.35, pitch: 0.12, radius: 26, u: 7, v: 7, rays: true, image: true, labels: true }),
      text: article(
        "## One direction per point\n\n" +
          "- The hole admits **exactly one** ray direction toward each point.\n" +
          "- No overlapping cone of rays ⇒ **no blur circle** ever forms.\n\n" +
          "### Where pinhole imaging shows up\n\n" +
          "- the camera obscura\n" +
          "- dappled eclipse images under a tree\n" +
          "- pinhole eyes in nature (the *Nautilus*)\n" +
          "- pinhole photography",
      ),
      next: "recap",
    }),

    explain({
      id: "recap",
      narration:
        "In short, a camera's whole job is to organize rays by direction, and the pinhole is the " +
        "simplest way to do it.",
      viz: apparatus({ yaw: 1.4, pitch: 0.18, radius: 30, u: 7, v: 7, rays: true, image: true, labels: true, spin: true }),
      text: article(
        "## Key takeaways\n\n" +
          "- A matte wall averages light from all directions ⇒ **no image**\n" +
          "- A pinhole gives each screen point **one direction** ⇒ an organized image\n" +
          "- Rays cross at the hole ⇒ the image is **inverted**\n" +
          `- Similar triangles ⇒ $${HP} = ${H}\\,${V}/${U}$, magnification $${M} = ${V}/${U}$\n` +
          "- One direction per point ⇒ **sharp at any distance** (infinite depth of field)\n\n" +
          "> A camera's whole job is to organize rays by direction. The pinhole is the simplest way to do it.",
      ),
      next: null,
    }),
  ],
};

export const lesson = defineLesson(lessonSpec);

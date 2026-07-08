# ActiveReader Imaging Clean

*Adaptive QMD reader for the Imaging chapter.* A small, push-ready ActiveReader
slice that loads one VisionBook chapter, compiles its concept graph into a
roadmap, tracks learner state, and inserts curated generated figures from the
FiguresLLM gallery.

This repo is intentionally scoped to `imaging.qmd`: no PDF runner, no PDF books,
no `node_modules`, and no file over GitHub's 100MB single-file limit.

## Layers

```
apps/active-reader-qmd/
  backend/             Express API for QMD rendering, lesson metadata, tutor/RAG
                       routes, student model persistence, and generated figure
                       cache access.
  frontend/            React reader UI: split-screen QMD view, roadmap/world map,
                       tutor panel, learner model UI, and figure gallery.
    src/conceptStateMachine.js
                       Concept lifecycle logic: locked, ready, active, mastered,
                       support routing, and related concept-level transitions.
    src/learnerStateMachine.js
                       Runtime interaction state: reading, answering, retrying,
                       stuck/idle-style signals.
    src/learnerModel.js
                       Fine-grained learner model: knowledge band + disposition
                       updated from answer evidence, confidence, hints, latency,
                       and dwell signals.

content/
  visionbook-qmd/      `imaging.qmd` plus only the static figure assets that
                       chapter references.
  chapter_graphs/      `ch05.json`: Imaging concept graph and prerequisite /
                       overlay edges used by the roadmap.
  active-reader-demo/  Imaging lesson plans, concept/figure indexes, and curated
                       interactive HTML for gallery-scored figures above 4.0.
  figure-results/      Cached generated FiguresLLM outputs for the kept
                       above-4.0 Imaging figures.
  figure-examples/     Small hand-picked figure override examples.
```

**The chapter graph owns the learning route.** The UI can adapt presentation and
support based on learner evidence, but concept unlocks, prerequisites, and
roadmap structure come from authored/compiled metadata. LLM and FiguresLLM calls
are effectful helpers; their outputs re-enter the app as scored answers,
messages, or cached figure artifacts.

## Run

Install and start the backend:

```bash
cd apps/active-reader-qmd/backend
npm install
cp .env.example .env
npm start
```

Install and start the frontend in another terminal:

```bash
cd apps/active-reader-qmd/frontend
npm install
cp .env.example .env
PORT=3002 npm start
```

Open `http://localhost:3002`.

Useful scripts:

```bash
cd apps/active-reader-qmd/backend && npm start   # Express API on port 3003
cd apps/active-reader-qmd/backend && npm run dev # same API with nodemon
cd apps/active-reader-qmd/frontend && npm start  # React dev server
cd apps/active-reader-qmd/frontend && npm run build
```

## Files & Toolchain

The app is JavaScript/React plus an Express backend. Dependencies are
development/install-time only and are regenerated with `npm install`; they are
not committed.

| File | Role |
|------|------|
| `apps/active-reader-qmd/backend/package.json` | Backend dependency and script manifest. |
| `apps/active-reader-qmd/backend/package-lock.json` | Pins backend dependency versions for reproducible installs. |
| `apps/active-reader-qmd/backend/.env.example` | Documents backend ports, content paths, API keys, and figure cache configuration. |
| `apps/active-reader-qmd/frontend/package.json` | Frontend dependency and script manifest. |
| `apps/active-reader-qmd/frontend/package-lock.json` | Pins frontend dependency versions for reproducible installs. |
| `apps/active-reader-qmd/frontend/.env.example` | Documents frontend backend URLs. |
| `.gitignore` | Keeps secrets, `node_modules`, builds, and local logs out of Git. |

## Pure vs. Effectful

The concept and learner-state logic are deterministic app logic: given the same
lesson metadata and recorded learner events, the roadmap and learner model can be
reconstructed. The effectful parts are isolated at the edges:

- Tutor/chat/scoring routes call external models only when `ANTHROPIC_API_KEY`
  or `OPENAI_API_KEY` is configured.
- Live new figure generation calls an external FiguresLLM backend through
  `REACT_APP_FIGURE_BACKEND`.
- Cached generated figures in `content/figure-results` work without a live
  FiguresLLM server.
- Student/session logs are local artifacts and ignored by Git.

## Current Scope

Included generated/gallery figures are the Imaging figures with score above 4.0:
`brdf`, `no_picture_on_a_wall_aina`, `pinhole_geometry2`, `pinhole_names2`,
`similar_triangles2`, and `spherePhongRoughness0.3`.

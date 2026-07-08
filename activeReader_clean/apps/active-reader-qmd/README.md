# ActiveReader QMD Runner

Cleaned ActiveReader demo for the Imaging QMD chapter, roadmap tutoring, learner-state tracking, and FiguresLLM figure loading.

## What This Includes

- QMD / VisionBook split-screen reader
- Imaging roadmap / chapter world map
- Tutor chat and answer scoring
- Learner state machine and per-concept learner model
- Figure gallery and figure selection for above-4.0 generated Imaging figures
- FiguresLLM integration through a backend URL

## Local Services

Default ports:

- Frontend: `http://localhost:3002`
- ActiveReader backend: `http://localhost:3003`
- FiguresLLM backend: `http://localhost:3004`

## Setup

Install backend dependencies:

```bash
cd backend
npm install
cp .env.example .env
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
cp .env.example .env
```

## Run

Start the ActiveReader backend:

```bash
cd backend
npm start
```

Start the frontend:

```bash
cd frontend
PORT=3002 npm start
```

Start FiguresLLM separately and expose it on `http://localhost:3004`.

If the QMD book content lives outside this folder, set:

```bash
ACTIVE_READER_CONTENT_ROOT=/path/to/qmd/content
```

By default, this clean folder reads QMD sources from `../../../content/visionbook-qmd`, lesson metadata from `../../../content/active-reader-demo`, chapter graphs from `../../../content/chapter_graphs`, and cached generated figures from `../../../content/figure-results`.

## Notes

Cached generated figures are served locally. Live new figure generation still calls an external FiguresLLM backend through `REACT_APP_FIGURE_BACKEND`.

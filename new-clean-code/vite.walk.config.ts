// TEMPORARY (delete after the run): the main config with HMR off, so a headless walk is not
// reloaded mid-session by an unrelated file save. Same dir as vite.config.ts on purpose —
// its aliases are built from `import.meta.dirname`.
import base from "./vite.config.js";

export default { ...base, root: base.root, server: { ...base.server, hmr: false as const } };

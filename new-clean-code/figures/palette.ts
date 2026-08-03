/**
 * The named colours live in `@lessonstudio/theme` (the theme owns colour, and a theme may re-map
 * these names per mode — see `theme/palette.ts`). Re-exported here so `palette` stays where figure
 * authors expect it: `import { palette } from "@lessonstudio/figures"`.
 */
export { palette, PALETTE_BY_HEX, STRUCTURAL_ROLES, type PaletteColor } from "@lessonstudio/theme";

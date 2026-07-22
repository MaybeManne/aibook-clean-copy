// SVG → PNG rasterization, behind an adapter so the pure frame plan never
// depends on a native library. The default uses @resvg/resvg-js (a prebuilt
// binary; `npm i @resvg/resvg-js`). If it is not installed the adapter throws a
// clear message — frame *planning* still works without it.

export interface Rasterizer {
  /** Render an SVG document string to PNG bytes. */
  svgToPng(svg: string): Promise<Uint8Array>;
}

export interface ResvgOptions {
  /** Fit width in px (height scales to viewBox aspect). Default: SVG's own size. */
  width?: number;
}

export function resvgRasterizer(opts: ResvgOptions = {}): Rasterizer {
  return {
    async svgToPng(svg: string): Promise<Uint8Array> {
      let mod: unknown;
      try {
        // Indirected specifier: loaded only when frames are exported; kept out of
        // static resolution so the pure plan builds without the native dep.
        const pkg = "@resvg/resvg-js";
        mod = await import(/* @vite-ignore */ pkg);
      } catch {
        throw new Error("render_video: @resvg/resvg-js is not installed. Run `npm i @resvg/resvg-js` to export frames.");
      }
      const { Resvg } = mod as { Resvg: new (svg: string, o?: unknown) => { render(): { asPng(): Uint8Array } } };
      const fit = opts.width ? { fitTo: { mode: "width", value: opts.width } } : undefined;
      return new Resvg(svg, fit).render().asPng();
    },
  };
}

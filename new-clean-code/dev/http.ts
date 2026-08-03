export interface DevReq {
  method?: string | undefined;
  /** Present on GET mounts that read query params; connect leaves the remainder here. */
  url?: string | undefined;
  on(event: "data", cb: (chunk: Buffer | string) => void): void;
  on(event: "end", cb: () => void): void;
  on(event: "error", cb: (e: unknown) => void): void;
}

export interface DevRes {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(body?: string): void;
}

export interface DevServerLike {
  middlewares: {
    use(path: string, handler: (req: DevReq, res: DevRes, next: () => void) => void): void;
  };
}

/** The plugin object a vite config accepts — the two members these endpoints use. */
export interface VitePluginLike {
  name: string;
  configureServer(server: DevServerLike): void;
}

export function readBody(req: DevReq): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += typeof chunk === "string" ? chunk : chunk.toString("utf8");
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

/** Query params from the remainder connect leaves on `req.url` after the mount prefix. */
export function query(req: DevReq): URLSearchParams {
  const i = (req.url ?? "").indexOf("?");
  return new URLSearchParams(i >= 0 ? (req.url ?? "").slice(i + 1) : "");
}

export function sendJson(res: DevRes, value: unknown, status = 200): void {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(value));
}

export function sendText(res: DevRes, text: string, status = 200): void {
  res.statusCode = status;
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.end(text);
}

/** What a POST handler answers with: the HTTP status, and the JSON body. */
export interface JsonReply {
  status: number;
  json: unknown;
}

/**
 * Mount `POST path` and answer with JSON. The handler takes the raw body and returns its own
 * status, so a transport failure and a refused request stay distinguishable. Non-POST falls
 * through to `next()` rather than 405, since these mounts share a dev server with the app.
 */
export function postJson(server: DevServerLike, path: string, handle: (raw: string) => Promise<JsonReply>): void {
  server.middlewares.use(path, (req, res, next) => {
    if (req.method !== "POST") return next();
    void (async () => {
      const out = await handle(await readBody(req));
      sendJson(res, out.json, out.status);
    })();
  });
}

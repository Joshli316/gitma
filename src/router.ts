type RouteHandler = (params: Record<string, string>) => void | Promise<void>;

interface Route {
  pattern: RegExp;
  keys: string[];
  handler: RouteHandler;
}

const routes: Route[] = [];

export function route(path: string, handler: RouteHandler): void {
  const keys: string[] = [];
  const pattern = new RegExp(
    "^" +
      path
        .replace(/:(\w+)/g, (_, key) => {
          keys.push(key);
          return "([^/]+)";
        })
        .replace(/\//g, "\\/") +
      "$"
  );
  routes.push({ pattern, keys, handler });
}

export function navigate(path: string): void {
  if (window.location.hash !== "#" + path) {
    window.location.hash = path;
  }
}

export function startRouter(): void {
  const handle = async () => {
    const hash = window.location.hash.slice(1) || "/";
    for (const r of routes) {
      const m = hash.match(r.pattern);
      if (m) {
        const params: Record<string, string> = {};
        r.keys.forEach((k, i) => (params[k] = m[i + 1]));
        try {
          await r.handler(params);
        } catch (e) {
          console.error(e);
        }
        // scroll-to-top on every nav (preserves anchor jumps)
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        return;
      }
    }
    navigate("/");
  };
  window.addEventListener("hashchange", handle);
  handle();
}

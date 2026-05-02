import { cpSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");

mkdirSync(dist, { recursive: true });

// Copy index.html
cpSync(join(root, "index.html"), join(dist, "index.html"));

// Copy public/ recursively
if (existsSync(join(root, "public"))) {
  cpSync(join(root, "public"), dist, { recursive: true });
}

// Copy src/content/*.json into dist/content/
mkdirSync(join(dist, "content"), { recursive: true });
cpSync(join(root, "src", "content"), join(dist, "content"), { recursive: true });

// Copy SPA fallback files
const headers = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; img-src 'self' data: blob:; media-src 'self'; connect-src 'self'; frame-src 'self' https://www.youtube-nocookie.com; object-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'

/assets/notebooklm/*
  Cache-Control: public, max-age=86400

/app.js
  Cache-Control: public, max-age=3600

/styles.css
  Cache-Control: public, max-age=3600
`;
import("node:fs").then(({ writeFileSync }) => {
  writeFileSync(join(dist, "_headers"), headers);
  writeFileSync(join(dist, "_redirects"), "/*    /index.html   200\n");
});

console.log("Assets copied to dist/");

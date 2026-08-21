/**
 * Prepares dist/ for GitHub *project* Pages, served under a sub-path
 * (e.g. https://<owner>.github.io/multiframework-recipes/).
 *
 * The @salesforce/vite-plugin-ui-bundle plugin hardcodes `base: "./"` for
 * production builds, so index.html ships relative asset URLs (./assets/...).
 * Relative URLs break the SPA 404 fallback: a deep link like
 * /multiframework-recipes/embedding/basic-embed served by 404.html would
 * resolve ./assets against /multiframework-recipes/embedding/ → 404.
 *
 * So we rewrite the asset URLs to be absolute under the Pages sub-path, then
 * copy index.html to 404.html so every deep link boots the SPA with working
 * assets and react-router resolves the route.
 */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = '/multiframework-recipes';
const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const indexPath = join(distDir, 'index.html');

let html = readFileSync(indexPath, 'utf8');
// ./assets/... (or /assets/...) -> /multiframework-recipes/assets/...
html = html.replace(/(src|href)="[^"]*\/assets\//g, `$1="${BASE}/assets/`);
// favicon.ico (relative) -> /multiframework-recipes/favicon.ico
html = html.replace(/(src|href)="(?:\.\/)?favicon\.ico"/g, `$1="${BASE}/favicon.ico"`);
writeFileSync(indexPath, html);

// SPA fallback for GitHub Pages (no server-side routing).
copyFileSync(indexPath, join(distDir, '404.html'));

console.log(`[pages] rewrote asset paths under ${BASE}/ and wrote 404.html`);

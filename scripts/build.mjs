// Custom build wrapper for open-slide:
//   1. Builds via @open-slide/core's vite config with a configurable `base`.
//   2. Injects a URL-rewriting shim so React Router (BrowserRouter without
//      basename) routes correctly when hosted under a sub-path on GitHub Pages.
//   3. Writes 404.html (= index.html) so SPA deep-links resolve.
import { build as viteBuild, mergeConfig } from 'vite';
import { createViteConfig } from '@open-slide/core/vite';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const rawBase = process.env.BASE || '/';
const base = rawBase.endsWith('/') ? rawBase : rawBase + '/';
const outDir = process.env.OUT_DIR || 'dist';

console.log(`Building with base="${base}" → ${outDir}/`);

const config = await createViteConfig({ userCwd: process.cwd(), mode: 'build' });
const merged = mergeConfig(config, {
  base,
  build: { outDir: path.resolve(process.cwd(), outDir) },
});
await viteBuild(merged);

const distDir = path.resolve(process.cwd(), outDir);
const indexPath = path.join(distDir, 'index.html');

// Inject sub-path → router shim into <head>. The shim strips the BASE prefix
// from the initial URL so BrowserRouter (which has no basename) can match the
// app's routes (`/`, `/s/:slideId`), then patches pushState/replaceState to
// re-add the prefix when the app navigates — so deep links stay shareable.
if (base !== '/') {
  const trimmed = base.replace(/\/$/, ''); // "/claritx-deck"
  const shim = `<script>(function(){var b=${JSON.stringify(trimmed)};var p=location.pathname;if(p===b||p===b+'/'){history.replaceState(null,'','/'+location.search+location.hash);}else if(p.indexOf(b+'/')===0){history.replaceState(null,'',p.slice(b.length)+location.search+location.hash);}['pushState','replaceState'].forEach(function(m){var o=history[m];history[m]=function(s,t,u){if(typeof u==='string'&&u.charAt(0)==='/'&&u.indexOf(b+'/')!==0&&u!==b){u=b+u;}return o.call(history,s,t,u);};});})();</script>`;
  let html = await fs.readFile(indexPath, 'utf8');
  html = html.replace('<head>', '<head>\n    ' + shim);
  await fs.writeFile(indexPath, html);
  console.log('✓ Injected sub-path router shim');
}

// GitHub Pages SPA fallback: 404.html === index.html lets any unknown sub-path
// bootstrap the React app, which then resolves the route client-side.
await fs.copyFile(indexPath, path.join(distDir, '404.html'));

// .nojekyll so GitHub Pages serves files starting with underscores too.
await fs.writeFile(path.join(distDir, '.nojekyll'), '');

console.log('✓ Build complete · 404.html + .nojekyll written for GitHub Pages');

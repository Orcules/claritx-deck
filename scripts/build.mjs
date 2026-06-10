// Custom build wrapper for open-slide:
//   1. Builds via @open-slide/core's vite config with a configurable `base`.
//   2. Injects `basename={import.meta.env.BASE_URL}` into the open-slide
//      <BrowserRouter> so React Router resolves routes correctly when the
//      app is hosted under a sub-path on GitHub Pages.
//   3. Writes 404.html (= index.html) so SPA deep-links resolve.
import { build as viteBuild, mergeConfig } from 'vite';
import { createViteConfig } from '@open-slide/core/vite';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const rawBase = process.env.BASE || '/';
const base = rawBase.endsWith('/') ? rawBase : rawBase + '/';
const outDir = process.env.OUT_DIR || 'dist';

console.log(`Building with base="${base}" → ${outDir}/`);

// Vite plugin that injects `basename` into open-slide's <BrowserRouter>.
// BrowserRouter without basename can't match routes under a sub-path; this
// makes the same build work at /, /claritx-deck/, or any other base.
const routerBasenamePlugin = {
  name: 'cx-router-basename',
  enforce: 'pre',
  transform(code, id) {
    if (!id.includes('@open-slide/core/src/app/app.tsx')) return null;
    if (!code.includes('<BrowserRouter>')) return null;
    return {
      code: code.replace(
        /<BrowserRouter>/g,
        "<BrowserRouter basename={import.meta.env.BASE_URL.replace(/\\/$/, '') || '/'}>"
      ),
      map: null,
    };
  },
};

const config = await createViteConfig({ userCwd: process.cwd(), mode: 'build' });
const merged = mergeConfig(config, {
  base,
  plugins: [routerBasenamePlugin],
  build: { outDir: path.resolve(process.cwd(), outDir) },
});
await viteBuild(merged);

const distDir = path.resolve(process.cwd(), outDir);
const indexPath = path.join(distDir, 'index.html');

// Static extras: open-slide's vite root is not the repo root, so the
// conventional public/ dir is not picked up automatically - copy it here.
// (Currently hosts /research/ - the RSI divergence research reports.)
const publicDir = path.resolve(process.cwd(), 'public');
try {
  await fs.cp(publicDir, distDir, { recursive: true });
  console.log('✓ Copied public/ static extras into dist');
} catch (err) {
  if (err.code !== 'ENOENT') throw err;
}

// GitHub Pages SPA fallback: 404.html = index.html lets any unknown sub-path
// bootstrap the React app, which then resolves the route client-side.
await fs.copyFile(indexPath, path.join(distDir, '404.html'));

// .nojekyll so GitHub Pages serves files starting with underscores too.
await fs.writeFile(path.join(distDir, '.nojekyll'), '');

console.log('✓ Build complete · 404.html + .nojekyll written for GitHub Pages');

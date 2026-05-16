// Custom build wrapper: uses open-slide's vite config, layers in a configurable
// `base` (for GitHub Pages sub-path hosting) and writes a 404.html fallback
// so SPA routes (`/s/claritx-pitch-v5?p=N`) resolve correctly when the user
// deep-links into a sub-path on a static host.
import { build as viteBuild, mergeConfig } from 'vite';
import { createViteConfig } from '@open-slide/core/vite';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const base = process.env.BASE || '/';
const outDir = process.env.OUT_DIR || 'dist';

console.log(`Building with base="${base}" → ${outDir}/`);

const config = await createViteConfig({ userCwd: process.cwd(), mode: 'build' });
const merged = mergeConfig(config, {
  base,
  build: { outDir: path.resolve(process.cwd(), outDir) },
});
await viteBuild(merged);

// GitHub Pages SPA fallback: serving 404.html === index.html lets any
// unknown sub-path bootstrap the React app, which then handles routing.
const distDir = path.resolve(process.cwd(), outDir);
await fs.copyFile(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));

// .nojekyll so GitHub Pages doesn't strip files starting with underscores.
await fs.writeFile(path.join(distDir, '.nojekyll'), '');

console.log('✓ Build complete · 404.html + .nojekyll written for GitHub Pages');

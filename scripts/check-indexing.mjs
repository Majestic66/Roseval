import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {protectPreview, shouldNoindex} from './indexing.mjs';

assert.equal(shouldNoindex({VERCEL_ENV: 'production'}), false);
assert.equal(shouldNoindex({}), false);
assert.equal(shouldNoindex({VERCEL_ENV: 'preview'}), true);
assert.equal(shouldNoindex({VERCEL_ENV: 'development'}), true);
assert.equal(shouldNoindex({ROSEVAL_NOINDEX: 'true'}), true);
const root = await fs.mkdtemp(path.join(os.tmpdir(), 'roseval-indexing-'));
try {
  await fs.cp('dist', root, {recursive: true});
  await protectPreview(root, {VERCEL_ENV: 'preview'});
  async function verify(dir) {
    for (const entry of await fs.readdir(dir, {withFileTypes: true})) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await verify(file);
      else if (entry.name.endsWith('.html')) {
        const html = await fs.readFile(file, 'utf8');
        assert(html.includes('<meta name="robots" content="noindex, follow">'), file);
        assert(!/<meta\s+name="robots"[^>]*content="index,/i.test(html), file);
      }
    }
  }
  await verify(root);
  const robots = await fs.readFile(path.join(root, 'robots.txt'), 'utf8');
  assert(robots.includes('Allow: /') && !robots.includes('Sitemap:'));
} finally { await fs.rm(root, {recursive: true, force: true}); }

const script = await fs.readFile('public/home-entry.js', 'utf8');
for (const [pathname, hash, expected] of [['/', '#contact', '/web#contact'], ['/', '#pricing', '/web#pricing'], ['/', '#services', '/web#services'], ['/', '#parcours', null], ['/web', '#contact', null]]) {
  let target = null;
  const listeners = {};
  vm.runInNewContext(script, {location: {pathname, hash, replace: url => {target = url;}}, window: {addEventListener: (event, cb) => {listeners[event] = cb;}}, document: {querySelector: () => null}});
  assert.equal(target, expected);
  target = null;
  listeners.hashchange();
  assert.equal(target, expected);
}
const home = await fs.readFile('dist/index.html', 'utf8');
for (const url of ['/mentions-legales', '/politique-confidentialite', '/politique-cookies', '/realisations', '/blog']) assert(home.includes('href="' + url + '"'));
assert(home.includes('/home-entry.js') && home.includes('data-cookie-settings'));
console.log('PASS : accueil accessible, anciens liens studio redirigés, production indexable et aperçus protégés.');

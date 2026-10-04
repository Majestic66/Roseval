import fs from 'node:fs/promises';
import path from 'node:path';

export function shouldNoindex(env = process.env) {
  return ['preview', 'development'].includes(env.VERCEL_ENV) || env.ROSEVAL_NOINDEX === 'true';
}

export async function protectPreview(root = 'dist', env = process.env) {
  if (!shouldNoindex(env)) return;
  async function walk(dir) {
    for (const entry of await fs.readdir(dir, {withFileTypes: true})) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (entry.name.endsWith('.html')) {
        let html = await fs.readFile(file, 'utf8');
        const meta = '<meta name="robots" content="noindex, follow">';
        html = /<meta\s+name="robots"[^>]*>/i.test(html)
          ? html.replace(/<meta\s+name="robots"[^>]*>/gi, meta)
          : html.replace('</head>', meta + '</head>');
        await fs.writeFile(file, html);
      }
    }
  }
  await walk(root);
  // Crawlers must be able to read noindex; do not disallow their access.
  await fs.writeFile(path.join(root, 'robots.txt'), 'User-agent: *\nAllow: /\n');
}

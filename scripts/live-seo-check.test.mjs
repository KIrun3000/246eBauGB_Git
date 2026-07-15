import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const canonicalOrigin = 'https://246ebaugb.de';

const page = (pathname, robots = 'index,follow') => `<!doctype html>
<html lang="de"><head>
<meta name="robots" content="${robots}">
<link rel="canonical" href="${canonicalOrigin}${pathname}">
</head><body></body></html>`;

async function runFixture(overrides = {}) {
  const responses = {
    '/robots.txt': `User-agent: *\nAllow: /\n\nSitemap: ${canonicalOrigin}/sitemap-index.xml\n`,
    '/sitemap-index.xml': `<?xml version="1.0"?><sitemapindex><sitemap><loc>${canonicalOrigin}/sitemap-0.xml</loc></sitemap></sitemapindex>`,
    '/sitemap-0.xml': `<?xml version="1.0"?><urlset><url><loc>${canonicalOrigin}/</loc></url></urlset>`,
    '/': page('/'),
    '/check/': page('/check/', 'noindex,follow'),
    ...overrides,
  };

  const server = http.createServer((request, response) => {
    const body = responses[request.url];
    if (body === undefined) {
      response.writeHead(404).end('not found');
      return;
    }
    response.writeHead(200, { 'content-type': request.url.endsWith('.xml') ? 'application/xml' : 'text/plain' });
    response.end(body);
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();

  try {
    return await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ['scripts/live-seo-check.mjs'], {
        cwd: projectRoot,
        env: { ...process.env, SITE_URL: `http://127.0.0.1:${address.port}` },
      });
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (chunk) => { stdout += chunk; });
      child.stderr.on('data', (chunk) => { stderr += chunk; });
      child.on('error', reject);
      child.on('close', (code) => resolve({ code, stdout, stderr }));
    });
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test('akzeptiert eine vollständige öffentliche SEO-Grundlage', async () => {
  const result = await runFixture();
  assert.equal(result.code, 0, result.stderr);
});

test('erkennt eine vollständig gesperrte Robots-Datei', async () => {
  const result = await runFixture({
    '/robots.txt': `User-agent: *\nDisallow: /\n\nSitemap: ${canonicalOrigin}/sitemap-index.xml\n`,
  });
  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /sperrt die gesamte Website/);
});

test('erkennt eine leere Sitemap', async () => {
  const result = await runFixture({
    '/sitemap-0.xml': '<?xml version="1.0"?><urlset></urlset>',
  });
  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /Sitemap enthält keine Seiten/);
});

test('erkennt eine fremde Teil-Sitemap', async () => {
  const result = await runFixture({
    '/sitemap-index.xml': '<?xml version="1.0"?><sitemapindex><sitemap><loc>https://example.com/sitemap-0.xml</loc></sitemap></sitemapindex>',
  });
  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /fremde Teil-Sitemap/);
});

test('erkennt eine Sitemap ohne Startseite', async () => {
  const result = await runFixture({
    '/sitemap-0.xml': `<?xml version="1.0"?><urlset><url><loc>${canonicalOrigin}/blog/</loc></url></urlset>`,
    '/blog/': page('/blog/'),
  });
  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /Startseite fehlt in der Sitemap/);
});

import process from 'node:process';

const siteUrl = new URL(process.env.SITE_URL ?? 'https://246ebaugb.de');
const expectedOrigin = 'https://246ebaugb.de';
const failures = [];

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': '246eBauGB-Livepruefung/1.0' },
    redirect: 'follow',
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  if (siteUrl.origin === expectedOrigin && new URL(response.url).origin !== expectedOrigin) {
    throw new Error(`${url}: Weiterleitung verlässt die Hauptdomain (${response.url}).`);
  }
  return { response, text: await response.text() };
}

try {
  const robotsUrl = new URL('/robots.txt', siteUrl);
  const robots = await fetchText(robotsUrl);
  if (!robots.text.includes('Sitemap: https://246ebaugb.de/sitemap-index.xml')) {
    failures.push('robots.txt enthält nicht die kanonische Sitemap-Adresse.');
  }
  if (/^\s*Disallow:\s*\/\s*$/mi.test(robots.text)) {
    failures.push('robots.txt sperrt die gesamte Website.');
  }

  const sitemapIndexUrl = new URL('/sitemap-index.xml', siteUrl);
  const sitemapIndex = await fetchText(sitemapIndexUrl);
  const childLocations = [...sitemapIndex.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (childLocations.length === 0) failures.push('Sitemap-Index enthält keine Teil-Sitemap.');

  const pageLocations = [];
  for (const canonicalChild of childLocations) {
    const canonicalUrl = new URL(canonicalChild);
    if (canonicalUrl.origin !== expectedOrigin) {
      failures.push(`Sitemap-Index enthält eine fremde Teil-Sitemap: ${canonicalChild}`);
    }
    const fetchedChild = await fetchText(new URL(canonicalUrl.pathname, siteUrl));
    pageLocations.push(...[...fetchedChild.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
  }

  if (pageLocations.length === 0) failures.push('Sitemap enthält keine Seiten.');
  if (new Set(pageLocations).size !== pageLocations.length) failures.push('Sitemap enthält doppelte Seitenadressen.');
  if (!pageLocations.some((location) => new URL(location).pathname === '/')) {
    failures.push('Startseite fehlt in der Sitemap.');
  }

  for (const canonicalPage of pageLocations) {
    const canonicalUrl = new URL(canonicalPage);
    if (canonicalUrl.origin !== expectedOrigin) failures.push(`Sitemap enthält eine fremde Herkunft: ${canonicalPage}`);
    try {
      const livePage = await fetchText(new URL(canonicalUrl.pathname, siteUrl));
      const xRobots = livePage.response.headers.get('x-robots-tag') ?? '';
      const metaRobots = livePage.text.match(/<meta\b[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i)?.[1] ?? '';
      const canonical = livePage.text.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] ?? '';
      if (/noindex/i.test(`${xRobots} ${metaRobots}`)) failures.push(`${canonicalUrl.pathname}: öffentlich indexierbare Seite ist noindex.`);
      if (canonical !== canonicalPage) failures.push(`${canonicalUrl.pathname}: Canonical ${canonical || 'fehlt'} passt nicht zur Sitemap.`);
    } catch (error) {
      failures.push(error.message);
    }
  }

  for (const excludedPath of ['/check/', '/404/', '/404.html']) {
    if (pageLocations.some((location) => new URL(location).pathname === excludedPath)) {
      failures.push(`${excludedPath}: nicht indexierbare Seite steht in der Sitemap.`);
    }
  }

  const checkPage = await fetchText(new URL('/check/', siteUrl));
  if (!/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(checkPage.text)) {
    failures.push('/check/: noindex fehlt im unfertigen Kartenwerkzeug.');
  }

  console.log(`Live-Prüfung: ${pageLocations.length} Sitemap-Seiten abgerufen.`);
} catch (error) {
  failures.push(error.message);
}

for (const failure of failures) console.error(`ERROR ${failure}`);
if (failures.length > 0) {
  console.error(`SEO-Liveprüfung fehlgeschlagen: ${failures.length} Befund(e).`);
  process.exit(1);
}

console.log('SEO-Liveprüfung erfolgreich: Domain, Robots, Sitemap, Canonicals und Indexierbarkeit stimmen überein.');

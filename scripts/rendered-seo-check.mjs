import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = path.join(projectRoot, 'dist');
const canonicalOrigin = 'https://246ebaugb.de';
const errors = [];
const warnings = [];
const indexedPages = [];

async function filesRecursively(directory, suffix) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? filesRecursively(absolute, suffix) : absolute;
  }));
  return nested.flat().filter((file) => file.endsWith(suffix));
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function attribute(html, tagName, attributeName, attributeValue, wanted) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) ?? [];
  const tag = tags.find((candidate) => new RegExp(`${attributeName}=["']${attributeValue}["']`, 'i').test(candidate));
  return tag?.match(new RegExp(`${wanted}=["']([^"']*)["']`, 'i'))?.[1]?.trim() ?? '';
}

function routeForHtml(file) {
  const relative = path.relative(distDirectory, file).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative}`;
}

function localTarget(urlPath) {
  const decoded = decodeURIComponent(urlPath);
  if (decoded === '/') return path.join(distDirectory, 'index.html');
  if (decoded.endsWith('/')) return path.join(distDirectory, decoded.slice(1), 'index.html');
  return path.join(distDirectory, decoded.slice(1));
}

function jsonLdEntries(html, relative) {
  const entries = [];
  const scripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const script of scripts) {
    try {
      entries.push(JSON.parse(script[1]));
    } catch (error) {
      errors.push(`${relative}: strukturierte Daten sind kein gültiges JSON (${error.message}).`);
    }
  }
  return entries;
}

const htmlFiles = await filesRecursively(distDirectory, '.html');

for (const file of htmlFiles) {
  const relative = path.relative(projectRoot, file);
  const route = routeForHtml(file);
  const html = await readFile(file, 'utf8');
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
  const description = attribute(html, 'meta', 'name', 'description', 'content');
  const robots = attribute(html, 'meta', 'name', 'robots', 'content').toLowerCase();
  const canonical = attribute(html, 'link', 'rel', 'canonical', 'href');
  const ogImage = attribute(html, 'meta', 'property', 'og:image', 'content');
  const h1Count = html.match(/<h1\b/gi)?.length ?? 0;
  const indexable = !robots.includes('noindex');
  const structuredData = jsonLdEntries(html, relative);

  if (!/<html\b[^>]*lang=["']de["']/i.test(html)) errors.push(`${relative}: Seitensprache de fehlt.`);
  if (!attribute(html, 'meta', 'name', 'viewport', 'content')) errors.push(`${relative}: Viewport-Angabe fehlt.`);
  if (!title) errors.push(`${relative}: <title> ist leer.`);
  if (!description) errors.push(`${relative}: Meta-Description ist leer.`);
  if (!robots) errors.push(`${relative}: robots-Angabe fehlt.`);
  if (!canonical) errors.push(`${relative}: Canonical fehlt.`);
  if (!ogImage) errors.push(`${relative}: Open-Graph-Bild fehlt.`);
  if (h1Count !== 1) errors.push(`${relative}: genau eine H1 erwartet, gefunden: ${h1Count}.`);

  if (canonical) {
    try {
      const canonicalUrl = new URL(canonical);
      if (canonicalUrl.origin !== canonicalOrigin) {
        errors.push(`${relative}: Canonical verweist auf eine fremde Herkunft (${canonicalUrl.origin}).`);
      }
      if (indexable && canonicalUrl.pathname !== route) {
        errors.push(`${relative}: Canonical-Pfad ${canonicalUrl.pathname} passt nicht zur Route ${route}.`);
      }
    } catch {
      errors.push(`${relative}: Canonical ist keine gültige absolute Adresse.`);
    }
  }

  if (ogImage) {
    try {
      const imageUrl = new URL(ogImage);
      if (imageUrl.origin !== canonicalOrigin) {
        errors.push(`${relative}: Open-Graph-Bild liegt nicht auf der Hauptdomain.`);
      } else if (!(await exists(localTarget(imageUrl.pathname)))) {
        errors.push(`${relative}: Open-Graph-Bild fehlt im Build (${imageUrl.pathname}).`);
      }
    } catch {
      errors.push(`${relative}: Open-Graph-Bild ist keine gültige absolute Adresse.`);
    }
  }

  for (const imageTag of html.match(/<img\b[^>]*>/gi) ?? []) {
    const src = imageTag.match(/\bsrc=["']([^"']+)["']/i)?.[1] ?? '';
    const alt = imageTag.match(/\balt=["']([^"']*)["']/i)?.[1];
    if (alt === undefined || alt.trim() === '') errors.push(`${relative}: Inhaltsbild ohne beschreibenden Alternativtext (${src || 'ohne Quelle'}).`);
    if (src.startsWith('/') && !(await exists(localTarget(new URL(src, canonicalOrigin).pathname)))) {
      errors.push(`${relative}: eingebundenes Bild fehlt im Build (${src}).`);
    }
  }

  for (const anchorTag of html.match(/<a\b[^>]*>/gi) ?? []) {
    const href = anchorTag.match(/\bhref=["']([^"']+)["']/i)?.[1] ?? '';
    if (!href || href.startsWith('#') || /^(?:mailto:|tel:|https?:\/\/)/i.test(href)) continue;
    const pathname = new URL(href, canonicalOrigin).pathname;
    if (!(await exists(localTarget(pathname)))) errors.push(`${relative}: interner Verweis führt ins Leere (${href}).`);
  }

  const isBlogArticle = route.startsWith('/blog/') && route !== '/blog/';
  if (isBlogArticle) {
    const posting = structuredData.find((entry) => entry?.['@type'] === 'BlogPosting');
    if (!posting) {
      errors.push(`${relative}: strukturierte Daten vom Typ BlogPosting fehlen.`);
    } else {
      if (!posting.publisher?.name || !posting.publisher?.url) errors.push(`${relative}: BlogPosting ohne Herausgeber.`);
      if (!posting.datePublished || !posting.dateModified) errors.push(`${relative}: BlogPosting ohne Veröffentlichungs-/Änderungsdatum.`);
      if (!Array.isArray(posting.image) || posting.image.length === 0) errors.push(`${relative}: BlogPosting ohne Bildvarianten.`);
    }
  }

  if (route === '/' && !structuredData.some((entry) => entry?.['@type'] === 'WebSite')) {
    errors.push(`${relative}: strukturierte WebSite-Daten fehlen auf der Startseite.`);
  }
  if (route === '/check/' && !robots.includes('noindex')) errors.push(`${relative}: unfertiges Kartenwerkzeug muss noindex sein.`);
  if ((route === '/404.html' || route === '/404/') && !robots.includes('noindex')) errors.push(`${relative}: Fehlerseite muss noindex sein.`);

  if (title.length > 70) warnings.push(`${relative}: Seitentitel hat ${title.length} Zeichen.`);
  if (description.length > 165) warnings.push(`${relative}: Meta-Description hat ${description.length} Zeichen.`);
  if (indexable) indexedPages.push({ route, title, description });
}

for (const field of ['title', 'description']) {
  const grouped = new Map();
  for (const page of indexedPages) {
    const value = page[field];
    grouped.set(value, [...(grouped.get(value) ?? []), page.route]);
  }
  for (const [value, routes] of grouped) {
    if (value && routes.length > 1) errors.push(`Doppelter ${field === 'title' ? 'Seitentitel' : 'Beschreibungstext'} auf ${routes.join(', ')}.`);
  }
}

const robotsPath = path.join(distDirectory, 'robots.txt');
if (!(await exists(robotsPath))) {
  errors.push('dist/robots.txt fehlt.');
} else {
  const robots = await readFile(robotsPath, 'utf8');
  if (!robots.includes('Sitemap: https://246ebaugb.de/sitemap-index.xml')) errors.push('robots.txt verweist nicht auf die kanonische Sitemap.');
  if (/^\s*Disallow:\s*\/\s*$/mi.test(robots)) errors.push('robots.txt sperrt die gesamte Website.');
}

const sitemapIndexPath = path.join(distDirectory, 'sitemap-index.xml');
const sitemapRoutes = new Set();
if (!(await exists(sitemapIndexPath))) {
  errors.push('dist/sitemap-index.xml fehlt.');
} else {
  const sitemapIndex = await readFile(sitemapIndexPath, 'utf8');
  const childLocations = [...sitemapIndex.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (childLocations.length === 0) errors.push('Sitemap-Index enthält keine Teil-Sitemap.');
  for (const location of childLocations) {
    const childUrl = new URL(location);
    if (childUrl.origin !== canonicalOrigin) errors.push(`Teil-Sitemap liegt nicht auf der Hauptdomain (${location}).`);
    const childPath = localTarget(childUrl.pathname);
    if (!(await exists(childPath))) {
      errors.push(`Teil-Sitemap fehlt im Build (${childUrl.pathname}).`);
      continue;
    }
    const child = await readFile(childPath, 'utf8');
    for (const pageLocation of [...child.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])) {
      const pageUrl = new URL(pageLocation);
      if (pageUrl.origin !== canonicalOrigin) errors.push(`Sitemap-Seite liegt nicht auf der Hauptdomain (${pageLocation}).`);
      if (!(await exists(localTarget(pageUrl.pathname)))) errors.push(`Sitemap-Seite fehlt im Build (${pageUrl.pathname}).`);
      sitemapRoutes.add(pageUrl.pathname);
    }
  }
}

for (const page of indexedPages) {
  if (!sitemapRoutes.has(page.route)) errors.push(`${page.route}: indexierbare Seite fehlt in der Sitemap.`);
}
for (const route of ['/check/', '/404/', '/404.html']) {
  if (sitemapRoutes.has(route)) errors.push(`${route}: nicht indexierbare Seite steht in der Sitemap.`);
}

for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);

if (errors.length > 0) {
  console.error(`Gerenderte SEO-Prüfung fehlgeschlagen: ${errors.length} Fehler.`);
  process.exit(1);
}

console.log(`Gerenderte SEO-Prüfung erfolgreich: ${htmlFiles.length} Seiten, ${indexedPages.length} indexierbar, ${warnings.length} Hinweise.`);

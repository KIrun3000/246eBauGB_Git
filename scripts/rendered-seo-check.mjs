import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = path.join(projectRoot, 'dist');
const errors = [];
const warnings = [];

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(absolute) : absolute;
  }));
  return nested.flat().filter((file) => file.endsWith('.html'));
}

function attribute(html, tagName, attributeName, attributeValue, wanted) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) ?? [];
  const tag = tags.find((candidate) => new RegExp(`${attributeName}=["']${attributeValue}["']`, 'i').test(candidate));
  return tag?.match(new RegExp(`${wanted}=["']([^"']*)["']`, 'i'))?.[1]?.trim() ?? '';
}

const isBlogArticle = (relative) =>
  relative.includes(`${path.sep}blog${path.sep}`) && !relative.endsWith(`${path.sep}blog${path.sep}index.html`);

for (const file of await htmlFiles(distDirectory)) {
  const relative = path.relative(projectRoot, file);
  const html = await readFile(file, 'utf8');
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
  const description = attribute(html, 'meta', 'name', 'description', 'content');
  const canonical = attribute(html, 'link', 'rel', 'canonical', 'href');
  const ogImage = attribute(html, 'meta', 'property', 'og:image', 'content');
  const h1Count = html.match(/<h1\b/gi)?.length ?? 0;

  if (!title) errors.push(`${relative}: <title> ist leer.`);
  if (!description) errors.push(`${relative}: Meta-Description ist leer.`);
  if (!canonical) errors.push(`${relative}: Canonical fehlt.`);
  if (h1Count !== 1) errors.push(`${relative}: genau eine H1 erwartet, gefunden: ${h1Count}.`);

  if (isBlogArticle(relative)) {
    if (!ogImage) errors.push(`${relative}: repräsentatives Open-Graph-Bild fehlt.`);
    if (!html.includes('"@type":"BlogPosting"')) {
      errors.push(`${relative}: strukturierte Daten vom Typ BlogPosting fehlen.`);
    }
  }

  if (title.length > 70) warnings.push(`${relative}: Seitentitel hat ${title.length} Zeichen.`);
  if (description.length > 165) warnings.push(`${relative}: Meta-Description hat ${description.length} Zeichen.`);
}

for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);

if (errors.length > 0) {
  console.error(`Gerenderte SEO-Prüfung fehlgeschlagen: ${errors.length} Fehler.`);
  process.exit(1);
}

console.log(`Gerenderte SEO-Prüfung erfolgreich: Titel, Description, Canonical und H1 geprüft (${warnings.length} Hinweise).`);

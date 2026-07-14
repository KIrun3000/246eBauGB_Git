import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const blogDirectory = path.join(projectRoot, 'src', 'content', 'blog');
const files = (await readdir(blogDirectory))
  .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
  .sort();

const errors = [];
const warnings = [];

for (const file of files) {
  const relativePath = path.join('src', 'content', 'blog', file);
  const content = await readFile(path.join(blogDirectory, file), 'utf8');
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!frontmatterMatch) {
    errors.push(`${relativePath}: Frontmatter fehlt oder ist nicht lesbar.`);
    continue;
  }

  const frontmatter = frontmatterMatch[1];
  const body = content.slice(frontmatterMatch[0].length);

  for (const key of ['title', 'description', 'pubDate', 'category', 'sources']) {
    if (!new RegExp(`^${key}:`, 'm').test(frontmatter)) {
      errors.push(`${relativePath}: Pflichtfeld "${key}" fehlt.`);
    }
  }

  const sourceUrls = [...frontmatter.matchAll(/^\s+url:\s*["']?([^\s"']+)/gm)].map(
    (match) => match[1],
  );

  if (sourceUrls.length < 2) {
    errors.push(`${relativePath}: Mindestens zwei Quellen-URLs sind erforderlich.`);
  }

  for (const sourceUrl of sourceUrls) {
    try {
      const parsed = new URL(sourceUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('unsupported protocol');
      }
    } catch {
      errors.push(`${relativePath}: Ungültige Quellen-URL: ${sourceUrl}`);
    }
  }

  const internalLinks = body.match(/(?:\]\(\/|href=["']\/)/g)?.length ?? 0;
  if (internalLinks < 2) {
    errors.push(`${relativePath}: Mindestens zwei interne Links sind erforderlich.`);
  }

  const faqStart = body.indexOf('## Häufige Fragen (FAQ)');
  if (faqStart === -1) {
    errors.push(`${relativePath}: Abschnitt "Häufige Fragen (FAQ)" fehlt.`);
  } else {
    const faqCount = body.slice(faqStart).match(/^###\s+/gm)?.length ?? 0;
    if (faqCount < 5 || faqCount > 8) {
      errors.push(`${relativePath}: Der FAQ-Abschnitt benötigt 5 bis 8 Fragen (gefunden: ${faqCount}).`);
    }
  }

  if (!/^updatedDate:/m.test(frontmatter)) {
    warnings.push(`${relativePath}: updatedDate fehlt; beim nächsten fachlichen Review ergänzen.`);
  }
}

for (const warning of warnings) {
  console.warn(`WARN ${warning}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`ERROR ${error}`);
  }
  console.error(`Content-Prüfung fehlgeschlagen: ${errors.length} Fehler.`);
  process.exit(1);
}

console.log(`Content-Prüfung erfolgreich: ${files.length} Blogartikel geprüft, ${warnings.length} Hinweise.`);

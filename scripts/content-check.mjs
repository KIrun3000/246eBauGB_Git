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

const currentLawSources = {
  '§ 246e': 'https://www.gesetze-im-internet.de/bbaug/__246e.html',
  '§ 36a': 'https://www.gesetze-im-internet.de/bbaug/__36a.html',
};

const readScalar = (frontmatter, key) => {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, 'm'));
  return match?.[1]?.replace(/["']$/, '').trim() ?? '';
};

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

  const title = readScalar(frontmatter, 'title');
  const description = readScalar(frontmatter, 'description');

  if (title.length < 35 || title.length > 70) {
    warnings.push(`${relativePath}: SEO-Titel hat ${title.length} Zeichen (Zielkorridor: 35–70).`);
  }

  if (description.length < 120 || description.length > 165) {
    warnings.push(
      `${relativePath}: Meta-Description hat ${description.length} Zeichen (Zielkorridor: 120–165).`,
    );
  }

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

  if (sourceUrls.some((url) => url.includes('gesetze-im-internet.de/baugb/'))) {
    errors.push(`${relativePath}: Veralteter/falscher BauGB-Pfad; erforderlich ist /bbaug/.`);
  }

  if (sourceUrls.some((url) => url.includes('gesetze-im-internet.de/uvpg_1990/'))) {
    errors.push(`${relativePath}: Veralteter/falscher UVPG-Pfad; erforderlich ist /uvpg/.`);
  }

  for (const [norm, officialUrl] of Object.entries(currentLawSources)) {
    if (content.includes(norm) && !sourceUrls.includes(officialUrl)) {
      errors.push(`${relativePath}: Aktuelle amtliche Quelle für ${norm} fehlt: ${officialUrl}`);
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

  const legalRiskPatterns = [
    [/eigenständiger Verwaltungsakt/i, 'Gemeindezustimmung nicht als eigenständigen Verwaltungsakt darstellen'],
    [/Antrag(?:stellung|sfrist)?[^\n]{0,45}(?:31\.12\.2030|31\. Dezember 2030)/i, '§ 246e Abs. 4 nicht auf eine bloße Antragstellung verkürzen'],
    [/(?:maximal|höchstens)\s*100\s*(?:m|Meter)|100\s*(?:m|Meter)[^\n]{0,25}(?:starre Voraussetzung|zwingende Voraussetzung)/i, '100-m-Angabe nur als Leitplanke der Gesetzesbegründung darstellen'],
    [/gute Chancen/i, 'keine Erfolgsprognose für einen rechtlichen Einzelfall geben'],
  ];

  for (const [pattern, message] of legalRiskPatterns) {
    if (pattern.test(body)) {
      warnings.push(`${relativePath}: Legal-Risiko: ${message}.`);
    }
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

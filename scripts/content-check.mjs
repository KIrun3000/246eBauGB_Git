import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { load as parseYaml } from 'js-yaml';
import { reviewAfterIssue } from './lib/content-rules.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const blogDirectory = path.join(projectRoot, 'src', 'content', 'blog');

async function contentFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const relative = prefix ? path.posix.join(prefix, entry.name) : entry.name;
    if (entry.isDirectory()) return contentFiles(path.join(directory, entry.name), relative);
    return /\.(?:md|mdx)$/.test(entry.name) ? [relative] : [];
  }));
  return nested.flat();
}

const files = (await contentFiles(blogDirectory)).sort();

const errors = [];
const warnings = [];

const currentLawSources = {
  '§ 246e': 'https://www.gesetze-im-internet.de/bbaug/__246e.html',
  '§ 36a': 'https://www.gesetze-im-internet.de/bbaug/__36a.html',
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
  let data;
  try {
    data = parseYaml(frontmatter);
  } catch (error) {
    errors.push(`${relativePath}: Frontmatter ist kein gültiges YAML (${error.message}).`);
    continue;
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    errors.push(`${relativePath}: Frontmatter ist kein YAML-Objekt.`);
    continue;
  }
  const body = content.slice(frontmatterMatch[0].length);

  const contentType = String(data.contentType ?? '');
  const requiredKeys = [
    'title',
    'description',
    'pubDate',
    'legalAsOf',
    'category',
    'contentType',
    'topic',
    'searchTask',
    'primaryIntent',
    'primaryQuery',
    'parentHub',
    'lifecycleStatus',
    'sources',
  ];
  if (contentType === 'ratgeber') requiredKeys.push('guideRole');
  for (const key of requiredKeys) {
    if (data[key] === undefined || data[key] === null || data[key] === '') {
      errors.push(`${relativePath}: Pflichtfeld "${key}" fehlt.`);
    }
  }

  const sources = Array.isArray(data.sources) ? data.sources : [];
  const sourceRecords = sources.map((source) => ({
    url: String(source?.url ?? ''),
    type: String(source?.type ?? ''),
  }));
  const sourceUrls = sourceRecords.map((source) => source.url).filter(Boolean);

  const title = String(data.title ?? '');
  const description = String(data.description ?? '');
  const intent = String(data.intent ?? '');
  const parentHub = String(data.parentHub ?? '');
  const reviewIssue = reviewAfterIssue(data);
  if (reviewIssue) errors.push(`${relativePath}: ${reviewIssue}`);

  if (!['owner', 'broker', 'builder', 'municipality'].includes(intent)) {
    errors.push(`${relativePath}: Zielgruppe muss owner, broker, builder oder municipality sein.`);
  }

  if (title.length < 35 || title.length > 70) {
    warnings.push(`${relativePath}: SEO-Titel hat ${title.length} Zeichen (Zielkorridor: 35–70).`);
  }

  if (description.length < 120 || description.length > 165) {
    warnings.push(
      `${relativePath}: Meta-Description hat ${description.length} Zeichen (Zielkorridor: 120–165).`,
    );
  }

  const minimumSources = contentType === 'ratgeber' ? 2 : 1;
  if (sourceUrls.length < minimumSources) {
    errors.push(`${relativePath}: Mindestens ${minimumSources} Quellen-URL${minimumSources === 1 ? '' : 's'} ${minimumSources === 1 ? 'ist' : 'sind'} erforderlich.`);
  }

  if (sourceRecords.some((source) => !source.url || !source.type)) {
    errors.push(`${relativePath}: Jede Quelle benötigt URL und Typ primary oder secondary.`);
  }

  for (const source of sourceRecords) {
    if (!['primary', 'secondary'].includes(source.type)) {
      errors.push(`${relativePath}: Unbekannter Quellentyp ${source.type}.`);
    }
    if (/(?:bmwsb\.bund\.de|mil\.brandenburg\.de)/.test(source.url) && source.type !== 'secondary') {
      errors.push(`${relativePath}: Amtliche FAQ und Verwaltungshinweise müssen als secondary gekennzeichnet sein (${source.url}).`);
    }
    if (/(?:gesetze-im-internet\.de|dserver\.bundestag\.de)/.test(source.url) && source.type !== 'primary') {
      errors.push(`${relativePath}: Gesetz und Gesetzesmaterial müssen als primary gekennzeichnet sein (${source.url}).`);
    }
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
  const minimumInternalLinks = contentType === 'ratgeber' ? 2 : 1;
  if (internalLinks < minimumInternalLinks) {
    errors.push(`${relativePath}: Mindestens ${minimumInternalLinks} interne Verknüpfung${minimumInternalLinks === 1 ? '' : 'en'} ${minimumInternalLinks === 1 ? 'ist' : 'sind'} erforderlich.`);
  }
  if (contentType !== 'ratgeber' && parentHub && !body.includes(`](${parentHub}`) && !body.includes(`href="${parentHub}`) && !body.includes(`href='${parentHub}`)) {
    errors.push(`${relativePath}: ${contentType} muss im Text auf parentHub ${parentHub} verweisen.`);
  }


  const faqStart = body.indexOf('## Häufige Fragen (FAQ)');
  if (contentType === 'ratgeber' && faqStart === -1) {
    errors.push(`${relativePath}: Abschnitt "Häufige Fragen (FAQ)" fehlt.`);
  } else if (contentType === 'ratgeber') {
    const faqCount = body.slice(faqStart).match(/^###\s+/gm)?.length ?? 0;
    if (faqCount < 5 || faqCount > 8) {
      errors.push(`${relativePath}: Der FAQ-Abschnitt benötigt 5 bis 8 Fragen (gefunden: ${faqCount}).`);
    }
  }

  if (contentType === 'ratgeber' && !data.updatedDate) {
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

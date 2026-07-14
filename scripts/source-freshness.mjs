import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(projectRoot, 'research', 'sources', 'legal-sources.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const failures = [];

function decodeEntities(value) {
  const named = {
    amp: '&', apos: "'", auml: 'ä', Auml: 'Ä', bdquo: '„', copy: '©',
    gt: '>', ldquo: '“', lt: '<', nbsp: ' ', ndash: '–', ouml: 'ö',
    Ouml: 'Ö', quot: '"', rdquo: '”', sect: '§', szlig: 'ß', uuml: 'ü', Uuml: 'Ü',
  };

  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number.parseInt(number, 10)))
    .replace(/&([a-z]+);/gi, (entity, name) => named[name] ?? entity);
}

function normalizedLegalText(buffer, source) {
  const html = new TextDecoder('windows-1252').decode(buffer);
  const startMarker = source.startMarker ?? '<div class="jnheader">';
  const endMarker = source.endMarker ?? '<div id="fusszeile">';
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start + startMarker.length);

  if (start === -1 || end === -1) {
    throw new Error('amtlicher Normtext konnte im HTML nicht abgegrenzt werden');
  }

  return decodeEntities(
    html
      .slice(start, end)
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function daysSince(dateString) {
  return Math.floor((Date.now() - Date.parse(`${dateString}T00:00:00Z`)) / 86_400_000);
}

await Promise.all(manifest.sources.map(async (source) => {
  try {
    const sourceFailures = [];
    const response = await fetch(source.url, {
      headers: { 'user-agent': '246eBauGB-content-freshness/1.0' },
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const text = source.hashMode === 'legal-text'
      ? normalizedLegalText(buffer, source)
      : decodeEntities(new TextDecoder('utf-8').decode(buffer)).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

    for (const marker of source.requiredMarkers ?? []) {
      if (!text.includes(marker)) {
        sourceFailures.push(`${source.id}: erwarteter Text fehlt: "${marker}"`);
      }
    }

    if (source.hashMode === 'legal-text') {
      const digest = createHash('sha256').update(text).digest('hex');
      if (digest !== source.sha256) {
        sourceFailures.push(`${source.id}: Normtext hat sich geändert (aktuell ${digest}, erwartet ${source.sha256}).`);
      }
    }

    const age = daysSince(source.lastReviewed);
    if (age > source.maxReviewAgeDays) {
      sourceFailures.push(`${source.id}: manuelles Review ist seit ${age} Tagen überfällig (Maximum ${source.maxReviewAgeDays}).`);
    }

    if (sourceFailures.length === 0) {
      console.log(`OK ${source.id}: erreichbar, Prüfstand ${source.lastReviewed}`);
    } else {
      failures.push(...sourceFailures);
    }
  } catch (error) {
    failures.push(`${source.id}: ${error.message}`);
  }
}));

for (const failure of failures) console.error(`ERROR ${failure}`);

if (failures.length > 0) {
  console.error(`Quellen-Frischeprüfung fehlgeschlagen: ${failures.length} Befund(e).`);
  process.exit(1);
}

console.log(`Quellen-Frischeprüfung erfolgreich: ${manifest.sources.length} amtliche Quellen geprüft.`);

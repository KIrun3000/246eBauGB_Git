import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(projectRoot, 'src');

const prohibitedTerms = [
  /\bGatekeepers?\b/gi,
  /\bframed\b/gi,
  /\bPillars?\b/g,
  /\bPillar[‑-](?:Artikel|Seiten|Pages?)\b/g,
  /\bKurz[‑-]Dossier\b/gi,
  /\b(?:Standort|Naturschutz)[‑-]?Screening\b/gi,
  /\bScreening nach\b/gi,
  /\bStop[‑-]Line\b/gi,
  /\bSchwellen[‑-]Claims?\b/gi,
  /\bGeo[‑-](?:Tool|Check)\b/gi,
  /\bGrundstücks[‑-]Check\b/gi,
  /\bChecklisten?\b/gi,
  /\bSelbst[‑-]Check\b/gi,
  /\bTracking[‑-]Tools?\b/gi,
];

const collectFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
    } else if (/\.(?:astro|md|mdx)$/.test(entry.name)) {
      files.push(entryPath);
    }
  }

  return files;
};

const errors = [];
const files = (await collectFiles(sourceRoot)).sort();

for (const file of files) {
  const content = await readFile(file, 'utf8');
  const relativePath = path.relative(projectRoot, file);

  for (const pattern of prohibitedTerms) {
    for (const match of content.matchAll(pattern)) {
      const line = content.slice(0, match.index).split('\n').length;
      errors.push(`${relativePath}:${line}: unnötiger englischer Begriff „${match[0]}“`);
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`ERROR ${error}`);
  }
  console.error(`Sprachprüfung fehlgeschlagen: ${errors.length} Treffer.`);
  process.exit(1);
}

console.log(`Sprachprüfung erfolgreich: ${files.length} Inhaltsdateien geprüft.`);

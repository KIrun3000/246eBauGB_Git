import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const notebookManifestPath = path.join(projectRoot, 'research', 'sources', 'notebooklm-notebooks.json');
const legalManifestPath = path.join(projectRoot, 'research', 'sources', 'legal-sources.json');
const notebookManifest = JSON.parse(await readFile(notebookManifestPath, 'utf8'));
const legalManifest = JSON.parse(await readFile(legalManifestPath, 'utf8'));

const candidates = [
  process.env.NLM_BIN,
  process.env.HOME && path.join(process.env.HOME, '.local', 'bin', 'nlm'),
  '/opt/homebrew/bin/nlm',
  'nlm',
].filter(Boolean);

async function findNlm() {
  for (const candidate of candidates) {
    if (candidate === 'nlm') return candidate;
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next known installation path.
    }
  }
  return 'nlm';
}

function runNlm(binary, args) {
  const result = spawnSync(binary, args, {
    cwd: projectRoot,
    encoding: 'utf8',
    env: { ...process.env, NOTEBOOKLM_HL: 'de' },
  });

  if (result.error) {
    throw new Error(`NotebookLM-CLI konnte nicht gestartet werden: ${result.error.message}`);
  }
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(`NotebookLM-Abfrage fehlgeschlagen${detail ? `: ${detail}` : '.'}`);
  }

  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error('NotebookLM-CLI lieferte kein lesbares JSON.');
  }
}

const failures = [];
const official = notebookManifest.officialReviewNotebook;
const legalById = new Map(legalManifest.sources.map((source) => [source.id, source]));

for (const source of official.sources) {
  if (!legalById.has(source.legalSourceId)) {
    failures.push(`Unbekannte amtliche Quellenkennung im Notebook-Manifest: ${source.legalSourceId}`);
  }
}

for (const legalSource of legalManifest.sources) {
  if (!official.sources.some((source) => source.legalSourceId === legalSource.id)) {
    failures.push(`Amtliche Projektquelle fehlt im Prüf-Notebook-Manifest: ${legalSource.id}`);
  }
}

if (failures.length === 0) {
  try {
    const nlm = await findNlm();
    const current = runNlm(nlm, [
      'notebook',
      'get',
      official.alias,
      '--profile',
      notebookManifest.profile,
      '--json',
    ]);

    if (current.notebook_id !== official.id) {
      failures.push(`Notebook-ID stimmt nicht: aktuell ${current.notebook_id}, erwartet ${official.id}`);
    }
    if (current.title !== official.title) {
      failures.push(`Notebook-Titel stimmt nicht: aktuell „${current.title}“, erwartet „${official.title}“`);
    }

    const currentById = new Map((current.sources ?? []).map((source) => [source.id, source]));
    const expectedIds = new Set(official.sources.map((source) => source.notebookSourceId));

    for (const expected of official.sources) {
      const actual = currentById.get(expected.notebookSourceId);
      if (!actual) {
        failures.push(`Quelle fehlt im amtlichen Prüf-Notebook: ${expected.legalSourceId}`);
      } else if (actual.title !== expected.expectedTitle) {
        failures.push(
          `Quellentitel geändert (${expected.legalSourceId}): aktuell „${actual.title}“, erwartet „${expected.expectedTitle}“`,
        );
      }
    }

    for (const actual of current.sources ?? []) {
      if (!expectedIds.has(actual.id)) {
        failures.push(`Nicht freigegebene Quelle im amtlichen Prüf-Notebook: „${actual.title}“ (${actual.id})`);
      }
    }
  } catch (error) {
    failures.push(error.message);
  }
}

for (const failure of failures) console.error(`ERROR ${failure}`);

if (failures.length > 0) {
  console.error(`NotebookLM-Quellenprüfung fehlgeschlagen: ${failures.length} Befund(e).`);
  process.exit(1);
}

console.log(
  `NotebookLM-Quellenprüfung erfolgreich: ${official.sources.length} amtliche Quellen im Notebook „${official.title}“ geprüft.`,
);

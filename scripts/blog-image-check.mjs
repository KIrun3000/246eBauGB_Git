import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const contentDir = path.join(projectRoot, 'src', 'content', 'blog');
const imageDir = path.join(projectRoot, 'public', 'images', 'blog');
const visualFile = path.join(projectRoot, 'src', 'lib', 'blogVisuals.ts');

const errors = [];
const labels = [
  'KI-generiertes Symbolbild',
  'Amtliche Darstellung',
  'Redaktionelle Grafik',
  'Fotografie',
];

const files = (await readdir(contentDir))
  .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
  .sort();
const articleIds = files.map((file) => file.replace(/\.mdx?$/, ''));
const visualSource = await readFile(visualFile, 'utf8');
const postBlock = visualSource.match(
  /const postVisuals: Record<string, BlogVisual> = \{([\s\S]*?)\n\};/,
)?.[1];

if (!postBlock) {
  throw new Error('Die beitragsspezifische Bildzuordnung konnte nicht gelesen werden.');
}

const escaped = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

for (const id of articleIds) {
  if (!new RegExp(`['"]${escaped(id)}['"]\\s*:`).test(postBlock)) {
    errors.push(`${id}: kein eigenes Beitragsbild zugeordnet.`);
  }
}

const imageAssignments = new Map();
const assignmentPattern = /'([^']+)':\s*makeVisual\(\s*'([^']+)',\s*'[^']*',\s*'([^']+)'(?:,\s*(\d+),\s*(\d+))?/g;

for (const match of postBlock.matchAll(assignmentPattern)) {
  imageAssignments.set(match[1], {
    fileName: match[2],
    caption: match[3],
    width: Number(match[4] ?? 1536),
    height: Number(match[5] ?? 1024),
  });
}

const parcelBlock = visualSource.match(/const parcelVisual: BlogVisual = \{([\s\S]*?)\n\};/)?.[1];
if (parcelBlock) {
  const fileName = parcelBlock.match(/src: '\/images\/blog\/([^']+)\.webp'/)?.[1];
  const caption = parcelBlock.match(/caption: '([^']+)'/)?.[1];
  const width = Number(parcelBlock.match(/width: (\d+)/)?.[1]);
  const height = Number(parcelBlock.match(/height: (\d+)/)?.[1]);
  if (fileName && caption) {
    for (const match of postBlock.matchAll(/'([^']+)':\s*parcelVisual/g)) {
      imageAssignments.set(match[1], { fileName, caption, width, height });
    }
  }
}

const readWebpSize = async (filePath) => {
  const buffer = await readFile(filePath);
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('kein gültiger WebP-Kopf');
  }

  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const chunk = buffer.toString('ascii', offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;

    if (chunk === 'VP8X') {
      const width = 1 + buffer[data + 4] + (buffer[data + 5] << 8) + (buffer[data + 6] << 16);
      const height = 1 + buffer[data + 7] + (buffer[data + 8] << 8) + (buffer[data + 9] << 16);
      return { width, height };
    }

    if (chunk === 'VP8 ' && buffer[data + 3] === 0x9d && buffer[data + 4] === 0x01 && buffer[data + 5] === 0x2a) {
      return {
        width: buffer.readUInt16LE(data + 6) & 0x3fff,
        height: buffer.readUInt16LE(data + 8) & 0x3fff,
      };
    }

    if (chunk === 'VP8L' && buffer[data] === 0x2f) {
      return {
        width: 1 + buffer[data + 1] + ((buffer[data + 2] & 0x3f) << 8),
        height: 1 + (buffer[data + 2] >> 6) + (buffer[data + 3] << 2) + ((buffer[data + 4] & 0x0f) << 10),
      };
    }

    offset = data + size + (size % 2);
  }

  throw new Error('Bildgröße konnte nicht gelesen werden');
};

for (const id of articleIds) {
  const visual = imageAssignments.get(id);
  if (!visual) {
    errors.push(`${id}: Bildzuordnung konnte nicht ausgewertet werden.`);
    continue;
  }

  if (!labels.some((label) => visual.caption.startsWith(label))) {
    errors.push(`${id}: Bildart fehlt in der Bildunterschrift.`);
  }

  if (visual.width !== 1536 || visual.height !== 864) {
    errors.push(`${id}: eingetragene Hauptgröße ist ${visual.width} × ${visual.height} statt 1536 × 864.`);
  }

  for (const [suffix, expected] of [
    ['', { width: 1536, height: 864 }],
    ['-768', { width: 768, height: 432 }],
  ]) {
    const filePath = path.join(imageDir, `${visual.fileName}${suffix}.webp`);
    try {
      const fileStat = await stat(filePath);
      if (fileStat.size === 0) throw new Error('Datei ist leer');
      const actual = await readWebpSize(filePath);
      if (actual.width !== expected.width || actual.height !== expected.height) {
        errors.push(`${id}: ${path.basename(filePath)} hat ${actual.width} × ${actual.height} statt ${expected.width} × ${expected.height}.`);
      }
    } catch (error) {
      errors.push(`${id}: ${path.basename(filePath)} fehlt oder ist ungültig (${error.message}).`);
    }
  }
}

if (errors.length > 0) {
  console.error('Bildprüfung fehlgeschlagen:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Bildprüfung erfolgreich: ${articleIds.length} Beiträge mit eigenem, gekennzeichnetem Bild und zwei Größen.`);
}

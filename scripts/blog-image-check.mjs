import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';
import { validateImageMetadata } from './lib/blog-image-rules.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const contentDir = path.join(projectRoot, 'src', 'content', 'blog');
const imageDir = path.join(projectRoot, 'public', 'images', 'blog');

const errors = [];
const seenFileNames = new Map();
let legacyExceptions = 0;

const files = (await readdir(contentDir))
  .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
  .sort();

const readFrontmatter = async (file) => {
  const source = await readFile(path.join(contentDir, file), 'utf8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error('kein gültiger Kopfbereich');
  return load(match[1]);
};

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
      return {
        width: 1 + buffer[data + 4] + (buffer[data + 5] << 8) + (buffer[data + 6] << 16),
        height: 1 + buffer[data + 7] + (buffer[data + 8] << 8) + (buffer[data + 9] << 16),
      };
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

for (const file of files) {
  const id = file.replace(/\.mdx?$/, '');
  let data;

  try {
    data = await readFrontmatter(file);
  } catch (error) {
    errors.push(`${id}: ${error.message}.`);
    continue;
  }

  const metadataErrors = validateImageMetadata({
    id,
    contentType: data?.contentType,
    image: data?.image,
    seenFileNames,
  });
  errors.push(...metadataErrors.map((error) => `${id}: ${error}`));

  if (!data?.image?.fileName) continue;
  if (data.image.provenanceStatus === 'bestand-unvollstaendig') legacyExceptions += 1;

  for (const [suffix, expected] of [
    ['', { width: 1536, height: 864 }],
    ['-768', { width: 768, height: 432 }],
  ]) {
    const filePath = path.join(imageDir, `${data.image.fileName}${suffix}.webp`);
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
  const legacyNote = legacyExceptions === 1
    ? ' Eine dokumentierte Bestandsausnahme bleibt bestehen.'
    : legacyExceptions > 1
      ? ` ${legacyExceptions} dokumentierte Bestandsausnahmen bleiben bestehen.`
      : '';
  console.log(`Bildprüfung erfolgreich: ${files.length} Beiträge mit eigener Zuordnung, Nachweis, Freigabe und zwei Größen.${legacyNote}`);
}

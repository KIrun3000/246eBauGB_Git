import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  applyOverlapDecisions,
  contentFiles,
  findOverlapWarnings,
  extractPageSignals,
  jaccard,
  overlapCoefficient,
  normalizeRoute,
  shingles,
  tokens,
  validateRecords,
  recordFromContent,
} from './content-overlap-check.mjs';

const baseRecord = {
  sourceFile: 'a.mdx',
  route: '/a/',
  title: 'Gemeindezustimmung verstehen',
  description: 'Der Rechtsrahmen der Zustimmung und die gesetzliche Frist.',
  contentType: 'ratgeber',
  guideRole: 'vertiefung',
  topic: 'gemeindezustimmung',
  searchTask: 'verstehen',
  primaryIntent: 'gemeindezustimmung-verstehen',
  primaryQuery: 'Rechtsrahmen der Gemeindezustimmung verstehen',
  intent: 'builder',
  region: 'Brandenburg',
  parentHub: '/zustimmung-gemeinde-246e/',
  lifecycleStatus: 'aktuell',
  headings: 'Prüfmaßstab Frist Rechtsschutz',
  body: 'Die Gemeinde prüft die städtebauliche Entwicklung und Ordnung.',
};

test('normalisiert Routen und ignoriert allgemeine Seitenbegriffe', () => {
  assert.equal(normalizeRoute('blog/beitrag'), '/blog/beitrag/');
  assert.deepEqual([...tokens('§ 246e BauGB in Brandenburg: aktueller Überblick')], []);
});

test('berechnet identische Mengen mit Jaccard 1', () => {
  assert.equal(jaccard('Gemeinde Zustimmung Frist', 'Frist Gemeinde Zustimmung'), 1);
  assert.equal(overlapCoefficient(shingles('eins zwei drei vier fünf sechs'), shingles('eins zwei drei vier fünf sechs')), 1);
});

test('liest Überschriften und Textsignale auch aus Grundlagenseiten', () => {
  const signals = extractPageSignals(`---\ntitle: "Test"\n---\nimport Box from './Box.astro';\n# Haupttitel\n\n## Rechtliche Bedeutung\n\nEigenständiger Inhalt.\n<style>{\`h1 { color: red; }\`}</style>`);
  assert.match(signals.headings, /Rechtliche Bedeutung/);
  assert.match(signals.body, /Eigenständiger Inhalt/);
  assert.doesNotMatch(signals.body, /color: red/);
});

test('findet auch verschachtelte Inhaltsdateien', async (context) => {
  const directory = await mkdtemp(path.join(tmpdir(), 'overlap-content-'));
  context.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(path.join(directory, 'gemeinden'));
  await writeFile(path.join(directory, 'gemeinden', 'beschluss.mdx'), '---\ntitle: Test\n---\n');
  await writeFile(path.join(directory, 'hinweis.txt'), 'kein Inhalt');
  assert.deepEqual(await contentFiles(directory), ['gemeinden/beschluss.mdx']);
});

test('blockiert eine doppelte Inhaltsabsicht', () => {
  const duplicate = { ...baseRecord, sourceFile: 'b.mdx', route: '/b/' };
  const errors = validateRecords([baseRecord, duplicate], new Set(['/zustimmung-gemeinde-246e/']));
  assert.ok(errors.some((error) => error.includes('Doppelte Inhaltsabsicht')));
});

test('entfernt YAML-Inline-Kommentare vor dem Vergleich', () => {
  const content = `---
title: "Beispieltitel"
description: "Eine ausreichend lange und eindeutige Beschreibung."
contentType: "ratgeber"
guideRole: "vertiefung"
topic: "gemeindezustimmung"
searchTask: "verstehen"
primaryIntent: "identische-absicht" # redaktioneller Hinweis
primaryQuery: "Welche Zustimmung benötigt die Gemeinde?" # Hauptfrage
intent: "builder"
region: "Brandenburg"
parentHub: "/zustimmung-gemeinde-246e/"
lifecycleStatus: "aktuell"
---
## Inhalt
`;
  const record = recordFromContent('beispiel.mdx', content);
  assert.equal(record.primaryIntent, 'identische-absicht');
  assert.equal(record.primaryQuery, 'Welche Zustimmung benötigt die Gemeinde?');
});

test('blockiert eine doppelte Ereigniskennung', () => {
  const first = {
    ...baseRecord,
    contentType: 'nachricht',
    guideRole: '',
    eventId: 'gemeinde-beschluss-2026-01',
  };
  const second = {
    ...first,
    sourceFile: 'b.mdx',
    route: '/b/',
    primaryIntent: 'beschluss-folgebericht',
    primaryQuery: 'Folgen des Gemeindebeschlusses einordnen',
  };
  const errors = validateRecords([first, second], new Set(['/zustimmung-gemeinde-246e/']));
  assert.ok(errors.some((error) => error.includes('Doppelte Ereigniskennung')));
});

test('blockiert eine zweite dauerhafte Projektakte', () => {
  const first = {
    ...baseRecord,
    contentType: 'projekt',
    guideRole: '',
    projectId: 'beispielgemeinde-wohnungsbau',
  };
  const second = {
    ...first,
    sourceFile: 'b.mdx',
    route: '/b/',
    primaryIntent: 'projekt-fortschritt-zweite-akte',
    primaryQuery: 'Fortschritt des Wohnungsbauprojekts nachvollziehen',
  };
  const errors = validateRecords([first, second], new Set(['/zustimmung-gemeinde-246e/']));
  assert.ok(errors.some((error) => error.includes('Doppeltes Projektprofil')));
});

test('meldet stark überlappende Seiten zur Prüfung', () => {
  const overlap = {
    ...baseRecord,
    sourceFile: 'b.mdx',
    route: '/b/',
    primaryIntent: 'gemeindezustimmung-rechtsrahmen',
    primaryQuery: 'Gemeindezustimmung Rechtsrahmen und Frist verstehen',
  };
  const warnings = findOverlapWarnings([baseRecord, overlap]);
  assert.equal(warnings.length, 1);
  assert.equal(warnings[0].severity, 'hoch');
});

test('lässt verschiedene Aufgaben innerhalb eines Themas zu', () => {
  const checklist = {
    ...baseRecord,
    sourceFile: 'b.mdx',
    route: '/b/',
    title: 'Unterlagen für die Gemeinde zusammenstellen',
    description: 'Kartenausschnitt, Vorhabenbeschreibung und Planunterlagen vorbereiten.',
    searchTask: 'vorbereiten',
    primaryIntent: 'gemeindezustimmung-unterlagen-vorbereiten',
    primaryQuery: 'Unterlagen für die Gemeindezustimmung vorbereiten',
    headings: 'Lageplan Vorentwurf Erschließung Unterlagenliste',
    body: 'Eine praktische Liste der benötigten Plan- und Lageunterlagen.',
  };
  assert.equal(findOverlapWarnings([baseRecord, checklist]).length, 0);
});

test('erkennt längere kopierte Textpassagen trotz verschiedener Titel', () => {
  const copiedPassage = 'Kartenausschnitt Referenzbereich Entfernung Trennwirkung Zufahrt Wasser Abwasser Strom Planunterlagen Fotodokumentation';
  const first = { ...baseRecord, body: `${copiedPassage} zusätzliche Erläuterung zum Rechtsrahmen` };
  const second = {
    ...baseRecord,
    sourceFile: 'b.mdx',
    route: '/b/',
    title: 'Anderer Seitentitel',
    description: 'Vollständig andere Beschreibung mit eigener Leseraufgabe.',
    topic: 'erschliessung',
    searchTask: 'vorbereiten',
    primaryIntent: 'andere-leseraufgabe',
    primaryQuery: 'Welche Unterlagen werden für die Erschließung benötigt?',
    headings: 'Andere Gliederung',
    body: `Ein anderer Einstieg ${copiedPassage} ein anderer Schluss`,
  };
  assert.equal(findOverlapWarnings([first, second]).length, 1);
});

test('akzeptiert nur begründete und nicht abgelaufene Überschneidungsentscheidungen', () => {
  const warning = { left: '/a/', right: '/b/', severity: 'hoch', fingerprint: 'abc123' };
  const decisions = [{
    routes: ['/b/', '/a/'],
    rationale: 'Die Seiten beantworten nachweisbar unterschiedliche Leseraufgaben.',
    reviewedAt: '2026-07-15',
    expiresAt: '2026-10-15',
    fingerprint: 'abc123',
  }];
  assert.equal(applyOverlapDecisions([warning], decisions, '2026-07-15')[0].acknowledged, true);
  assert.equal(applyOverlapDecisions([warning], decisions, '2026-11-01')[0].acknowledged, false);
  assert.equal(applyOverlapDecisions([warning], [{ ...decisions[0], reviewedAt: '2026-02-30' }], '2026-07-15')[0].acknowledged, false);
  assert.equal(applyOverlapDecisions([warning], [{ ...decisions[0], reviewedAt: '2026-07-16' }], '2026-07-15')[0].acknowledged, false);
  assert.equal(applyOverlapDecisions([warning], [{ ...decisions[0], fingerprint: 'alter-inhalt' }], '2026-07-15')[0].acknowledged, false);
});

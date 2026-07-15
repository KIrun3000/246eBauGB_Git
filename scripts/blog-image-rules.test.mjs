import test from 'node:test';
import assert from 'node:assert/strict';
import { validateImageMetadata } from './lib/blog-image-rules.mjs';

const validImage = {
  fileName: 'eigenes-beitragsbild',
  alt: 'Sachliche Beschreibung eines eindeutig erkennbaren Beitragsmotivs',
  caption: 'KI-generiertes Symbolbild · kein realer Standort',
  kind: 'ki-symbolbild',
  origin: 'intern-erzeugt',
  creator: 'Redaktion',
  rightsBasis: 'Projektinterne Nutzung',
  createdAt: new Date('2026-07-15'),
  provenanceStatus: 'vollstaendig',
  purpose: 'Das Motiv erklärt den konkreten Arbeitsgegenstand des Beitrags.',
  reviewStatus: 'geprueft',
  reviewedAt: new Date('2026-07-15'),
  reviewedBy: 'Redaktion',
  checks: {
    topicFit: true,
    mobileCrop: true,
    noMisleadingDetails: true,
    rightsVerified: true,
  },
};

test('akzeptiert einen vollständig dokumentierten Ratgeber', () => {
  assert.deepEqual(validateImageMetadata({
    id: 'ratgeber-a',
    contentType: 'ratgeber',
    image: validImage,
  }), []);
});

test('blockiert ein KI-Symbolbild für eine Nachricht', () => {
  const errors = validateImageMetadata({
    id: 'nachricht-a',
    contentType: 'nachricht',
    image: validImage,
  });
  assert.ok(errors.some((error) => error.includes('nur für allgemeine Ratgeber')));
});

test('blockiert ein doppelt verwendetes Beitragsmotiv', () => {
  const seenFileNames = new Map([['eigenes-beitragsbild', 'ratgeber-a']]);
  const errors = validateImageMetadata({
    id: 'ratgeber-b',
    contentType: 'ratgeber',
    image: validImage,
    seenFileNames,
  });
  assert.ok(errors.some((error) => error.includes('bereits von ratgeber-a')));
});

test('verlangt bei lizenzierten Bildern eine nachvollziehbare Quelle', () => {
  const errors = validateImageMetadata({
    id: 'ratgeber-foto',
    contentType: 'ratgeber',
    image: {
      ...validImage,
      kind: 'fotografie',
      origin: 'lizenziert',
      caption: 'Fotografie · beispielhafter Standort',
    },
  });
  assert.ok(errors.some((error) => error.includes('Quellenbezeichnung und Quellenadresse')));
});

test('lässt keine neue Ausnahme mit unvollständigem Bildnachweis zu', () => {
  const errors = validateImageMetadata({
    id: 'neuer-ratgeber',
    contentType: 'ratgeber',
    image: {
      ...validImage,
      createdAt: undefined,
      provenanceStatus: 'bestand-unvollstaendig',
      provenanceNote: 'Das ursprüngliche Datum ist nicht mehr vollständig feststellbar.',
    },
  });
  assert.ok(errors.some((error) => error.includes('nicht zulässig')));
});

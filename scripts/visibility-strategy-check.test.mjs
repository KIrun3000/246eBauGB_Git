import assert from 'node:assert/strict';
import test from 'node:test';

import { validateVisibilityData } from './visibility-strategy-check.mjs';

const fixture = () => ({
  model: {
    version: 1,
    updatedAt: '2026-07-19',
    audiences: [{ id: 'owner', label: 'Eigentümer' }],
    topicGroups: [{
      id: 'basis',
      label: 'Grundlagen',
      primaryAudience: 'owner',
      canonicalRoute: '/basis/',
      topics: ['basis'],
      patterns: ['246\\s*e'],
    }],
    aiQuestions: [{
      id: 'basisfrage',
      audience: 'owner',
      topicGroup: 'basis',
      question: 'Welche Voraussetzungen gelten für dieses Vorhaben?',
      targetRoute: '/basis/',
    }],
  },
  baseline: {
    version: 1,
    observedAt: '2026-07-19',
    nextReviewAt: '2026-08-19',
    sourceGroups: {
      official: { domains: ['amt.de'] },
      editorial: { domains: ['beispiel.de'] },
    },
    queries: [{
      query: '246e',
      targetRoute: '/basis/',
      officialSources: ['amt.de'],
      editorialCompetitors: ['beispiel.de'],
    }],
  },
  knownRoutes: new Set(['/', '/basis/']),
  contentTopics: new Set(['basis']),
  today: '2026-07-20',
});

test('accepts a complete visibility model', () => {
  assert.deepEqual(validateVisibilityData(fixture()), []);
});

test('rejects unknown targets and unassigned topics', () => {
  const input = fixture();
  input.model.aiQuestions[0].targetRoute = '/missing/';
  input.contentTopics.add('unassigned');
  const errors = validateVisibilityData(input);
  assert.ok(errors.some((error) => error.includes('unbekannte Zielseite')));
  assert.ok(errors.some((error) => error.includes('nicht zugeordnet')));
});

test('fails an overdue baseline only in strict age mode', () => {
  const input = fixture();
  input.today = '2026-09-01';
  assert.deepEqual(validateVisibilityData(input), []);
  const errors = validateVisibilityData({ ...input, strictAge: true });
  assert.ok(errors.some((error) => error.includes('überfällig')));
});

test('reports malformed calendar dates without throwing', () => {
  const input = fixture();
  input.baseline.observedAt = '2026-99-99';
  assert.ok(validateVisibilityData(input).some((error) => error.includes('observedAt')));
});

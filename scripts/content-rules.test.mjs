import assert from 'node:assert/strict';
import test from 'node:test';

import { requiresReviewAfter, reviewAfterIssue } from './lib/content-rules.mjs';

test('verlangt einen Prüftermin für laufende Inhaltsstände', () => {
  assert.equal(requiresReviewAfter({ contentType: 'nachricht', sourceStatus: 'amtliches-verfahren' }), true);
  assert.equal(requiresReviewAfter({ contentType: 'projekt', projectStatus: 'in-pruefung' }), true);
  assert.equal(requiresReviewAfter({ contentType: 'entscheidung', decisionStatus: 'offen' }), true);
  assert.match(
    reviewAfterIssue({ contentType: 'projekt', projectStatus: 'in-pruefung' }, '2026-07-15'),
    /benötigt reviewAfter/,
  );
});

test('meldet fällige und ungültige Prüftermine', () => {
  const base = { contentType: 'projekt', projectStatus: 'in-pruefung' };
  assert.match(reviewAfterIssue({ ...base, reviewAfter: '2026-07-15' }, '2026-07-15'), /ist fällig/);
  assert.match(reviewAfterIssue({ ...base, reviewAfter: '2026-02-30' }, '2026-07-15'), /kein gültiges Datum/);
});

test('akzeptiert einen zukünftigen Prüftermin', () => {
  const issue = reviewAfterIssue(
    { contentType: 'nachricht', sourceStatus: 'amtliches-verfahren', reviewAfter: '2026-08-15' },
    '2026-07-15',
  );
  assert.equal(issue, '');
});

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  analyticsPeriods,
  analyzeAnalytics,
  classifyAiSource,
  renderAnalyticsMarkdown,
} from './analytics-referral-report.mjs';

const row = (source, page, sessions, activeUsers = sessions) => ({
  dimensionValues: [{ value: source }, { value: page }],
  metricValues: [{ value: String(sessions) }, { value: String(activeUsers) }],
});

test('creates two consecutive 28-day analytics periods', () => {
  assert.deepEqual(analyticsPeriods(new Date('2026-07-19T18:00:00Z')), {
    current: { startDate: '2026-06-21', endDate: '2026-07-18' },
    previous: { startDate: '2026-05-24', endDate: '2026-06-20' },
  });
});

test('recognizes supported AI referral sources', () => {
  assert.equal(classifyAiSource('chatgpt.com'), 'ChatGPT');
  assert.equal(classifyAiSource('www.perplexity.ai'), 'Perplexity');
  assert.equal(classifyAiSource('google'), null);
});

test('aggregates AI referrals and suppresses small rows', () => {
  const analysis = analyzeAnalytics({ rows: [
    row('chatgpt.com', '/basis/', 2),
    row('chatgpt.com', '/aussenbereich/', 1),
    row('perplexity.ai', '/basis/', 1),
    row('google', '/', 100),
  ] });
  assert.equal(analysis.totals.sessions, 4);
  assert.deepEqual(analysis.sources.map((entry) => entry.source), ['ChatGPT']);
  assert.deepEqual(analysis.landingPages, []);
});

test('does not publish totals below the reporting threshold', () => {
  const analysis = analyzeAnalytics({ rows: [row('chatgpt.com', '/', 1)] });
  assert.equal(analysis.reportable, false);
  assert.equal(analysis.totals, null);
  const markdown = renderAnalyticsMarkdown({
    propertyId: '123',
    periods: analyticsPeriods(new Date('2026-07-19T18:00:00Z')),
    current: analysis,
    previous: analysis,
  });
  assert.match(markdown, /unter der Berichtsschwelle/);
  assert.doesNotMatch(markdown, /\*\*1 Sitzung/);
});

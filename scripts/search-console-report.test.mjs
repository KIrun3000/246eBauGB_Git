import assert from 'node:assert/strict';
import test from 'node:test';

import { analyzeSearchConsole, classifySearchQuery, renderMarkdown, reportPeriods } from './search-console-report.mjs';

const row = (keys, clicks, impressions, position, ctr = clicks / impressions) => ({
  keys,
  clicks,
  impressions,
  position,
  ctr,
});

test('creates two consecutive 28-day periods with a three-day delay', () => {
  assert.deepEqual(reportPeriods(new Date('2026-07-16T18:00:00Z')), {
    current: { startDate: '2026-06-16', endDate: '2026-07-13' },
    previous: { startDate: '2026-05-19', endDate: '2026-06-15' },
    observation: { startDate: '2026-04-15', endDate: '2026-07-13' },
  });
});

test('assigns specific topics before the broad §-246e group', () => {
  const classification = classifySearchQuery('Gemeindezustimmung bei 246e BauGB');
  assert.equal(classification.topicGroupId, 'gemeindezustimmung');
  assert.equal(classification.audienceId, 'builder');
});

test('keeps unrecognized searches visible for editorial review', () => {
  assert.equal(classifySearchQuery('ungeklärte sonderfrage').topicGroupId, 'nicht-zugeordnet');
});

test('finds optimization opportunities, declines and competing pages', () => {
  const analysis = analyzeSearchConsole({
    currentQueries: [row(['bau turbo'], 4, 100, 8), row(['246e'], 2, 30, 2)],
    previousQueries: [row(['bau turbo'], 9, 90, 7), row(['verschwundene anfrage'], 4, 40, 10)],
    currentPages: [row(['https://246ebaugb.de/'], 6, 130, 5)],
    queryPages: [
      row(['bau turbo', 'https://246ebaugb.de/a/'], 3, 60, 7),
      row(['bau turbo', 'https://246ebaugb.de/b/'], 1, 30, 9),
    ],
  });

  assert.equal(analysis.opportunities[0].query, 'bau turbo');
  assert.equal(analysis.declines[0].clickChange, -5);
  assert.equal(analysis.declines[1].query, 'verschwundene anfrage');
  assert.equal(analysis.overlaps[0].pages.length, 2);
  assert.equal(analysis.topicSummaries[0].id, 'grundlagen');
});

test('renders a readable report even without rows', () => {
  const markdown = renderMarkdown({
    siteUrl: 'sc-domain:246ebaugb.de',
    periods: reportPeriods(new Date('2026-07-16T18:00:00Z')),
    summaries: {
      current: { clicks: 0, impressions: 0, ctr: 0, position: 0 },
      previous: { clicks: 0, impressions: 0, ctr: 0, position: 0 },
    },
    analysis: { topQueries: [], topPages: [], opportunities: [], declines: [], overlaps: [] },
  });

  assert.match(markdown, /Search-Console-Wochenbericht/);
  assert.match(markdown, /Noch keine Suchanfragedaten vorhanden/);
});

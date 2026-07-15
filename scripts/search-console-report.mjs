import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API_BASE = 'https://www.googleapis.com/webmasters/v3/sites';
const DEFAULT_SITE_URL = 'sc-domain:246ebaugb.de';

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

export function reportPeriods(now = new Date()) {
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 3));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 27);
  const previousEnd = new Date(start);
  previousEnd.setUTCDate(previousEnd.getUTCDate() - 1);
  const previousStart = new Date(previousEnd);
  previousStart.setUTCDate(previousStart.getUTCDate() - 27);

  return {
    current: { startDate: isoDate(start), endDate: isoDate(end) },
    previous: { startDate: isoDate(previousStart), endDate: isoDate(previousEnd) },
  };
}

export async function querySearchConsole({ token, siteUrl, body, fetchImpl = fetch }) {
  const response = await fetchImpl(`${API_BASE}/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Search Console antwortet mit ${response.status}: ${detail.slice(0, 500)}`);
  }

  return response.json();
}

function normalizedRows(response) {
  return Array.isArray(response?.rows) ? response.rows : [];
}

function rowMetrics(row) {
  return {
    clicks: Number(row?.clicks || 0),
    impressions: Number(row?.impressions || 0),
    ctr: Number(row?.ctr || 0),
    position: Number(row?.position || 0),
  };
}

export function analyzeSearchConsole({ currentQueries = [], previousQueries = [], currentPages = [], queryPages = [] }) {
  const queries = currentQueries.map((row) => ({ query: row.keys?.[0] || '', ...rowMetrics(row) }));
  const pages = currentPages.map((row) => ({ page: row.keys?.[0] || '', ...rowMetrics(row) }));
  const currentByQuery = new Map(queries.map((row) => [row.query, row]));

  const opportunities = queries
    .filter((row) => row.impressions >= 10 && row.position >= 4 && row.position <= 20)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 15);

  const declines = previousQueries
    .map((row) => {
      const query = row.keys?.[0] || '';
      const previous = rowMetrics(row);
      const current = currentByQuery.get(query) || { query, clicks: 0, impressions: 0, ctr: 0, position: 0 };
      return { ...current, previousClicks: previous.clicks, clickChange: current.clicks - previous.clicks };
    })
    .filter((row) => row.previousClicks >= 3 && row.clickChange < 0)
    .sort((a, b) => a.clickChange - b.clickChange)
    .slice(0, 15);

  const pagesByQuery = new Map();
  for (const row of queryPages) {
    const query = row.keys?.[0] || '';
    const page = row.keys?.[1] || '';
    if (!query || !page) continue;
    const entries = pagesByQuery.get(query) || [];
    entries.push({ page, ...rowMetrics(row) });
    pagesByQuery.set(query, entries);
  }

  const overlaps = [];
  for (const [query, entries] of pagesByQuery) {
    const sorted = entries.sort((a, b) => b.impressions - a.impressions);
    const totalImpressions = sorted.reduce((sum, row) => sum + row.impressions, 0);
    const second = sorted[1];
    if (second && totalImpressions >= 20 && second.impressions >= Math.max(5, sorted[0].impressions * 0.2)) {
      overlaps.push({ query, totalImpressions, pages: sorted.slice(0, 4) });
    }
  }
  overlaps.sort((a, b) => b.totalImpressions - a.totalImpressions);

  return {
    topQueries: queries.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 25),
    topPages: pages.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 20),
    opportunities,
    declines,
    overlaps: overlaps.slice(0, 15),
  };
}

const integer = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function tableRows(rows, columns, emptyMessage) {
  if (!rows.length) return `_${emptyMessage}_\n`;
  return `${columns.headers}\n${columns.divider}\n${rows.map(columns.render).join('\n')}\n`;
}

export function renderMarkdown({ siteUrl, periods, summaries, analysis }) {
  const current = summaries.current;
  const previous = summaries.previous;
  const clicksChange = current.clicks - previous.clicks;
  const impressionsChange = current.impressions - previous.impressions;

  return `# Search-Console-Wochenbericht

**Stand:** ${periods.current.endDate}<br>
**Zeitraum:** ${periods.current.startDate} bis ${periods.current.endDate}<br>
**Vergleich:** ${periods.previous.startDate} bis ${periods.previous.endDate}<br>
**Property:** \`${siteUrl}\`

## Überblick

| Kennzahl | 28 Tage | Veränderung |
|---|---:|---:|
| Klicks | ${integer.format(current.clicks)} | ${clicksChange >= 0 ? '+' : ''}${integer.format(clicksChange)} |
| Impressionen | ${integer.format(current.impressions)} | ${impressionsChange >= 0 ? '+' : ''}${integer.format(impressionsChange)} |
| Klickrate | ${decimal.format(current.ctr * 100)} % | ${decimal.format((current.ctr - previous.ctr) * 100)} Punkte |
| Durchschnittliche Position | ${decimal.format(current.position)} | ${decimal.format(current.position - previous.position)} |

## Chancen

${tableRows(analysis.opportunities, {
  headers: '| Suchanfrage | Impressionen | Klicks | Position |',
  divider: '|---|---:|---:|---:|',
  render: (row) => `| ${row.query} | ${integer.format(row.impressions)} | ${integer.format(row.clicks)} | ${decimal.format(row.position)} |`,
}, 'Keine Suchanfrage erfüllt derzeit die Mindestwerte für eine konkrete Optimierungschance.')}

## Mögliche Überschneidungen

${analysis.overlaps.length
    ? analysis.overlaps.map((entry) => `- **${entry.query}** (${integer.format(entry.totalImpressions)} Impressionen): ${entry.pages.map((page) => `${page.page} (${integer.format(page.impressions)})`).join(', ')}`).join('\n')
    : '_Keine auffällige Verteilung derselben Suchanfrage auf mehrere Seiten gefunden._'}

## Rückgänge

${tableRows(analysis.declines, {
  headers: '| Suchanfrage | Klicks | vorher | Veränderung |',
  divider: '|---|---:|---:|---:|',
  render: (row) => `| ${row.query} | ${integer.format(row.clicks)} | ${integer.format(row.previousClicks)} | ${integer.format(row.clickChange)} |`,
}, 'Keine belastbaren Klickverluste gegenüber dem vorherigen Zeitraum gefunden.')}

## Häufigste Suchanfragen

${tableRows(analysis.topQueries.slice(0, 15), {
  headers: '| Suchanfrage | Klicks | Impressionen | Klickrate | Position |',
  divider: '|---|---:|---:|---:|---:|',
  render: (row) => `| ${row.query} | ${integer.format(row.clicks)} | ${integer.format(row.impressions)} | ${decimal.format(row.ctr * 100)} % | ${decimal.format(row.position)} |`,
}, 'Noch keine Suchanfragedaten vorhanden.')}

## Häufigste Zielseiten

${tableRows(analysis.topPages.slice(0, 12), {
  headers: '| Zielseite | Klicks | Impressionen | Klickrate | Position |',
  divider: '|---|---:|---:|---:|---:|',
  render: (row) => `| ${row.page} | ${integer.format(row.clicks)} | ${integer.format(row.impressions)} | ${decimal.format(row.ctr * 100)} % | ${decimal.format(row.position)} |`,
}, 'Noch keine Zielseitendaten vorhanden.')}

> Dieser Bericht erzeugt nur Hinweise. Inhalte, Hauptadressen und Weiterleitungen werden niemals automatisch geändert.
`;
}

async function main() {
  const token = process.env.GSC_ACCESS_TOKEN;
  if (!token) throw new Error('GSC_ACCESS_TOKEN fehlt. Der Bericht benötigt einen kurzlebigen Google-Zugang.');

  const siteUrl = process.env.GSC_SITE_URL || DEFAULT_SITE_URL;
  const outputDirectory = process.env.GSC_REPORT_DIR || 'artifacts/search-console';
  const periods = reportPeriods();
  const request = (period, dimensions = []) => querySearchConsole({
    token,
    siteUrl,
    body: { ...period, dimensions, rowLimit: 25_000, dataState: 'final' },
  });

  const [currentSummary, previousSummary, currentQueries, previousQueries, currentPages, queryPages] = await Promise.all([
    request(periods.current),
    request(periods.previous),
    request(periods.current, ['query']),
    request(periods.previous, ['query']),
    request(periods.current, ['page']),
    request(periods.current, ['query', 'page']),
  ]);

  const summaries = {
    current: rowMetrics(normalizedRows(currentSummary)[0]),
    previous: rowMetrics(normalizedRows(previousSummary)[0]),
  };
  const analysis = analyzeSearchConsole({
    currentQueries: normalizedRows(currentQueries),
    previousQueries: normalizedRows(previousQueries),
    currentPages: normalizedRows(currentPages),
    queryPages: normalizedRows(queryPages),
  });
  const report = { generatedAt: new Date().toISOString(), siteUrl, periods, summaries, analysis };

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(path.join(outputDirectory, 'report.md'), renderMarkdown(report));
  console.log(`Search-Console-Bericht erstellt: ${path.resolve(outputDirectory)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

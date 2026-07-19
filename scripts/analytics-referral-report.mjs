import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const API_BASE = 'https://analyticsdata.googleapis.com/v1beta';
const DEFAULT_PROPERTY_ID = '545814927';
const MINIMUM_REPORTING_COUNT = 3;

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

export function analyticsPeriods(now = new Date()) {
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
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

export async function queryAnalytics({ token, propertyId, period, fetchImpl = fetch }) {
  const response = await fetchImpl(`${API_BASE}/properties/${propertyId}:runReport`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      dateRanges: [period],
      dimensions: [{ name: 'sessionSource' }, { name: 'landingPagePlusQueryString' }],
      metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
      limit: 10000,
    }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Google Analytics antwortet mit ${response.status}: ${detail.slice(0, 500)}`);
  }
  return response.json();
}

const sourceRules = [
  ['ChatGPT', /(^|\.)chatgpt\.com$/i],
  ['Perplexity', /(^|\.)perplexity\.ai$/i],
  ['Microsoft Copilot', /(^|\.)copilot\.microsoft\.com$/i],
  ['Google Gemini', /(^|\.)gemini\.google\.com$/i],
  ['Claude', /(^|\.)claude\.ai$/i],
];

export function classifyAiSource(source) {
  return sourceRules.find(([, pattern]) => pattern.test(String(source ?? '').trim()))?.[0] ?? null;
}

function metric(row, index) {
  return Number(row?.metricValues?.[index]?.value ?? 0);
}

export function analyzeAnalytics(response, minimum = MINIMUM_REPORTING_COUNT) {
  const sourceMap = new Map();
  const landingRows = [];
  let totalSessions = 0;
  let totalActiveUsers = 0;

  for (const row of response?.rows ?? []) {
    const source = classifyAiSource(row.dimensionValues?.[0]?.value);
    if (!source) continue;
    const landingPage = row.dimensionValues?.[1]?.value || '/';
    const sessions = metric(row, 0);
    const activeUsers = metric(row, 1);
    totalSessions += sessions;
    totalActiveUsers += activeUsers;
    const aggregate = sourceMap.get(source) ?? { source, sessions: 0, activeUsers: 0 };
    aggregate.sessions += sessions;
    aggregate.activeUsers += activeUsers;
    sourceMap.set(source, aggregate);
    if (sessions >= minimum) landingRows.push({ source, landingPage, sessions, activeUsers });
  }

  const reportable = totalSessions >= minimum;
  return {
    minimum,
    reportable,
    totals: reportable ? { sessions: totalSessions, activeUsers: totalActiveUsers } : null,
    sources: [...sourceMap.values()].filter((row) => row.sessions >= minimum).sort((a, b) => b.sessions - a.sessions),
    landingPages: landingRows.sort((a, b) => b.sessions - a.sessions).slice(0, 20),
  };
}

const integer = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });

export function renderAnalyticsMarkdown({ propertyId, periods, current, previous }) {
  const summary = current.reportable
    ? `In den vergangenen 28 Tagen wurden **${integer.format(current.totals.sessions)} Sitzungen** aus erkennbaren KI-Antwortsystemen gemessen.`
    : `In den vergangenen 28 Tagen lag die Zahl erkennbarer Sitzungen aus KI-Antwortsystemen unter der Berichtsschwelle von ${current.minimum}.`;
  const comparison = current.reportable && previous.reportable
    ? ` Gegenüber dem vorherigen Zeitraum beträgt die Veränderung ${current.totals.sessions - previous.totals.sessions >= 0 ? '+' : ''}${integer.format(current.totals.sessions - previous.totals.sessions)} Sitzungen.`
    : '';
  const sources = current.sources.length
    ? `| Herkunft | Sitzungen | aktive Nutzer |\n|---|---:|---:|\n${current.sources.map((row) => `| ${row.source} | ${integer.format(row.sessions)} | ${integer.format(row.activeUsers)} |`).join('\n')}`
    : '_Keine einzelne Herkunft erreicht die Berichtsschwelle._';
  const landings = current.landingPages.length
    ? `| Herkunft | Zielseite | Sitzungen |\n|---|---|---:|\n${current.landingPages.map((row) => `| ${row.source} | ${row.landingPage} | ${integer.format(row.sessions)} |`).join('\n')}`
    : '_Keine einzelne Kombination aus Herkunft und Zielseite erreicht die Berichtsschwelle._';

  return `# KI-Verweisbericht aus Google Analytics

**Stand:** ${periods.current.endDate}<br>
**Zeitraum:** ${periods.current.startDate} bis ${periods.current.endDate}<br>
**Vergleich:** ${periods.previous.startDate} bis ${periods.previous.endDate}<br>
**Property:** \`${propertyId}\`

## Überblick

${summary}${comparison}

Erfasst werden nur Besuche, die nach einer Einwilligung gemessen und deren Herkunft als ChatGPT, Perplexity, Microsoft Copilot, Google Gemini oder Claude erkannt wurde. Die Auswertung misst Verweise, nicht bloße Nennungen ohne Besuch.

## Erkennbare Herkunft

${sources}

## Zielseiten

${landings}

> Zum Schutz sehr kleiner Fallzahlen zeigt der öffentliche Bericht nur Werte ab ${current.minimum}. Inhalte und Seiten werden durch diesen Bericht niemals automatisch geändert.
`;
}

async function main() {
  const token = process.env.ANALYTICS_ACCESS_TOKEN;
  if (!token) throw new Error('ANALYTICS_ACCESS_TOKEN fehlt. Der Bericht benötigt einen kurzlebigen Google-Zugang.');
  const propertyId = process.env.ANALYTICS_PROPERTY_ID || DEFAULT_PROPERTY_ID;
  const outputDirectory = process.env.ANALYTICS_REPORT_DIR || 'artifacts/analytics-referrals';
  const periods = analyticsPeriods();
  const [currentResponse, previousResponse] = await Promise.all([
    queryAnalytics({ token, propertyId, period: periods.current }),
    queryAnalytics({ token, propertyId, period: periods.previous }),
  ]);
  const report = {
    generatedAt: new Date().toISOString(),
    propertyId,
    periods,
    current: analyzeAnalytics(currentResponse),
    previous: analyzeAnalytics(previousResponse),
  };
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(path.join(outputDirectory, 'report.md'), renderAnalyticsMarkdown(report));
  console.log(`KI-Verweisbericht erstellt: ${path.resolve(outputDirectory)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

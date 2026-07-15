import { access, readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { load as parseYaml } from 'js-yaml';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requiredFields = [
  'title',
  'description',
  'contentType',
  'topic',
  'searchTask',
  'primaryIntent',
  'primaryQuery',
  'intent',
  'region',
  'parentHub',
  'lifecycleStatus',
];
const optionalStrategyFields = [
  'guideRole',
  'eventId',
  'eventDate',
  'newsKind',
  'jurisdiction',
  'sourceStatus',
  'reviewAfter',
  'projectId',
  'municipality',
  'projectType',
  'projectStatus',
  'decisionDate',
  'decisionStatus',
  'decisionLevel',
  'decisionAuthority',
  'decisionReference',
  'decisionReasonSummary',
];

const ignoredWords = new Set([
  '246e', 'baugb', 'brandenburg', 'paragraf', 'artikel', 'beitrag', 'ratgeber',
  'aktuell', 'aktuelle', 'aktueller', 'faq', 'fragen', 'haeufige', 'haufige',
  'ueberblick', 'uberblick', 'pruefen', 'prufen', 'pruefung', 'prufung',
  'vorpruefen', 'vorprufen', 'schritt', 'schritte', 'und', 'oder', 'der',
  'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einer', 'eines', 'einem', 'einen',
  'bei', 'im', 'in', 'am', 'an', 'auf', 'aus', 'fuer', 'fur', 'mit', 'nach', 'von', 'vor',
  'was', 'wie', 'wann', 'welche', 'welcher', 'welches', 'zu', 'zur', 'zum', 'ist',
  'sind', 'bleibt', 'koennen', 'konnen', 'kann', 'ihre', 'ihr', 'sie', 'sich', 'auch', 'mehr',
]);

export function normalizeRoute(route) {
  if (route === '/') return route;
  return `/${route.replace(/^\/+|\/+$/g, '')}/`;
}

export function normalizedWords(text) {
  return String(text ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/§/g, ' paragraf ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 1 && !ignoredWords.has(word));
}

export function tokens(text) {
  return new Set(normalizedWords(text));
}

export function jaccard(left, right) {
  const a = left instanceof Set ? left : tokens(left);
  const b = right instanceof Set ? right : tokens(right);
  if (a.size === 0 || b.size === 0) return 0;
  const intersection = [...a].filter((value) => b.has(value)).length;
  return intersection / (a.size + b.size - intersection);
}

export function shingles(text, size = 5) {
  const words = normalizedWords(text);
  const values = new Set();
  for (let index = 0; index <= words.length - size; index += 1) {
    values.add(words.slice(index, index + size).join(' '));
  }
  return values;
}

export function overlapCoefficient(left, right) {
  if (left.size === 0 || right.size === 0) return 0;
  const intersection = [...left].filter((value) => right.has(value)).length;
  return intersection / Math.min(left.size, right.size);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function pairFingerprint(left, right) {
  return sha256(
    [left, right]
      .sort((a, b) => normalizeRoute(a.route).localeCompare(normalizeRoute(b.route)))
      .map((record) => JSON.stringify({
        route: normalizeRoute(record.route),
        title: record.title,
        description: record.description,
        contentType: record.contentType,
        topic: record.topic,
        searchTask: record.searchTask,
        primaryIntent: record.primaryIntent,
        primaryQuery: record.primaryQuery,
        intent: record.intent,
        region: record.region,
        parentHub: record.parentHub,
        lifecycleStatus: record.lifecycleStatus,
        headings: record.headings,
        body: record.body,
      }))
      .join('\n'),
  );
}

function scalarValue(data, key) {
  const value = data?.[key];
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

function visibleText(body) {
  return body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/g, ' ')
    .replace(/export const (?:primarySources|secondarySources) = \[[\s\S]*?\n\];/g, ' ')
    .replace(/^import\s.+$/gm, ' ')
    .replace(/^export\s.+$/gm, ' ');
}

export function extractPageSignals(content) {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const body = visibleText(frontmatterMatch ? content.slice(frontmatterMatch[0].length) : content);
  return {
    headings: [...body.matchAll(/^#{1,3}\s+(.+)$/gm)].map((match) => match[1]).join(' '),
    body,
  };
}

export function recordFromContent(file, content) {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) throw new Error(`${file}: Frontmatter fehlt.`);
  const data = parseYaml(frontmatterMatch[1]);
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`${file}: Frontmatter ist kein YAML-Objekt.`);
  }
  const { body, headings } = extractPageSignals(content);
  const record = Object.fromEntries(
    [...requiredFields, ...optionalStrategyFields].map((field) => [field, scalarValue(data, field)]),
  );
  return {
    ...record,
    route: normalizeRoute(`/blog/${file.replace(/\.(?:md|mdx)$/, '')}`),
    sourceFile: path.posix.join('src/content/blog', file),
    headings,
    body,
  };
}

export function validateRecords(records, hubRoutes = new Set()) {
  const errors = [];
  const routes = new Map();
  const primaryIntents = new Map();
  const primaryQueries = new Map();
  const topicHubs = new Map();
  const eventIds = new Map();
  const projectProfiles = new Map();
  const decisions = new Map();

  for (const record of records) {
    for (const field of requiredFields) {
      if (!record[field]) errors.push(`${record.sourceFile}: Pflichtfeld ${field} fehlt.`);
    }

    const route = normalizeRoute(record.route);
    if (routes.has(route)) errors.push(`Route ${route} ist doppelt: ${routes.get(route)} und ${record.sourceFile}.`);
    routes.set(route, record.sourceFile);

    if (primaryIntents.has(record.primaryIntent)) {
      errors.push(`Doppelte Inhaltsabsicht ${record.primaryIntent}: ${primaryIntents.get(record.primaryIntent)} und ${record.sourceFile}.`);
    }
    primaryIntents.set(record.primaryIntent, record.sourceFile);

    const queryTokens = tokens(record.primaryQuery);
    if (queryTokens.size < 2) {
      errors.push(`${record.sourceFile}: primaryQuery ist nach Entfernung allgemeiner Begriffe zu unspezifisch.`);
    }
    const queryKey = [...queryTokens].sort().join(' ');
    if (queryKey && primaryQueries.has(queryKey)) {
      errors.push(`Doppelte Hauptfrage: ${primaryQueries.get(queryKey)} und ${record.sourceFile}.`);
    }
    primaryQueries.set(queryKey, record.sourceFile);

    if (record.guideRole === 'themenzentrum') {
      if (topicHubs.has(record.topic)) {
        errors.push(`Mehr als ein Themenzentrum für ${record.topic}: ${topicHubs.get(record.topic)} und ${record.sourceFile}.`);
      }
      topicHubs.set(record.topic, record.sourceFile);
    }

    if (record.contentType === 'ratgeber' && !record.guideRole) {
      errors.push(`${record.sourceFile}: Ratgeber benötigt guideRole.`);
    }

    if (record.contentType === 'nachricht' && record.eventId) {
      if (eventIds.has(record.eventId)) {
        errors.push(`Doppelte Ereigniskennung ${record.eventId}: ${eventIds.get(record.eventId)} und ${record.sourceFile}.`);
      }
      eventIds.set(record.eventId, record.sourceFile);
    }

    if (record.contentType === 'projekt' && record.projectId) {
      if (projectProfiles.has(record.projectId)) {
        errors.push(`Doppeltes Projektprofil ${record.projectId}: ${projectProfiles.get(record.projectId)} und ${record.sourceFile}.`);
      }
      projectProfiles.set(record.projectId, record.sourceFile);
    }

    if (record.contentType === 'entscheidung' && record.projectId && record.decisionDate && record.decisionLevel) {
      const decisionKey = `${record.projectId}|${record.decisionDate}|${record.decisionLevel}`;
      if (decisions.has(decisionKey)) {
        errors.push(`Doppeltes Entscheidungsprofil ${decisionKey}: ${decisions.get(decisionKey)} und ${record.sourceFile}.`);
      }
      decisions.set(decisionKey, record.sourceFile);
    }

    if (record.guideRole !== 'themenzentrum' && record.parentHub && !hubRoutes.has(normalizeRoute(record.parentHub))) {
      errors.push(`${record.sourceFile}: parentHub ${record.parentHub} ist kein registriertes Themenzentrum.`);
    }
  }

  return errors;
}

export function findOverlapWarnings(records) {
  const warnings = [];

  for (let index = 0; index < records.length; index += 1) {
    for (let compareIndex = index + 1; compareIndex < records.length; compareIndex += 1) {
      const left = records[index];
      const right = records[compareIndex];
      const sameTopic = left.topic === right.topic;
      const sameTask = left.searchTask === right.searchTask;
      const hubRelation = normalizeRoute(left.parentHub) === normalizeRoute(right.route)
        || normalizeRoute(right.parentHub) === normalizeRoute(left.route);
      const scores = {
        title: jaccard(left.title, right.title),
        description: jaccard(left.description, right.description),
        primaryQuery: jaccard(left.primaryQuery, right.primaryQuery),
        headings: jaccard(left.headings, right.headings),
        body: jaccard(left.body, right.body),
        bodyShingles: overlapCoefficient(shingles(left.body), shingles(right.body)),
      };
      const strongest = Math.max(...Object.values(scores));
      const combinedIntent = jaccard(
        `${left.title} ${left.description} ${left.primaryQuery}`,
        `${right.title} ${right.description} ${right.primaryQuery}`,
      );

      const errorLike = sameTopic && sameTask && combinedIntent >= 0.65;
      const needsReview = errorLike
        || (!hubRelation && combinedIntent >= 0.5)
        || scores.headings >= 0.65
        || scores.body >= 0.65
        || scores.bodyShingles >= 0.18
        || strongest >= 0.8;

      if (needsReview) {
        warnings.push({
          left: left.route,
          right: right.route,
          sameTopic,
          sameTask,
          hubRelation,
          combinedIntent,
          scores,
          severity: errorLike ? 'hoch' : 'pruefen',
          fingerprint: pairFingerprint(left, right),
        });
      }
    }
  }

  return warnings.sort((a, b) => b.combinedIntent - a.combinedIntent);
}

export function applyOverlapDecisions(warnings, decisions, today = new Date().toISOString().slice(0, 10)) {
  const validIsoDate = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return false;
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
  };
  return warnings.map((warning) => {
    const pair = [normalizeRoute(warning.left), normalizeRoute(warning.right)].sort();
    const decision = decisions.find((candidate) => {
      const candidatePair = (candidate.routes ?? []).map(normalizeRoute).sort();
      return candidatePair.length === 2 && candidatePair.every((route, index) => route === pair[index]);
    });
    const valid = Boolean(
      decision
      && typeof decision.rationale === 'string'
      && decision.rationale.trim().length >= 20
      && decision.fingerprint === warning.fingerprint
      && validIsoDate(decision.reviewedAt)
      && validIsoDate(decision.expiresAt)
      && decision.reviewedAt <= today
      && decision.expiresAt >= today,
    );
    return { ...warning, acknowledged: valid, decision: valid ? decision : undefined };
  });
}

async function fileExists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

export async function contentFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const relative = prefix ? path.posix.join(prefix, entry.name) : entry.name;
    if (entry.isDirectory()) return contentFiles(path.join(directory, entry.name), relative);
    return /\.(?:md|mdx)$/.test(entry.name) ? [relative] : [];
  }));
  return nested.flat();
}

async function run() {
  const blogDirectory = path.join(projectRoot, 'src', 'content', 'blog');
  const blogFiles = (await contentFiles(blogDirectory)).sort();
  const blogRecords = await Promise.all(blogFiles.map(async (file) => (
    recordFromContent(file, await readFile(path.join(blogDirectory, file), 'utf8'))
  )));
  const hubsFile = path.join(projectRoot, 'src', 'data', 'editorial-hubs.json');
  const registeredHubs = JSON.parse(await readFile(hubsFile, 'utf8'));
  const hubRecords = await Promise.all(registeredHubs.map(async (record) => {
    const sourcePath = path.join(projectRoot, record.sourceFile);
    const source = await fileExists(sourcePath) ? await readFile(sourcePath, 'utf8') : '';
    return {
      ...record,
      ...extractPageSignals(source),
      route: normalizeRoute(record.route),
    };
  }));
  const records = [...hubRecords, ...blogRecords];
  const hubRoutes = new Set(hubRecords.map((record) => record.route));
  const errors = validateRecords(records, hubRoutes);
  const overlapDecisions = JSON.parse(await readFile(
    path.join(projectRoot, 'src', 'data', 'content-overlap-decisions.json'),
    'utf8',
  ));
  const warnings = applyOverlapDecisions(findOverlapWarnings(records), overlapDecisions);
  const unresolvedWarnings = warnings.filter((warning) => !warning.acknowledged);

  for (const hub of hubRecords) {
    if (!(await fileExists(path.join(projectRoot, hub.sourceFile)))) {
      errors.push(`${hub.sourceFile}: registriertes Themenzentrum fehlt.`);
      continue;
    }
    const source = await readFile(path.join(projectRoot, hub.sourceFile), 'utf8');
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    const data = parseYaml(frontmatter);
    for (const field of ['title', 'description']) {
      const actual = scalarValue(data, field);
      if (actual !== hub[field]) {
        errors.push(`${hub.sourceFile}: ${field} stimmt nicht mit src/data/editorial-hubs.json überein.`);
      }
    }
  }

  const vercelConfig = JSON.parse(await readFile(path.join(projectRoot, 'vercel.json'), 'utf8'));
  for (const redirect of vercelConfig.redirects ?? []) {
    const source = normalizeRoute(redirect.source);
    const destination = normalizeRoute(redirect.destination);
    if (records.some((record) => record.route === source)) {
      errors.push(`Weiterleitung ${source} überschreibt einen aktiven Inhalt.`);
    }
    if (redirect.destination.startsWith('/') && !records.some((record) => record.route === destination)) {
      errors.push(`Weiterleitungsziel ${destination} ist kein registrierter Inhalt.`);
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    counts: {
      hubs: hubRecords.length,
      articles: blogRecords.length,
      warnings: warnings.length,
      unresolvedWarnings: unresolvedWarnings.length,
      errors: errors.length,
    },
    errors,
    warnings,
    records: records.map(({ body, headings, ...record }) => Object.fromEntries(
      Object.entries(record).filter(([, value]) => value !== ''),
    )),
  };

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    for (const warning of warnings) {
      console.warn(
        `WARN ${warning.acknowledged ? 'geprüft' : warning.severity}: ${warning.left} ↔ ${warning.right} `
        + `(Absicht ${warning.combinedIntent.toFixed(2)}, Titel ${warning.scores.title.toFixed(2)}, `
        + `Überschriften ${warning.scores.headings.toFixed(2)}, Text ${warning.scores.body.toFixed(2)}, `
        + `Passagen ${warning.scores.bodyShingles.toFixed(2)}, Prüfsignatur ${warning.fingerprint}).`,
      );
    }
    for (const error of errors) console.error(`ERROR ${error}`);
    console.log(
      `Überschneidungsprüfung: ${hubRecords.length} Themenzentren und ${blogRecords.length} Beiträge, `
      + `${warnings.length} Prüfhinweise (${unresolvedWarnings.length} ungeklärt), ${errors.length} Fehler.`,
    );
  }

  if (errors.length > 0 || (process.argv.includes('--strict') && unresolvedWarnings.length > 0)) {
    process.exitCode = 1;
  }
}

const invokedDirectly = process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (invokedDirectly) await run();

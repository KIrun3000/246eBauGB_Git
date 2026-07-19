import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { load as parseYaml } from 'js-yaml';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function normalizeRoute(route) {
  if (route === '/') return route;
  return `/${String(route).replace(/^\/+|\/+$/g, '')}/`;
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

export function validateVisibilityData({
  model,
  baseline,
  knownRoutes,
  contentTopics,
  today = new Date().toISOString().slice(0, 10),
  strictAge = false,
}) {
  const errors = [];
  const routeSet = new Set([...knownRoutes].map(normalizeRoute));
  const audiences = new Map();
  const groups = new Map();

  if (model?.version !== 1) errors.push('Beobachtungsmodell: version muss 1 sein.');
  if (!validDate(model?.updatedAt)) errors.push('Beobachtungsmodell: updatedAt ist kein gültiges Datum.');
  if (validDate(model?.updatedAt) && model.updatedAt > today) errors.push('Beobachtungsmodell: updatedAt liegt in der Zukunft.');

  for (const audience of model?.audiences ?? []) {
    if (!audience.id || !audience.label) errors.push('Beobachtungsmodell: Zielgruppe benötigt id und label.');
    if (audiences.has(audience.id)) errors.push(`Beobachtungsmodell: Zielgruppe ${audience.id} ist doppelt.`);
    audiences.set(audience.id, audience);
  }

  const topicOwners = new Map();
  for (const group of model?.topicGroups ?? []) {
    if (!group.id || !group.label) errors.push('Beobachtungsmodell: Themenfeld benötigt id und label.');
    if (groups.has(group.id)) errors.push(`Beobachtungsmodell: Themenfeld ${group.id} ist doppelt.`);
    groups.set(group.id, group);
    if (!audiences.has(group.primaryAudience)) {
      errors.push(`Beobachtungsmodell: Themenfeld ${group.id} verweist auf eine unbekannte Zielgruppe.`);
    }
    if (!routeSet.has(normalizeRoute(group.canonicalRoute))) {
      errors.push(`Beobachtungsmodell: Zielseite ${group.canonicalRoute} von ${group.id} ist unbekannt.`);
    }
    if (!Array.isArray(group.patterns) || group.patterns.length === 0) {
      errors.push(`Beobachtungsmodell: Themenfeld ${group.id} benötigt Suchmuster.`);
    }
    for (const pattern of group.patterns ?? []) {
      try {
        new RegExp(pattern, 'iu');
      } catch {
        errors.push(`Beobachtungsmodell: ungültiges Suchmuster in ${group.id}: ${pattern}`);
      }
    }
    for (const topic of group.topics ?? []) {
      if (topicOwners.has(topic)) {
        errors.push(`Beobachtungsmodell: Inhaltsthema ${topic} gehört zu mehreren Themenfeldern.`);
      }
      topicOwners.set(topic, group.id);
    }
  }

  for (const topic of contentTopics) {
    if (!topicOwners.has(topic)) errors.push(`Beobachtungsmodell: veröffentlichtes Inhaltsthema ${topic} ist nicht zugeordnet.`);
  }

  const questionIds = new Set();
  for (const question of model?.aiQuestions ?? []) {
    if (questionIds.has(question.id)) errors.push(`Beobachtungsmodell: KI-Prüffrage ${question.id} ist doppelt.`);
    questionIds.add(question.id);
    if (!audiences.has(question.audience)) errors.push(`Beobachtungsmodell: KI-Prüffrage ${question.id} hat eine unbekannte Zielgruppe.`);
    if (!groups.has(question.topicGroup)) errors.push(`Beobachtungsmodell: KI-Prüffrage ${question.id} hat ein unbekanntes Themenfeld.`);
    if (!routeSet.has(normalizeRoute(question.targetRoute))) errors.push(`Beobachtungsmodell: KI-Prüffrage ${question.id} hat eine unbekannte Zielseite.`);
    if (String(question.question ?? '').length < 20) errors.push(`Beobachtungsmodell: KI-Prüffrage ${question.id} ist zu kurz.`);
  }

  if (baseline?.version !== 1) errors.push('Sichtbarkeitsbestand: version muss 1 sein.');
  if (!validDate(baseline?.observedAt)) errors.push('Sichtbarkeitsbestand: observedAt ist kein gültiges Datum.');
  if (!validDate(baseline?.nextReviewAt)) errors.push('Sichtbarkeitsbestand: nextReviewAt ist kein gültiges Datum.');
  if (validDate(baseline?.observedAt) && baseline.observedAt > today) errors.push('Sichtbarkeitsbestand: observedAt liegt in der Zukunft.');
  if (validDate(baseline?.observedAt) && validDate(baseline?.nextReviewAt) && baseline.nextReviewAt < baseline.observedAt) {
    errors.push('Sichtbarkeitsbestand: nextReviewAt liegt vor observedAt.');
  }
  if (strictAge && validDate(baseline?.nextReviewAt) && baseline.nextReviewAt < today) {
    errors.push(`Sichtbarkeitsbestand: Wettbewerbsbeobachtung ist seit ${baseline.nextReviewAt} überfällig.`);
  }

  const official = new Set(baseline?.sourceGroups?.official?.domains ?? []);
  const editorial = new Set(baseline?.sourceGroups?.editorial?.domains ?? []);
  for (const domain of official) {
    if (editorial.has(domain)) errors.push(`Sichtbarkeitsbestand: ${domain} steht zugleich bei amtlichen Quellen und Wettbewerbern.`);
  }
  if (official.has('246ebaugb.de') || editorial.has('246ebaugb.de')) {
    errors.push('Sichtbarkeitsbestand: die eigene Domain darf nicht als externe Quelle geführt werden.');
  }

  const queries = new Set();
  for (const entry of baseline?.queries ?? []) {
    if (queries.has(entry.query)) errors.push(`Sichtbarkeitsbestand: Suchanfrage ${entry.query} ist doppelt.`);
    queries.add(entry.query);
    if (!routeSet.has(normalizeRoute(entry.targetRoute))) errors.push(`Sichtbarkeitsbestand: Zielseite ${entry.targetRoute} ist unbekannt.`);
    for (const domain of entry.officialSources ?? []) {
      if (!official.has(domain)) errors.push(`Sichtbarkeitsbestand: amtliche Domain ${domain} fehlt in der Quellengruppe.`);
    }
    for (const domain of entry.editorialCompetitors ?? []) {
      if (!editorial.has(domain)) errors.push(`Sichtbarkeitsbestand: Wettbewerbsdomain ${domain} fehlt in der Quellengruppe.`);
    }
  }

  return errors;
}

function frontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? parseYaml(match[1]) : {};
}

async function projectSignals() {
  const model = JSON.parse(await readFile(path.join(projectRoot, 'src/data/seo-observation-model.json'), 'utf8'));
  const baseline = JSON.parse(await readFile(path.join(projectRoot, 'src/data/search-visibility-baseline.json'), 'utf8'));
  const hubs = JSON.parse(await readFile(path.join(projectRoot, 'src/data/editorial-hubs.json'), 'utf8'));
  const blogDirectory = path.join(projectRoot, 'src/content/blog');
  const blogFiles = (await readdir(blogDirectory)).filter((file) => /\.mdx?$/.test(file));
  const blogEntries = await Promise.all(blogFiles.map(async (file) => ({
    route: normalizeRoute(`/blog/${file.replace(/\.mdx?$/, '')}`),
    data: frontmatter(await readFile(path.join(blogDirectory, file), 'utf8')),
  })));

  return {
    model,
    baseline,
    knownRoutes: new Set(['/', ...hubs.map((hub) => hub.route), ...blogEntries.map((entry) => entry.route)]),
    contentTopics: new Set([...hubs.map((hub) => hub.topic), ...blogEntries.map((entry) => entry.data.topic)]),
  };
}

async function main() {
  const strictAge = process.argv.includes('--strict-age');
  const errors = validateVisibilityData({ ...await projectSignals(), strictAge });
  for (const error of errors) console.error(`ERROR ${error}`);
  if (errors.length > 0) {
    console.error(`Sichtbarkeitsstrategie fehlerhaft: ${errors.length} Befund(e).`);
    process.exitCode = 1;
    return;
  }
  console.log(`Sichtbarkeitsstrategie gültig${strictAge ? ' und fristgerecht geprüft' : ''}.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

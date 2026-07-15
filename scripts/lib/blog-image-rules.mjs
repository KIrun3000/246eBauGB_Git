export const IMAGE_KIND_LABELS = {
  fotografie: 'Fotografie',
  'amtliche-darstellung': 'Amtliche Darstellung',
  'redaktionelle-grafik': 'Redaktionelle Grafik',
  'ki-symbolbild': 'KI-generiertes Symbolbild',
};

export const LEGACY_INCOMPLETE_IDS = new Set([
  'raeumlicher-zusammenhang-pruefen-grundstueck',
]);

const requiredText = [
  'fileName',
  'alt',
  'caption',
  'kind',
  'origin',
  'creator',
  'rightsBasis',
  'provenanceStatus',
  'purpose',
  'reviewStatus',
  'reviewedBy',
];

export const validateImageMetadata = ({ id, contentType, image, seenFileNames = new Map() }) => {
  const errors = [];

  if (!image || typeof image !== 'object') return ['Bildnachweis fehlt.'];

  for (const field of requiredText) {
    if (typeof image[field] !== 'string' || image[field].trim().length === 0) {
      errors.push(`${field} fehlt im Bildnachweis.`);
    }
  }

  if (image.fileName) {
    const previous = seenFileNames.get(image.fileName);
    if (previous && previous !== id) {
      errors.push(`das Motiv „${image.fileName}“ wird bereits von ${previous} verwendet.`);
    } else {
      seenFileNames.set(image.fileName, id);
    }
  }

  const expectedLabel = IMAGE_KIND_LABELS[image.kind];
  if (!expectedLabel) {
    errors.push(`unbekannte Bildart „${image.kind}“.`);
  } else if (!image.caption?.startsWith(expectedLabel)) {
    errors.push(`Bildunterschrift muss mit „${expectedLabel}“ beginnen.`);
  }

  if (contentType !== 'ratgeber' && image.kind === 'ki-symbolbild') {
    errors.push('KI-Symbolbilder sind nur für allgemeine Ratgeber zulässig.');
  }

  if (image.kind === 'ki-symbolbild' && image.origin !== 'intern-erzeugt') {
    errors.push('KI-Symbolbilder müssen als intern erzeugt ausgewiesen sein.');
  }

  if (image.kind === 'amtliche-darstellung' && image.origin !== 'amtlich') {
    errors.push('amtliche Darstellungen benötigen eine amtliche Herkunft.');
  }

  if (image.kind === 'fotografie' && !['eigenaufnahme', 'lizenziert'].includes(image.origin)) {
    errors.push('Fotografien benötigen eine Eigenaufnahme oder lizenzierte Herkunft.');
  }

  if (['amtlich', 'lizenziert'].includes(image.origin) && (!image.sourceLabel || !image.sourceUrl)) {
    errors.push('amtliche und lizenzierte Bilder benötigen Quellenbezeichnung und Quellenadresse.');
  }

  if (image.provenanceStatus === 'vollstaendig' && !image.createdAt) {
    errors.push('vollständiger Bildnachweis benötigt Erzeugungs- oder Aufnahmedatum.');
  }

  if (image.provenanceStatus === 'bestand-unvollstaendig') {
    if (!LEGACY_INCOMPLETE_IDS.has(id)) {
      errors.push('neue unvollständige Bildnachweise sind nicht zulässig.');
    }
    if (typeof image.provenanceNote !== 'string' || image.provenanceNote.trim().length < 30) {
      errors.push('Bestandsausnahme benötigt eine konkrete Erläuterung.');
    }
  }

  if (image.reviewStatus !== 'geprueft') {
    errors.push('Bild ist nicht redaktionell freigegeben.');
  }

  if (!image.reviewedAt) errors.push('Prüfdatum fehlt.');

  for (const field of ['topicFit', 'mobileCrop', 'noMisleadingDetails', 'rightsVerified']) {
    if (image.checks?.[field] !== true) errors.push(`Prüfbestätigung ${field} fehlt.`);
  }

  return errors;
};

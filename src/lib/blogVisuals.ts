export interface BlogVisual {
  src: string;
  srcSet: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  schemaImages?: string[];
}

const makeVisual = (
  fileName: string,
  alt: string,
  caption: string,
  width = 1536,
  height = 1024,
): BlogVisual => ({
  src: `/images/blog/${fileName}.webp`,
  srcSet: `/images/blog/${fileName}-768.webp 768w, /images/blog/${fileName}.webp ${width}w`,
  alt,
  caption,
  width,
  height,
});

const parcelVisual: BlogVisual = {
  src: '/images/blog/raeumlicher-zusammenhang-flurstueck-16x9.webp',
  srcSet:
    '/images/blog/raeumlicher-zusammenhang-flurstueck-16x9-768.webp 768w, /images/blog/raeumlicher-zusammenhang-flurstueck-16x9.webp 1536w',
  alt: 'Illustrative Aufnahme eines fiktiven Flurstücksplans mit markiertem Siedlungsrand und Grundstück',
  caption: 'KI-generiertes Symbolbild · kein amtlicher Plan',
  width: 1536,
  height: 864,
  schemaImages: [
    '/images/blog/raeumlicher-zusammenhang-flurstueck-1x1.webp',
    '/images/blog/raeumlicher-zusammenhang-flurstueck-4x3.webp',
    '/images/blog/raeumlicher-zusammenhang-flurstueck-16x9.webp',
  ],
};

const categoryVisuals: Record<string, BlogVisual> = {
  grundlagen: makeVisual(
    'grundlagen-flaechennutzungsplan',
    'Illustrative Aufnahme eines fiktiven Flächennutzungsplans auf einem Planungstisch',
    'KI-generiertes Symbolbild · kein amtlicher Plan',
  ),
  '100m': parcelVisual,
  aussenbereich: makeVisual(
    'aussenbereich-siedlungsrand',
    'Illustrative Luftaufnahme eines fiktiven Brandenburger Siedlungsrands mit angrenzender Freifläche',
    'KI-generiertes Symbolbild · kein realer Standort',
    1537,
    1023,
  ),
  ablauf: makeVisual(
    'verfahren-bauantrag',
    'Illustrative Aufnahme fiktiver Bauantragsunterlagen auf einem Schreibtisch',
    'KI-generiertes Symbolbild · keine echten Verfahrensunterlagen',
  ),
  faq: makeVisual(
    'praxisfragen-grundstuecksplan',
    'Illustrative Aufnahme einer Besprechung über einem fiktiven Grundstücksplan',
    'KI-generiertes Symbolbild · kein amtlicher Plan',
  ),
};

const postVisuals: Record<string, BlogVisual> = {
  'ablehnungsgruende-gemeindezustimmung': makeVisual(
    'ablehnung-gemeinde-planbesprechung',
    'Zwei Personen besprechen mögliche Änderungen an einem schematischen Grundstücksplan',
    'KI-generiertes Symbolbild · keine echten Planunterlagen',
    1536,
    864,
  ),
  'aufstockung-anbau-innenbereich': makeVisual(
    'aufstockung-anbau-wohnhaus',
    'Wohnhaus mit hölzernem Dachaufbau und seitlichem Anbau während einer Planungsbesichtigung',
    'KI-generiertes Symbolbild · kein reales Bauvorhaben',
    1536,
    864,
  ),
  'befristung-2030-fristen-beachten': makeVisual(
    'befristung-projektplanung',
    'Zwei Personen ordnen die zeitlichen Schritte eines Bauvorhabens an einer Planungstafel',
    'KI-generiertes Symbolbild · keine echte Terminplanung',
    1536,
    864,
  ),
  'erschliessung-sichern-anforderungen': makeVisual(
    'erschliessung-grundstueck',
    'Vor-Ort-Prüfung von Zufahrt und Versorgungsanschlüssen an einem unbebauten Grundstück',
    'KI-generiertes Symbolbild · kein realer Standort',
    1536,
    864,
  ),
  'gemeindezustimmung-beantragen-unterlagen': makeVisual(
    'gemeindezustimmung-unterlagen',
    'Bauzeichnungen, Lageplan und Prüfliste als geordnete Unterlagen für ein Bauvorhaben',
    'KI-generiertes Symbolbild · keine echten Verfahrensunterlagen',
    1536,
    864,
  ),
  'nachverdichtung-hinterlandbebauung': makeVisual(
    'nachverdichtung-hinterland',
    'Blick auf ein tiefes Wohngrundstück mit seitlicher Zufahrt und unbebauter Fläche in zweiter Reihe',
    'KI-generiertes Symbolbild · kein reales Grundstück',
    1536,
    864,
  ),
  'naturschutz-ausgleich-aussenbereich': makeVisual(
    'naturschutz-standortpruefung',
    'Fachleute untersuchen Vegetation und Standortbedingungen am Rand einer Siedlung',
    'KI-generiertes Symbolbild · keine reale Umweltprüfung',
    1536,
    864,
  ),
  'nutzungsaenderung-gewerbe-zu-wohnen': makeVisual(
    'nutzungsaenderung-gewerbe-wohnen',
    'Planungsbesichtigung eines älteren Gewerbegebäudes für eine mögliche Wohnnutzung',
    'KI-generiertes Symbolbild · kein reales Umnutzungsvorhaben',
    1536,
    864,
  ),
  'raeumlicher-zusammenhang-pruefen-grundstueck': parcelVisual,
  'umweltpruefung-sup-erforderlich': makeVisual(
    'umweltpruefung-planung',
    'Planungsunterlagen, Luftbild und Standortfotos bei einer überschlägigen Umweltvorprüfung',
    'KI-generiertes Symbolbild · keine amtlichen Karten oder Unterlagen',
    1536,
    864,
  ),
};

export const getBlogVisual = (id: string, category: string): BlogVisual =>
  postVisuals[id] ?? categoryVisuals[category] ?? categoryVisuals.grundlagen;

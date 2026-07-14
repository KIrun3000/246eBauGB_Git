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
  caption: 'Illustrative Darstellung · kein amtlicher Plan',
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
    'Illustrative Darstellung · kein amtlicher Plan',
  ),
  '100m': parcelVisual,
  aussenbereich: makeVisual(
    'aussenbereich-siedlungsrand',
    'Illustrative Luftaufnahme eines fiktiven Brandenburger Siedlungsrands mit angrenzender Freifläche',
    'Illustrative Darstellung · kein realer Standort',
    1537,
    1023,
  ),
  ablauf: makeVisual(
    'verfahren-bauantrag',
    'Illustrative Aufnahme fiktiver Bauantragsunterlagen auf einem Schreibtisch',
    'Illustrative Darstellung · keine echten Verfahrensunterlagen',
  ),
  faq: makeVisual(
    'praxisfragen-grundstuecksplan',
    'Illustrative Aufnahme einer Besprechung über einem fiktiven Grundstücksplan',
    'Illustrative Darstellung · kein amtlicher Plan',
  ),
};

const postVisuals: Record<string, BlogVisual> = {
  'raeumlicher-zusammenhang-pruefen-grundstueck': parcelVisual,
};

export const getBlogVisual = (id: string, category: string): BlogVisual =>
  postVisuals[id] ?? categoryVisuals[category] ?? categoryVisuals.grundlagen;

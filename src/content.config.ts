// @ts-check
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const imageKindLabels = {
  fotografie: 'Fotografie',
  'amtliche-darstellung': 'Amtliche Darstellung',
  'redaktionelle-grafik': 'Redaktionelle Grafik',
  'ki-symbolbild': 'KI-generiertes Symbolbild',
};

const blogImage = z.object({
  fileName: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  alt: z.string().min(20).max(180),
  caption: z.string().min(20).max(180),
  kind: z.enum(['fotografie', 'amtliche-darstellung', 'redaktionelle-grafik', 'ki-symbolbild']),
  origin: z.enum(['eigenaufnahme', 'lizenziert', 'amtlich', 'intern-erzeugt']),
  creator: z.string().min(3),
  rightsBasis: z.string().min(10),
  sourceLabel: z.string().min(3).optional(),
  sourceUrl: z.string().url().optional(),
  schemaImages: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).min(1).max(3).optional(),
  createdAt: z.coerce.date().optional(),
  provenanceStatus: z.enum(['vollstaendig', 'bestand-unvollstaendig']),
  provenanceNote: z.string().min(30).optional(),
  purpose: z.string().min(30),
  reviewStatus: z.enum(['geprueft', 'ueberarbeiten']),
  reviewedAt: z.coerce.date(),
  reviewedBy: z.string().min(3),
  checks: z.object({
    topicFit: z.literal(true),
    mobileCrop: z.literal(true),
    noMisleadingDetails: z.literal(true),
    rightsVerified: z.literal(true),
  }),
}).superRefine((image, context) => {
  const expectedLabel = imageKindLabels[image.kind];
  if (!image.caption.startsWith(expectedLabel)) {
    context.addIssue({
      code: 'custom',
      path: ['caption'],
      message: `Die Bildunterschrift muss mit „${expectedLabel}“ beginnen.`,
    });
  }

  if (['amtlich', 'lizenziert'].includes(image.origin) && (!image.sourceLabel || !image.sourceUrl)) {
    context.addIssue({
      code: 'custom',
      path: ['sourceUrl'],
      message: 'Amtliche und lizenzierte Bilder benötigen Quellenbezeichnung und Quellenadresse.',
    });
  }

  if (image.kind === 'amtliche-darstellung' && image.origin !== 'amtlich') {
    context.addIssue({
      code: 'custom',
      path: ['origin'],
      message: 'Amtliche Darstellungen müssen als amtliche Herkunft ausgewiesen sein.',
    });
  }

  if (image.kind === 'fotografie' && !['eigenaufnahme', 'lizenziert'].includes(image.origin)) {
    context.addIssue({
      code: 'custom',
      path: ['origin'],
      message: 'Fotografien benötigen eine Eigenaufnahme oder eine lizenzierte Herkunft.',
    });
  }

  if (image.provenanceStatus === 'vollstaendig' && !image.createdAt) {
    context.addIssue({
      code: 'custom',
      path: ['createdAt'],
      message: 'Ein vollständiger Bildnachweis benötigt ein Erzeugungs- oder Aufnahmedatum.',
    });
  }

  if (image.provenanceStatus === 'bestand-unvollstaendig' && !image.provenanceNote) {
    context.addIssue({
      code: 'custom',
      path: ['provenanceNote'],
      message: 'Ein unvollständiger Bestandsnachweis benötigt eine konkrete Erläuterung.',
    });
  }

  if (image.createdAt && image.reviewedAt < image.createdAt) {
    context.addIssue({
      code: 'custom',
      path: ['reviewedAt'],
      message: 'Die Bildprüfung darf nicht vor der Erzeugung oder Aufnahme liegen.',
    });
  }
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: blogImage,
    quickAnswer: z.string().min(40),
    keyPoints: z.array(z.string().min(20)).min(3).max(5),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    updateReason: z.string().min(20).optional(),
    category: z.enum(['grundlagen', '100m', 'aussenbereich', 'ablauf', 'faq']),
    tags: z.array(z.string()),
    region: z.string().default('Brandenburg'),
    intent: z.enum(['owner', 'broker', 'builder', 'municipality']).default('owner'),
    contentType: z.enum(['ratgeber', 'nachricht', 'projekt', 'entscheidung']),
    guideRole: z.enum(['themenzentrum', 'vertiefung']).optional(),
    topic: z.enum([
      '246e-grundlagen',
      'aussenbereich',
      'raeumlicher-zusammenhang',
      'gemeindezustimmung',
      'frist-2030',
      'erschliessung',
      'naturschutz-ausgleich',
      'umweltpruefung',
      'innenentwicklung',
      'nutzungsaenderung',
    ]),
    searchTask: z.enum(['verstehen', 'vorpruefen', 'vorbereiten', 'reagieren', 'aenderung-verfolgen', 'fall-recherchieren']),
    primaryIntent: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    primaryQuery: z.string().min(10),
    parentHub: z.string().regex(/^\/[a-z0-9-]+\/$/),
    lifecycleStatus: z.enum(['aktuell', 'historisch', 'ueberarbeiten', 'zusammenfuehren']),
    legalAsOf: z.coerce.date(),
    eventId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
    eventDate: z.coerce.date().optional(),
    newsKind: z.enum(['gesetzesaenderung', 'arbeitshilfe', 'gerichtsentscheidung', 'kommunalpolitik', 'datenaktualisierung', 'projektereignis']).optional(),
    jurisdiction: z.string().min(2).optional(),
    sourceStatus: z.enum(['amtlich-bestaetigt', 'amtliches-verfahren', 'behoerdliche-mitteilung']).optional(),
    reviewAfter: z.coerce.date().optional(),
    projectId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
    municipality: z.string().min(2).optional(),
    projectType: z.string().min(3).optional(),
    projectStatus: z.enum(['bekanntgegeben', 'in-pruefung', 'zugestimmt', 'abgelehnt', 'teilweise-zugestimmt', 'genehmigt', 'nicht-genehmigt', 'rechtskraeftig']).optional(),
    decisionDate: z.coerce.date().optional(),
    decisionStatus: z.enum(['zugestimmt', 'abgelehnt', 'teilweise-zugestimmt', 'offen']).optional(),
    decisionLevel: z.enum(['gemeinde', 'bauaufsicht', 'gericht', 'sonstige']).optional(),
    decisionAuthority: z.string().min(2).optional(),
    decisionReference: z.string().min(2).optional(),
    decisionReasonSummary: z.string().min(30).optional(),
    sources: z.array(z.object({
      label: z.string(),
      url: z.string().url(),
      type: z.enum(['primary', 'secondary']),
      role: z.enum(['law', 'legislative-material', 'guidance', 'decision', 'court-decision', 'data', 'other-official']).optional(),
      evidence: z.enum(['legal-context', 'event', 'project']).optional(),
    })).default([])
  }).superRefine((entry, context) => {
    if (entry.image.reviewStatus !== 'geprueft') {
      context.addIssue({
        code: 'custom',
        path: ['image', 'reviewStatus'],
        message: 'Veröffentlichte Beiträge benötigen ein redaktionell geprüftes Bild.',
      });
    }

    if (entry.contentType !== 'ratgeber' && entry.image.kind === 'ki-symbolbild') {
      context.addIssue({
        code: 'custom',
        path: ['image', 'kind'],
        message: 'Nachrichten, Projekte und Entscheidungen dürfen kein KI-Symbolbild verwenden.',
      });
    }

    if (entry.updatedDate && entry.updatedDate < entry.pubDate) {
      context.addIssue({
        code: 'custom',
        path: ['updatedDate'],
        message: 'updatedDate darf nicht vor pubDate liegen.',
      });
    }

    if (entry.legalAsOf > (entry.updatedDate ?? entry.pubDate)) {
      context.addIssue({
        code: 'custom',
        path: ['legalAsOf'],
        message: 'legalAsOf darf nicht nach dem letzten Veröffentlichungs- oder Aktualisierungsdatum liegen.',
      });
    }

    if (entry.updatedDate && !entry.updateReason) {
      context.addIssue({
        code: 'custom',
        path: ['updateReason'],
        message: 'updatedDate benötigt einen nachvollziehbaren updateReason.',
      });
    }

    if (entry.contentType === 'ratgeber' && !entry.guideRole) {
      context.addIssue({
        code: 'custom',
        path: ['guideRole'],
        message: 'Ratgeber benötigen eine Rolle als Themenzentrum oder Vertiefung.',
      });
    }

    if (!entry.sources.some((source) => source.type === 'primary')) {
      context.addIssue({
        code: 'custom',
        path: ['sources'],
        message: 'Mindestens eine Primärquelle ist erforderlich.',
      });
    }

    if (entry.contentType === 'nachricht') {
      for (const field of ['eventId', 'eventDate', 'newsKind', 'jurisdiction', 'sourceStatus']) {
        if (!entry[field]) {
          context.addIssue({
            code: 'custom',
            path: [field],
            message: `Nachrichten benötigen ${field}.`,
          });
        }
      }
      if (entry.eventDate && entry.eventDate > entry.pubDate) {
        context.addIssue({
          code: 'custom',
          path: ['eventDate'],
          message: 'eventDate darf nicht nach pubDate liegen.',
        });
      }
      if (entry.sourceStatus === 'amtliches-verfahren' && !entry.reviewAfter) {
        context.addIssue({
          code: 'custom',
          path: ['reviewAfter'],
          message: 'Laufende amtliche Verfahren benötigen reviewAfter.',
        });
      }
      const eventSourceRoles = {
        gesetzesaenderung: ['law', 'legislative-material'],
        arbeitshilfe: ['guidance'],
        gerichtsentscheidung: ['court-decision'],
        kommunalpolitik: ['decision', 'other-official'],
        datenaktualisierung: ['data', 'other-official'],
        projektereignis: ['decision', 'data', 'other-official'],
      }[entry.newsKind ?? ''] ?? [];
      if (!entry.sources.some((source) => source.evidence === 'event' && eventSourceRoles.includes(source.role ?? ''))) {
        context.addIssue({
          code: 'custom',
          path: ['sources'],
          message: 'Nachrichten benötigen eine zum Ereignis passende amtliche Primärquelle.',
        });
      }
      if (entry.reviewAfter && entry.reviewAfter <= entry.pubDate) {
        context.addIssue({
          code: 'custom',
          path: ['reviewAfter'],
          message: 'reviewAfter muss nach pubDate liegen.',
        });
      }
    }

    if (entry.contentType === 'projekt') {
      for (const field of ['projectId', 'municipality', 'projectType', 'projectStatus']) {
        if (!entry[field]) {
          context.addIssue({
            code: 'custom',
            path: [field],
            message: `Projektprofile benötigen ${field}.`,
          });
        }
      }
      if (!entry.sources.some((source) => source.evidence === 'project' && ['decision', 'court-decision', 'data', 'other-official'].includes(source.role ?? ''))) {
        context.addIssue({
          code: 'custom',
          path: ['sources'],
          message: 'Projektprofile benötigen eine konkrete öffentliche Projekt- oder Entscheidungsquelle.',
        });
      }
      if (entry.projectStatus && ['bekanntgegeben', 'in-pruefung', 'zugestimmt', 'teilweise-zugestimmt'].includes(entry.projectStatus) && !entry.reviewAfter) {
        context.addIssue({
          code: 'custom',
          path: ['reviewAfter'],
          message: 'Noch nicht abgeschlossene Projektstände benötigen reviewAfter.',
        });
      }
      if (entry.reviewAfter && entry.reviewAfter <= entry.pubDate) {
        context.addIssue({
          code: 'custom',
          path: ['reviewAfter'],
          message: 'reviewAfter muss nach pubDate liegen.',
        });
      }
    }

    if (entry.contentType === 'entscheidung') {
      for (const field of [
        'projectId',
        'municipality',
        'projectType',
        'decisionDate',
        'decisionStatus',
        'decisionLevel',
        'decisionAuthority',
        'decisionReference',
        'decisionReasonSummary',
      ]) {
        if (!entry[field]) {
          context.addIssue({
            code: 'custom',
            path: [field],
            message: `Entscheidungsprofile benötigen ${field}.`,
          });
        }
      }
      if (entry.decisionDate && entry.decisionDate > entry.pubDate) {
        context.addIssue({
          code: 'custom',
          path: ['decisionDate'],
          message: 'decisionDate darf nicht nach pubDate liegen.',
        });
      }
      if (!entry.sources.some((source) => source.type === 'primary' && source.evidence === 'event' && ['decision', 'court-decision'].includes(source.role ?? ''))) {
        context.addIssue({
          code: 'custom',
          path: ['sources'],
          message: 'Entscheidungsprofile benötigen eine veröffentlichte Entscheidung als Primärquelle.',
        });
      }
      if (entry.decisionStatus === 'offen' && !entry.reviewAfter) {
        context.addIssue({
          code: 'custom',
          path: ['reviewAfter'],
          message: 'Offene Entscheidungsstände benötigen reviewAfter.',
        });
      }
      if (entry.reviewAfter && entry.reviewAfter <= entry.pubDate) {
        context.addIssue({
          code: 'custom',
          path: ['reviewAfter'],
          message: 'reviewAfter muss nach pubDate liegen.',
        });
      }
    }
  })
});

export const collections = { blog };

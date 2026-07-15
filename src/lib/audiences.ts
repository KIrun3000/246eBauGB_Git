export const audienceLabels = {
  owner: 'Grundstückseigentümer',
  broker: 'Makler und Kooperationspartner',
  builder: 'Bauwillige Eigentümer',
  municipality: 'Kommunen und Verwaltung',
} as const;

export type Audience = keyof typeof audienceLabels;

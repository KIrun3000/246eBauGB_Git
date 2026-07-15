export const audienceLabels = {
  owner: 'Grundstückseigentümer',
  broker: 'Makler und Kooperationspartner',
  builder: 'Bauwillige Eigentümer',
} as const;

export type Audience = keyof typeof audienceLabels;

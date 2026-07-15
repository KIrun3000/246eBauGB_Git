export const SITE = {
  name: '§246e BauGB Brandenburg',
  shortName: '§246e Brandenburg',
  url: 'https://246ebaugb.de',
  publicEmail: 'luca@ingenbleek.io',
  publisher: {
    name: 'Luca Ingenbleek',
    page: '/redaktion-und-methodik/',
  },
} as const;

export const absoluteSiteUrl = (path: string) => new URL(path, SITE.url).toString();

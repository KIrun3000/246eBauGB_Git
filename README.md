# §246e BauGB Brandenburg

Eine minimalistische, SEO-optimierte Astro-Website mit Blog für private Grundstückseigentümer in Brandenburg. Fokus: §246e BauGB und Bauen im Außenbereich.

## 🚀 Quick Start

### Lokale Entwicklung starten

```bash
npm install
npm run dev
```

Die Website ist dann unter `http://localhost:4321` erreichbar.

### Build für Production

```bash
npm run build
npm run preview
```

## 📁 Projektstruktur

```
/
├── public/              # Statische Assets (Bilder, Favicon, etc.)
├── src/
│   ├── components/      # Wiederverwendbare Astro-Komponenten
│   │   ├── SEO.astro
│   │   ├── Disclaimer.astro
│   │   └── SourcesBox.astro
│   ├── content/         # Content Collections
│   │   └── blog/        # Blog-Posts als .md/.mdx Dateien
│   ├── layouts/         # Layout-Komponenten
│   │   ├── BaseLayout.astro
│   │   └── ArticleLayout.astro
│   └── pages/           # Seiten (automatisches Routing)
│       ├── index.astro              # Homepage
│       ├── blog/
│       │   ├── index.astro          # Blog-Listing
│       │   └── [...slug].astro      # Dynamische Blog-Posts
│       ├── 246e-baugb-brandenburg.mdx
│       ├── 100m-regel-raeumlicher-zusammenhang.mdx
│       ├── aussenbereich-brandenburg-246e.mdx
│       ├── zustimmung-gemeinde-246e.mdx
│       ├── check.astro
│       ├── impressum.astro
│       ├── datenschutz.astro
│       └── rss.xml.js               # RSS Feed
├── astro.config.mjs     # Astro-Konfiguration
├── src/content.config.ts # Content Collections Schema
├── PROMPT_CONTRACT.md   # KI-Agent Contract für Content-Erstellung
└── README.md            # Diese Datei
```

## 📝 Neuen Blog-Post erstellen

### Manuell

1. Erstelle eine neue `.mdx`-Datei unter `src/content/blog/`
2. Füge das Frontmatter hinzu (siehe PROMPT_CONTRACT.md)
3. Schreibe deinen Content
4. Speichern – fertig! Die Seite erscheint automatisch im Blog-Listing

**Beispiel**: `src/content/blog/mein-neuer-artikel.mdx`

```mdx
---
title: "Mein Artikel-Titel"
description: "Kurze Beschreibung des Artikels"
pubDate: 2025-01-15
category: "grundlagen"
tags: ["Tag1", "Tag2"]
region: "Brandenburg"
intent: "owner"
sources:
  - label: "Quelle 1"
    url: "https://example.com"
---

## Einleitung

Hier beginnt dein Artikel...
```

### Mit KI-Agents

Siehe `PROMPT_CONTRACT.md` für detaillierte Vorgaben zur automatisierten Content-Erstellung.

## 🎨 Wichtige Komponenten

### SEO-Komponente
Automatische Meta-Tags für jede Seite (Title, Description, Open Graph, Twitter Cards).

### Disclaimer-Komponente
Rechtshinweis, der automatisch auf allen Artikel-Seiten eingebunden wird.

### SourcesBox-Komponente
Zeigt Quellenangaben am Ende eines Artikels an (aus Frontmatter).

### ArticleLayout
Layout für Pillar-Seiten und Blog-Posts. Bindet automatisch SEO, SourcesBox und Disclaimer ein.

## 🔧 Konfiguration

### Site-URL anpassen

In `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://deine-domain.de',
  // ...
});
```

**Wichtig**: Die Site-URL wird für Sitemap und RSS Feed benötigt!

## 📤 Deployment auf Vercel

### Schritt 1: GitHub Repository erstellen

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/dein-username/dein-repo.git
git push -u origin main
```

### Schritt 2: Vercel-Projekt erstellen

1. Gehe zu [vercel.com](https://vercel.com) und melde dich an
2. Klicke auf "Add New Project"
3. Importiere dein GitHub Repository
4. Vercel erkennt Astro automatisch
5. **Framework Preset**: Astro (wird automatisch erkannt)
6. **Build Command**: `npm run build` (Standard)
7. **Output Directory**: `dist` (Standard)
8. Klicke auf "Deploy"

### Schritt 3: Domain konfigurieren (optional)

1. In deinem Vercel-Projekt: Settings → Domains
2. Füge deine Custom Domain hinzu (z.B. `246ebaugb.de`)
3. Folge den DNS-Anweisungen von Vercel

### Automatische Deployments

Nach dem Setup: Jeder Push zu `main` triggert automatisch ein neues Deployment auf Vercel.

### Environment Variables (falls benötigt)

Settings → Environment Variables in Vercel hinzufügen.

## 🔍 SEO-Features

- ✅ Automatische Sitemap (`/sitemap.xml`)
- ✅ RSS Feed (`/rss.xml`)
- ✅ Meta-Tags (Title, Description, OG, Twitter)
- ✅ Canonical URLs
- ✅ Strukturierte Interne Verlinkung (Hub & Spoke)
- ✅ Semantisches HTML

## 📊 Content-Strategie

### Pillar-Seiten (Hubs)
4 Hauptseiten mit umfassenden Informationen:
1. `/246e-baugb-brandenburg` – Grundlagen
2. `/100m-regel-raeumlicher-zusammenhang` – 100m-Regel
3. `/aussenbereich-brandenburg-246e` – Außenbereich
4. `/zustimmung-gemeinde-246e` – Gemeinde-Zustimmung

### Blog-Posts (Spokes)
Spezifische Themen, die auf Pillar-Seiten zurückverlinken:
- Praxisbeispiele
- Detailfragen
- Aktuelle Entwicklungen
- FAQs zu Spezialthemen

### Interne Verlinkung
Jeder Blog-Post sollte mindestens 2 Links zu Pillar-Seiten enthalten.

## 🎯 Zielgruppe

**Primary**: Private Grundstückseigentümer in Brandenburg
- Besitzen Grundstück im Außenbereich
- Erwägen Bauvorhaben nach §246e BauGB
- Suchen verständliche Information (kein Fachjargon)
- Brauchen Orientierung im Verfahren

## ⚖️ Rechtlicher Hinweis

Diese Website bietet **keine Rechtsberatung**. Alle Inhalte dienen ausschließlich der Information. Für verbindliche Auskünfte bitte Fachanwalt für Baurecht oder Baubehörde kontaktieren.

**Vor Veröffentlichung zu ergänzen**:
- Impressum mit echten Daten
- Datenschutzerklärung vervollständigen
- Ggf. Cookie-Banner (wenn Tracking eingebaut wird)

## 🛠️ Technologie-Stack

- **Framework**: [Astro](https://astro.build) 5.x
- **Content**: MDX (Markdown + React Components)
- **Styling**: CSS (Custom Properties, kein Framework)
- **Hosting**: Vercel (statisch)
- **CI/CD**: Automatisch via Vercel

## 📚 Weitere Dokumentation

- **Astro Docs**: https://docs.astro.build
- **Content Collections**: https://docs.astro.build/en/guides/content-collections/
- **MDX**: https://mdxjs.com/
- **Vercel Docs**: https://vercel.com/docs

## 🤝 Contributing

Neue Content-Ideen? Bug gefunden?
1. Erstelle einen Branch
2. Mache deine Änderungen
3. Öffne einen Pull Request

Für automatisierte Content-Erstellung siehe `PROMPT_CONTRACT.md`.

## 📄 Lizenz

[Lizenz hier einfügen, z.B. MIT]

---

**Kontakt**: [Kontaktdaten einfügen]

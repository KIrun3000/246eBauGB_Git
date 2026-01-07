# §246e BauGB Brandenburg – KI-Agent Contract

## Zweck
Dieses Dokument definiert die exakte Struktur und Anforderungen für KI-Agents, die automatisiert Blog-Content für diese Website erstellen.

## Content-Typ: Blog-Post (MDX)

### Output-Spezifikation
- **Format**: MDX-Datei (Markdown mit optionalen React-Komponenten)
- **Speicherort**: `src/content/blog/`
- **Dateiname**: Kebab-case, beschreibend, z.B. `100m-regel-praxisbeispiele.mdx`

### Frontmatter (REQUIRED)

```yaml
---
title: "Präziser, SEO-optimierter Titel (50-60 Zeichen)"
description: "Meta-Description, prägnant, handlungsaufrufend (140-160 Zeichen)"
pubDate: 2025-01-15  # Format: YYYY-MM-DD
category: "grundlagen" | "100m" | "aussenbereich" | "ablauf" | "faq"
tags: ["Tag1", "Tag2", "Tag3"]  # 3-5 Tags, spezifisch
region: "Brandenburg"  # Immer "Brandenburg"
intent: "owner"  # Immer "owner" (private Eigentümer)
sources:
  - label: "Beschreibung der Quelle"
    url: "https://example.com/quelle"
  - label: "Weitere Quelle"
    url: "https://example.com/quelle2"
---
```

### Content-Struktur (REQUIRED)

#### 1. Einleitung (100-120 Wörter)
- Problem/Frage des Lesers aufgreifen
- Kurzer Überblick über Artikelinhalt
- Klarer Nutzen für den Leser

#### 2. Hauptteil (3-6 H2-Überschriften)
- Jeder Abschnitt beantwortet eine spezifische Frage
- Verwendung von:
  - Bullet-Listen für Aufzählungen
  - Nummerierte Listen für Abläufe
  - **Fettschrift** für wichtige Begriffe
  - Tabellen (wenn sinnvoll)
  - Praktische Beispiele

#### 3. FAQ-Sektion (REQUIRED)
- Mindestens 5, maximal 8 Fragen
- Format:
  ```markdown
  ## Häufige Fragen (FAQ)
  
  ### Frage 1?
  
  Antwort auf Frage 1.
  
  ### Frage 2?
  
  Antwort auf Frage 2.
  ```

#### 4. Interne Verlinkung (REQUIRED)
- Mindestens 2 interne Links zu Pillar-Seiten:
  - `/246e-baugb-brandenburg`
  - `/100m-regel-raeumlicher-zusammenhang`
  - `/aussenbereich-brandenburg-246e`
  - `/zustimmung-gemeinde-246e`
- Format: `[Linktext](/url)`

#### 5. Quellen (REQUIRED)
- Mindestens 2 Quellen im Frontmatter
- Offizielle Quellen bevorzugen (Gesetze, Ministerien, Behörden)

### Tone of Voice

**DO**:
- Sachlich, aber verständlich
- Direkte Ansprache ("Sie")
- Kurze, klare Sätze
- Konkrete Beispiele aus Brandenburg
- Praktische Tipps und Checklisten

**DON'T**:
- Amtsdeutsch oder Juristenjargon
- Versprechen oder Garantien
- Rechtliche Beratung suggerieren
- Überverkaufen oder Marketing-Sprech
- Ohne Disclaimer arbeiten

### Disclaimer
Jeder Artikel MUSS klar kommunizieren: **"Diese Informationen ersetzen keine Rechtsberatung."**
Dies geschieht automatisch über die ArticleLayout-Komponente.

## Beispiel: Vollständiger Artikel

```mdx
---
title: "Erschließungskosten im Außenbereich Brandenburg – Was Sie wissen müssen"
description: "Was kosten Zufahrt, Wasser, Abwasser und Strom im Außenbereich? Ein praxisnaher Überblick für Brandenburg."
pubDate: 2025-01-15
category: "aussenbereich"
tags: ["Erschließung", "Kosten", "Außenbereich", "Infrastruktur"]
region: "Brandenburg"
intent: "owner"
sources:
  - label: "Erschließungsbeitragsrecht Brandenburg"
    url: "https://bravors.brandenburg.de/..."
  - label: "Kommunale Gebührensätze"
    url: "https://example.com"
---

## Einleitung

Die Erschließung eines Grundstücks im [Außenbereich Brandenburg](/aussenbereich-brandenburg-246e) ist oft teurer als gedacht. Wasser, Abwasser, Strom und Zufahrt müssen häufig auf eigene Kosten hergestellt werden. In diesem Artikel erklären wir, mit welchen Kosten Sie rechnen müssen und worauf Sie achten sollten.

## Was bedeutet Erschließung?

Erschließung umfasst alle infrastrukturellen Anbindungen:

- **Verkehrsanbindung**: Zufahrt zum Grundstück
- **Trinkwasser**: Wasseranschluss oder Brunnen
- **Abwasser**: Kanalanschluss oder Kleinkläranlage
- **Energie**: Strom, ggf. Gas

[... weiterer Content ...]

## Häufige Fragen (FAQ)

### Was kostet ein Wasseranschluss im Außenbereich?

Die Kosten variieren stark je nach Entfernung. Rechnen Sie mit 3.000-15.000 Euro.

### Brauche ich eine Kleinkläranlage?

Wenn kein Kanalanschluss vorhanden ist, ja. Kosten: 5.000-15.000 Euro.

[... weitere FAQs ...]

## Fazit

Die Erschließung im Außenbereich kann erhebliche Kosten verursachen. Klären Sie frühzeitig mit der Gemeinde und Versorgern, welche Kosten auf Sie zukommen.

Mehr Informationen zu [§246e BauGB in Brandenburg](/246e-baugb-brandenburg) und zur [Gemeinde-Zustimmung](/zustimmung-gemeinde-246e) finden Sie in unseren Artikeln.
```

## Batch-Erstellung

Bei Batch-Erstellung mehrerer Artikel:

1. Erstelle einen Index mit geplanten Titeln
2. Erzeuge jeden Artikel als separate MDX-Datei
3. Vermeide inhaltliche Überschneidungen
4. Verlinke sinnvoll zwischen den Artikeln

## Qualitätskriterien

Ein Agent-generierter Artikel ist erfolgreich, wenn:

- [ ] Frontmatter vollständig und korrekt
- [ ] Einleitung 100-120 Wörter
- [ ] 3-6 strukturierte H2-Abschnitte
- [ ] FAQ mit 5-8 Fragen
- [ ] Mindestens 2 interne Links zu Pillars
- [ ] Mindestens 2 Quellen
- [ ] Keine Rechtschreibfehler
- [ ] Verständlicher Ton (keine Fachsprache ohne Erklärung)
- [ ] Brandenburg-Fokus erkennbar
- [ ] Zielgruppe: private Eigentümer

## Technische Hinweise

- MDX erlaubt Import von Komponenten: Nutze dies für Callouts, Tabellen, etc.
- Bilder können unter `public/` abgelegt und eingebunden werden
- Die Site generiert automatisch Sitemap und RSS
- Keine manuelle Konfiguration der Routen nötig

## Kontakt bei Fragen

Dieser Contract ist "living document" und kann angepasst werden, wenn Agents auf Probleme stoßen.

# §246e BauGB Brandenburg – KI-Agent Contract

## Zweck
Dieses Dokument definiert die exakte Struktur und Anforderungen für KI-Agents, die automatisiert Blog-Content für diese Website erstellen.

**Verbindlicher Quellenhinweis (Stand 14.07.2026):** Inhalte dürfen nicht aus den quarantänisierten Dateien unter `research/evidence/` oder `research/faq/` übernommen werden. Vor jedem Entwurf sind der aktuelle amtliche Normtext und `research/sources/legal-sources.json` zu prüfen. NotebookLM-Ausgaben sind Recherchehinweise, keine Rechtsquelle und keine Freigabe. Für juristische Prüfungen ist ausschließlich das maschinell kontrollierte Notebook-Alias `246e-amtlich` zulässig; das Alias `246e` dient nur der offenen Recherche.

## Verbindliche Sprachregel: klares Deutsch

- Veröffentlichte Texte und sichtbare Bedienelemente verwenden keine unnötigen englischen Begriffe oder Mischformen.
- Begriffe wie „Gatekeeper“, „framed“, „Pillar“, „Screening“, „Claim“ oder „Check“ sind durch verständliche deutsche Formulierungen zu ersetzen.
- Bevorzugte Begriffe sind zum Beispiel „entscheidende Voraussetzung“, „eingeordnet“, „Grundlagenseite“, „Vorprüfung“, „Aussage“, „Prüfung“ und „Prüfliste“.
- Amtliche Abkürzungen, Eigennamen und notwendige technische Bezeichner bleiben zulässig, zum Beispiel BauGB, UVP, SUP, SEO, FAQ, NotebookLM sowie Dateinamen, Routen und Quellcode-Bezeichner.
- Vor Veröffentlichung muss `npm run language:check` erfolgreich sein.

## Content-Typ: Blog-Post (MDX)

Vor jedem Entwurf sind `docs/INHALTSARCHITEKTUR.md` und die vorhandene Inhaltskarte zu prüfen. KI-Sichtbarkeit ist keine eigene Inhaltsart. Eine nahezu gleiche Fassung eines vorhandenen Artikels nur für Google, ChatGPT oder ein anderes Antwortsystem ist unzulässig.

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
updatedDate: 2026-07-14  # Pflicht nach jedem fachlichen Review
updateReason: "Was fachlich oder redaktionell erheblich geändert wurde"
legalAsOf: 2026-07-14  # Stand der geprüften Rechtsquellen
category: "grundlagen" | "100m" | "aussenbereich" | "ablauf" | "faq"
tags: ["Tag1", "Tag2", "Tag3"]  # 3-5 Tags, spezifisch
region: "Brandenburg"  # Immer "Brandenburg"
intent: "owner" | "broker" | "builder" | "municipality"  # Hauptzielgruppe passend zum Beitrag wählen
contentType: "ratgeber" | "nachricht" | "projekt" | "entscheidung"
guideRole: "vertiefung"  # bei Ratgebern; Themenzentren stehen in src/data/editorial-hubs.json
topic: "raeumlicher-zusammenhang"  # kontrolliertes Fachthema aus src/content.config.ts
searchTask: "verstehen" | "vorpruefen" | "vorbereiten" | "reagieren" | "aenderung-verfolgen" | "fall-recherchieren"
primaryIntent: "eindeutiger-technischer-schluessel"
primaryQuery: "Eine natürliche, eindeutige Hauptfrage des Lesers"
parentHub: "/100m-regel-raeumlicher-zusammenhang/"
lifecycleStatus: "aktuell" | "historisch" | "ueberarbeiten" | "zusammenfuehren"
sources:
  - label: "§ 246e BauGB – aktueller Gesetzestext"
    url: "https://www.gesetze-im-internet.de/bbaug/__246e.html"
    type: "primary"
  - label: "§ 36a BauGB – Zustimmung der Gemeinde"
    url: "https://www.gesetze-im-internet.de/bbaug/__36a.html"
    type: "primary"
---
```

Für Nachrichten sind zusätzlich `eventId`, `eventDate` und `sourceStatus` Pflicht. Projekt- und Entscheidungsprofile benötigen die in `docs/INHALTSARCHITEKTUR.md` beschriebenen Vorgangs-, Gemeinde- und Entscheidungsangaben. Vor dem ersten solchen Beitrag muss die vorgesehene Übersichts- und Routenstruktur im Projekt vorhanden sein.

Nachrichten benötigen außerdem `newsKind` und `jurisdiction`; bei laufenden amtlichen Verfahren ist `reviewAfter` Pflicht. Nicht-Ratgeber müssen mindestens eine konkrete Ereignis- oder Projektquelle mit passender `role` und `evidence` angeben. Entscheidungsprofile benötigen eine veröffentlichte Entscheidung mit `role: "decision"` oder `role: "court-decision"` sowie `evidence: "event"`.

### Inhaltsstruktur für Ratgeber (VERBINDLICH)

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
- Mindestens 2 interne Links zu Grundlagenseiten:
  - `/246e-baugb-brandenburg`
  - `/100m-regel-raeumlicher-zusammenhang`
  - `/aussenbereich-brandenburg-246e`
  - `/zustimmung-gemeinde-246e`
- Format: `[Linktext](/url)`

#### 5. Quellen (REQUIRED)
- Mindestens 2 Quellen im Frontmatter
- Offizielle Quellen bevorzugen (Gesetze, Ministerien, Behörden)
- Jede Quelle ausdrücklich als `primary` (Gesetz oder Gesetzesmaterial) oder `secondary` (amtliche FAQ und Verwaltungshinweise) einordnen

### Inhaltsstruktur für Nachrichten, Projekte und Entscheidungen

- **Nachricht:** konkretes Ereignis zuerst, danach belegter Stand, Bedeutung für den zugeordneten Ratgeber, offene Entwicklung und Quellen. Keine künstliche Fragen-und-Antworten-Sektion.
- **Projekt:** eindeutig belegte Stammdaten, zeitlicher Verlauf, aktueller Verfahrensstand, Entscheidungsstufen und Quellen. Mutmaßungen und nicht öffentliche personenbezogene Angaben entfallen.
- **Entscheidung:** Entscheidungsebene, Datum, Ergebnis, tragende öffentlich belegte Gründe, späterer Verfahrensstand und klare Abgrenzung zwischen Gemeindezustimmung und Baugenehmigung.
- Formatabhängige Pflichtfelder aus `docs/INHALTSARCHITEKTUR.md` gelten zusätzlich.

### Tone of Voice

**DO**:
- Sachlich, aber verständlich
- Direkte Ansprache ("Sie")
- Kurze, klare Sätze
- Öffentlich belegte Beispiele aus Brandenburg
- Praktische Tipps und Checklisten

**DON'T**:
- Amtsdeutsch oder Juristenjargon
- Versprechen oder Garantien
- Rechtliche Beratung suggerieren
- Überverkaufen oder Marketing-Sprech
- Ohne Rechtshinweis arbeiten

### Disclaimer
Jeder Artikel MUSS klar kommunizieren: **"Diese Informationen ersetzen keine Rechtsberatung."**
Dies geschieht automatisch über die ArticleLayout-Komponente.

## Beispiel: Artikelgerüst

Das frühere Kostenbeispiel wurde entfernt: nicht amtlich belegte Kostenkorridore sind kein geeignetes Muster für automatisierten Rechts- und Ratgebercontent.

```mdx
---
title: "Erschließung bei § 246e: Prüfpunkte im Überblick"
description: "Welche Fragen zu Zufahrt, Wasser, Abwasser und Strom bei einem §-246e-Vorhaben früh mit Behörden und Versorgungsträgern geklärt werden sollten."
pubDate: 2025-01-15
updatedDate: 2026-07-14
category: "aussenbereich"
tags: ["Erschließung", "Kosten", "Außenbereich", "Infrastruktur"]
region: "Brandenburg"
intent: "owner"
contentType: "ratgeber"
guideRole: "vertiefung"
topic: "erschliessung"
searchTask: "vorbereiten"
primaryIntent: "erschliessung-vorhaben-pruefen"
primaryQuery: "Erschließung für ein §-246e-Vorhaben vorbereiten"
parentHub: "/aussenbereich-brandenburg-246e/"
lifecycleStatus: "aktuell"
legalAsOf: 2026-07-14
updateReason: "Fachliche Aktualisierung anhand der amtlichen Quellen."
sources:
  - label: "§ 246e BauGB – aktueller Gesetzestext"
    url: "https://www.gesetze-im-internet.de/bbaug/__246e.html"
    type: "primary"
  - label: "§ 35 BauGB – Außenbereich"
    url: "https://www.gesetze-im-internet.de/bbaug/__35.html"
    type: "primary"
---

## Einleitung

Bei einem Vorhaben im [Außenbereich Brandenburg](/aussenbereich-brandenburg-246e) müssen Zufahrt sowie Ver- und Entsorgung früh geklärt werden. Dieser Artikel beschreibt die Prüfpunkte, ohne unbelegte Kosten- oder Genehmigungsprognosen zu verwenden.

## Was bedeutet Erschließung?

Erschließung umfasst alle infrastrukturellen Anbindungen:

- **Verkehrsanbindung**: Zufahrt zum Grundstück
- **Trinkwasser**: Wasseranschluss oder Brunnen
- **Abwasser**: Kanalanschluss oder Kleinkläranlage
- **Energie**: Strom, ggf. Gas

[... weiterer Content ...]

## Häufige Fragen (FAQ)

### Was kostet ein Wasseranschluss im Außenbereich?

Eine belastbare Summe lässt sich ohne Angaben des zuständigen Versorgungsträgers, Lage und Leitungsweg nicht nennen. Holen Sie eine aktuelle, grundstücksbezogene Auskunft ein.

### Brauche ich eine Kleinkläranlage?

Das hängt von Anschlussmöglichkeit, örtlicher Satzung, wasserrechtlichen Anforderungen und der Entscheidung der zuständigen Stellen ab.

[... weitere FAQs ...]

## Fazit

Die Erschließung im Außenbereich kann erhebliche Kosten verursachen. Klären Sie frühzeitig mit der Gemeinde und Versorgern, welche Kosten auf Sie zukommen.

Mehr Informationen zu [§246e BauGB in Brandenburg](/246e-baugb-brandenburg) und zur [Gemeinde-Zustimmung](/zustimmung-gemeinde-246e) finden Sie in unseren Artikeln.
```

## Erstellung mehrerer Beiträge

Bei der Erstellung mehrerer Artikel:

1. Erstelle einen Index mit geplanten Titeln
2. Erzeuge jeden Artikel als separate MDX-Datei
3. Vermeide inhaltliche Überschneidungen
4. Verlinke sinnvoll zwischen den Artikeln
5. Führe vor jedem weiteren Entwurf `npm run seo:overlap:strict` aus
6. Bei einem Fund zuerst vorhandenen Inhalt aktualisieren oder die Abgrenzung dokumentieren; nie automatisch zusammenführen

## Qualitätskriterien

Für alle Inhaltsarten gilt:

- [ ] Frontmatter vollständig und korrekt
- [ ] Keine Rechtschreibfehler
- [ ] Verständlicher Ton (keine Fachsprache ohne Erklärung)
- [ ] Brandenburg-Fokus erkennbar
- [ ] Gewählte Hauptzielgruppe wird konsequent angesprochen
- [ ] Inhaltsabsicht und Hauptfrage im Bestand eindeutig
- [ ] Keine gesonderte, doppelte KI-Fassung

Für Ratgeber gilt zusätzlich:

- [ ] Einleitung 100-120 Wörter
- [ ] 3-6 strukturierte H2-Abschnitte
- [ ] FAQ mit 5-8 Fragen
- [ ] Mindestens 2 interne Links zu Grundlagenseiten
- [ ] Mindestens 2 Quellen

Für Nachrichten, Projekte und Entscheidungen gilt stattdessen die jeweilige Struktur und Quellenbindung aus `docs/INHALTSARCHITEKTUR.md`; mindestens ein Textlink muss auf das zugehörige Themenzentrum führen.

## Technische Hinweise

- MDX erlaubt Import von Komponenten: Nutze dies für Callouts, Tabellen, etc.
- Bilder können unter `public/` abgelegt und eingebunden werden
- Die Site generiert automatisch Sitemap und RSS
- Keine manuelle Konfiguration der Routen nötig

---

## Definition of Done (Content)

**Vor Publish/Merge MUSS jeder Content diese Checkliste erfüllen:**

### ✅ Sourcing & Accuracy
- Jede harte Behauptung hat eine Quelle (Primärquellen zuerst: Gesetz, BT-Drs., amtliche Begründung)
- 100m IMMER als "Leitplanke aus Gesetzesbegründung (BT-Drs. 21/781, S. 28)", NIEMALS als Normtext
- Keine unsourced Praxisbehauptungen oder lokale Beispiele ohne öffentliche Belege
- Keine schnell veraltenden Listen/Zahlen ohne "Stand: Datum + Quelle + Update-Hinweis"

### ✅ Technical SEO
- Title/Description gesetzt, Canonical vorhanden
- SourcesBox verwendet (Primär → Sekundär)
- Interne Links zu Grundlagenseiten gesetzt
- `npm run seo:overlap:strict` und `npm run seo:overlap:test` erfolgreich

### ✅ Build & Preview
- `npm run build` → Exit Code 0
- `npm run preview` → mind. 2 Seiten manuell geprüft
- Safety grep clean (keine "30%", "19 Gemeinden", "HOAI", etc. in aktiven Seiten)

**Details:** Siehe [CONTENT_DOD.md](./CONTENT_DOD.md)

---

## Pflegehinweis

Diese Vereinbarung wird angepasst, wenn bei der Anwendung neue belegte Probleme oder Anforderungen auftreten.

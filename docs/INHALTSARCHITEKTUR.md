# Inhaltsarchitektur und Schutz vor Überschneidungen

Dieses Dokument ist die verbindliche Kurzfassung für neue und geänderte Inhalte. Die Herleitung und Quellen stehen in `research/SEO_KANNIBALISIERUNG_KI_SICHTBARKEIT_2026-07-15.md`.

## Grundregel

Pro dauerhaftem Informationsbedürfnis, Hauptzielgruppe und räumlichem Geltungsbereich existiert genau eine maßgebliche Seite.

Gleiche Fachbegriffe sind erlaubt. Eine zweite Adresse benötigt jedoch eine andere Leseraufgabe oder ein konkret bestimmtes Ereignis beziehungsweise Projekt.

## Inhaltsarten

- `ratgeber`: dauerhafte Rechts-, Verfahrens- oder Vorprüfungsfrage
- `nachricht`: konkretes Ereignis mit Datum und amtlicher Quelle
- `projekt`: fortlaufende öffentliche Akte eines konkreten Vorhabens
- `entscheidung`: konkrete Zustimmung, Ablehnung oder andere Entscheidungsebene

KI-Sichtbarkeit ist keine Inhaltsart. Es werden keine doppelten Fassungen nur für Google, ChatGPT, Copilot oder Perplexity veröffentlicht.

## Pflichtangaben

Alle Beiträge benötigen mindestens:

```yaml
contentType: "ratgeber"
guideRole: "vertiefung"
topic: "raeumlicher-zusammenhang"
searchTask: "vorpruefen"
primaryIntent: "grundstueck-raeumlichen-zusammenhang-vorpruefen"
primaryQuery: "Räumlichen Zusammenhang eines Grundstücks vorprüfen"
intent: "owner"
region: "Brandenburg"
parentHub: "/100m-regel-raeumlicher-zusammenhang/"
lifecycleStatus: "aktuell"
legalAsOf: 2026-07-14
```

`updatedDate` ist nur zusammen mit `updateReason` zulässig. Das Datum wird nicht geändert, um einen unveränderten Beitrag neuer erscheinen zu lassen.

## Zusätzliche Angaben nach Inhaltsart

### Nachricht

```yaml
contentType: "nachricht"
eventId: "eindeutige-ereigniskennung"
eventDate: 2026-07-15
newsKind: "kommunalpolitik"
jurisdiction: "Beispielgemeinde"
sourceStatus: "amtlich-bestaetigt"
searchTask: "aenderung-verfolgen"
sources:
  - label: "Amtlicher Beschluss"
    url: "https://..."
    type: "primary"
    role: "decision"
    evidence: "event"
```

Zulässige Quellenstände sind `amtlich-bestaetigt`, `amtliches-verfahren` und `behoerdliche-mitteilung`. Ein laufendes amtliches Verfahren benötigt zusätzlich `reviewAfter`. Überschrift und Einleitung müssen Gemeinde beziehungsweise Geltungsbereich, Ereignis und Zeitpunkt erkennen lassen.

Die Ereignisquelle muss zur Nachrichtenart passen: Gesetz oder Gesetzesmaterial bei einer Gesetzesänderung, amtliche Arbeitshilfe bei einer neuen Verwaltungshilfe, veröffentlichte Gerichtsentscheidung bei einem Gerichtsfall, Beschluss oder amtliche Mitteilung bei Kommunalpolitik sowie amtlicher Datensatz oder Mitteilung bei einer Datenaktualisierung.

### Projekt

```yaml
contentType: "projekt"
projectId: "gemeinde-vorhaben-eindeutig"
municipality: "Beispielgemeinde"
projectType: "Wohnungsneubau"
projectStatus: "in-pruefung"
reviewAfter: 2026-08-15
searchTask: "fall-recherchieren"
sources:
  - label: "§ 246e BauGB – Gesetzestext"
    url: "https://www.gesetze-im-internet.de/bbaug/__246e.html"
    type: "primary"
    role: "law"
    evidence: "legal-context"
  - label: "Amtliche Projektbekanntmachung"
    url: "https://..."
    type: "secondary"
    role: "other-official"
    evidence: "project"
```

### Entscheidung

```yaml
contentType: "entscheidung"
projectId: "gemeinde-vorhaben-eindeutig"
municipality: "Beispielgemeinde"
projectType: "Wohnungsneubau"
decisionDate: 2026-07-15
decisionStatus: "zugestimmt"
decisionLevel: "gemeinde"
decisionAuthority: "Gemeindevertretung Beispielgemeinde"
decisionReference: "Beschluss 12/2026"
decisionReasonSummary: "Belegte Kurzfassung der veröffentlichten tragenden Erwägungen."
searchTask: "fall-recherchieren"
sources:
  - label: "Veröffentlichter Beschluss"
    url: "https://..."
    type: "primary"
    role: "decision"
    evidence: "event"
```

Zulässige Ergebnisse: `zugestimmt`, `abgelehnt`, `teilweise-zugestimmt`, `offen`. Zulässige Ebenen: `gemeinde`, `bauaufsicht`, `gericht`, `sonstige`.

Eine Gemeindezustimmung ist keine Baugenehmigung. Ergebnis, Gründe und Verfahrensstand dürfen nur so weit dargestellt werden, wie öffentliche Primärquellen sie tragen. Entscheidungsprofile benötigen eine Quelle mit der Rolle `decision` oder `court-decision`.

Zulässige Quellenrollen sind `law`, `legislative-material`, `guidance`, `decision`, `court-decision`, `data` und `other-official`. Die zusätzliche Angabe `evidence` bezeichnet, ob die Quelle den rechtlichen Hintergrund (`legal-context`), das konkrete Ereignis (`event`) oder das konkrete Projekt (`project`) belegt. Bei Ratgebern bleiben Rolle und Belegfunktion vorerst freiwillig. Nachrichten brauchen eine zur Nachrichtenart passende Ereignisquelle; Projekte eine konkrete Projekt-, Daten- oder Entscheidungsquelle; Entscheidungen eine veröffentlichte Entscheidung oder Gerichtsentscheidung.

## Vor dem Entwurf

1. `src/data/editorial-hubs.json` und bestehende Frontmatter-Angaben prüfen.
2. Hauptfrage als natürlichen Satz formulieren.
3. `primaryIntent` und normalisierte Hauptfrage mit dem Bestand vergleichen.
4. Bei gleicher Leseraufgabe die vorhandene Seite aktualisieren.
5. Bei anderer Aufgabe die Abgrenzung in Titel, Beschreibung und Einleitung sichtbar machen.
6. Nachricht oder Fall nur mit konkreter Primärquelle beginnen.

## Automatische Prüfung

```bash
npm run seo:overlap
npm run seo:overlap:strict
npm run seo:overlap:test
```

Der strenge Lauf und die Tests sind Bestandteil von `npm run check`.

Die Prüfung blockiert unter anderem:

- doppelte Inhaltsabsichten und Hauptfragen;
- mehr als ein Themenzentrum pro Thema;
- fehlende oder unbekannte übergeordnete Seiten;
- aktive Inhalte hinter einer Weiterleitung;
- fehlende formatabhängige Pflichtangaben.

Starke Wortüberschneidungen erzeugen einen Prüfhinweis. Der strenge Prüflauf stoppt die Veröffentlichung, solange der Fund ungeklärt ist. Eine fachlich begründete Ausnahme wird mit beiden Adressen, der ausgegebenen Prüfsignatur, Begründung, Prüfdatum und Ablaufdatum in `src/data/content-overlap-decisions.json` dokumentiert:

```json
{
  "routes": ["/erste-seite/", "/zweite-seite/"],
  "fingerprint": "vom-prueflauf-ausgegebene-signatur",
  "rationale": "Begründung der nachweisbar unterschiedlichen Leseraufgaben.",
  "reviewedAt": "2026-07-15",
  "expiresAt": "2026-10-15"
}
```

Die Ausnahme gilt nur für den exakt geprüften Inhaltsstand. Eine spätere Änderung erzeugt eine neue Signatur und verlangt eine neue Prüfung. Unmögliche, zukünftige oder abgelaufene Prüfdaten werden nicht akzeptiert. Die Ausnahme führt niemals automatisch zu Löschung, Zusammenführung oder Weiterleitung.

Für eine maschinenlesbare Bestandsausgabe:

```bash
node scripts/content-overlap-check.mjs --json
```

## Redaktionelle Entscheidung bei einem Fund

1. **Unterschiedliche Aufgabe belegt:** beide Seiten behalten und deutlicher trennen.
2. **Gleiche Aufgabe:** stärkere Seite wählen, Inhalte fachlich zusammenführen, alte Adresse dauerhaft weiterleiten.
3. **Historisches Ereignis:** Nachricht behalten, historischen Stand zeigen und auf aktuellen Ratgeber verweisen.
4. **Kein Ersatz:** echten Status 404 oder 410 verwenden.

`noindex` wird nicht verwendet, um doppelte Seiten zu kanonisieren.

## Messung nach Produktivstart

Die statische Prüfung wird später durch Suchdaten ergänzt:

- Google-Suche und generative Google-Suche getrennt erfassen;
- Bing-Suche und Copilot-Zitate getrennt erfassen;
- ChatGPT-Besuche erst nach freigegebener, datenschutzgerechter Auswertung erfassen;
- alle Werte derselben kanonischen Adresse und Inhaltsabsicht zuordnen;
- Funde als Prüfaufgabe anlegen, Inhalte nicht automatisch umschreiben.

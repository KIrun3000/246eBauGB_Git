# Content Definition of Done (DoD)

**Ziel:** Sicherstellen, dass jeder publizierte Content (Pillars, Blog, FAQ) den Qualitäts- und Sourcing-Standards entspricht.

---

## ✅ Pre-Publish Checklist

### Verbindliche Sprachregel

- [ ] **Klares Deutsch ohne unnötige englische Begriffe oder Mischformen**
  - Begriffe wie „Gatekeeper“, „framed“, „Pillar“, „Screening“, „Claim“ oder „Check“ werden durch verständliche deutsche Formulierungen ersetzt.
  - Bevorzugte Begriffe sind zum Beispiel „entscheidende Voraussetzung“, „eingeordnet“, „Grundlagenseite“, „Vorprüfung“, „Aussage“, „Prüfung“ und „Prüfliste“.
  - Amtliche Abkürzungen, Eigennamen und notwendige technische Bezeichner bleiben zulässig, zum Beispiel BauGB, UVP, SUP, SEO, FAQ, NotebookLM sowie Dateinamen, Routen und Quellcode-Bezeichner.
  - `npm run language:check` ist erfolgreich.

### 1. Sourcing & Accuracy

- [ ] **Amtliche Quellen auf Änderungen geprüft**
  - `npm run sources:check` ist erfolgreich
  - Vor rechtlicher Recherche auf dem Mac mini ist `npm run notebooklm:check` erfolgreich
  - Für die Rechtsprüfung ausschließlich das Notebook-Alias `246e-amtlich` verwenden; `246e` bleibt ein breites Recherche-Notebook
  - Bei Hash-Änderung keine automatische Textfreigabe: Claim-für-Claim-Review durchführen
  - NotebookLM und andere LLM-Ausgaben niemals als Rechtsquelle behandeln
  - Dateien mit `QUARANTÄNE` sowie `*.perplexity-raw.md` nicht für neue Inhalte verwenden

- [ ] **Jede harte Behauptung hat eine Quelle**
  - Primärquellen (Gesetz, BT-Drs., amtliche Begründung) zuerst
  - Sekundärquellen (BMWSB FAQ, Behörden-FAQs) klar als solche gekennzeichnet
  - Länder-FAQs nur als "Arbeitshilfe/Beispiel anderes Bundesland" labeln

- [ ] **100m-Regel korrekt geframed**
  - IMMER als "Leitplanke aus der Gesetzesbegründung (BT-Drs. 21/781, S. 28)"
  - NIEMALS als Gesetzestext oder starre Norm
  - Zitat explizit mit Quelle versehen

- [ ] **Keine unsourced Praxisbehauptungen**
  - Keine Aussagen wie "Potsdam ist restriktiv" ohne öffentliche Belege
  - Keine konkreten Orts-/Fluss-/Park-Beispiele ohne Quellenbeleg
  - Lieber generisch formulieren als unbelegte Spekulationen

- [ ] **Keine schnell veraltenden Listen/Zahlen**
  - Wenn Zahlen: "Stand: [Datum]" + Quelle + "stets aktuell prüfen"
  - Keine festen Gemeindelisten (z. B. "19 Gemeinden") ohne Verweis auf aktuelle Verordnung
  - Keine HOAI-Kosten oder spekulative Kostenschätzungen ohne Kontext

### 2. Content Quality

- [ ] **Rechtshinweis vorhanden**
  - "Keine Rechtsberatung" prominent platziert
  - Verweis auf Fachanwalt/Bauaufsicht für verbindliche Auskünfte

- [ ] **SourcesBox verwendet**
  - Primärquellen vor Sekundärquellen
  - Label klar und verständlich
  - Links funktional und erreichbar

- [ ] **Interne Verlinkung**
  - Links zu relevanten Pillar-Pages gesetzt
  - Konsistente URL-Struktur (trailing slash)
  - Keine toten Links

### 3. Technical SEO

- [ ] **Meta-Daten gesetzt**
  - `title` aussagekräftig und SEO-optimiert
  - `description` prägnant (150-160 Zeichen)
  - Canonical URL korrekt (absolut, basierend auf Astro.site)

- [ ] **Struktur sauber**
  - H1 einmalig pro Seite
  - H2-H6 hierarchisch korrekt
  - Semantisches HTML (Listen, Tabellen, Blockquotes)

### 4. Build & Preview

- [ ] **Build erfolgreich**
  ```bash
  npm run build  # Exit Code 0
  ```

- [ ] **Preview getestet**
  ```bash
  npm run preview
  ```
  - Mindestens 2 Seiten manuell anklicken und prüfen:
    - `/246e-baugb-brandenburg/`
    - `/100m-regel-raeumlicher-zusammenhang/`
  - Sourcen-Boxen korrekt dargestellt
  - Links funktional
  - Layout responsive

- [ ] **Safety Grep durchgeführt**
  ```bash
  grep -rn "30%|19 Gemeinden|Sozialwohnungsquote|HOAI|Potsdam restriktiv" src/ --exclude-dir=node_modules
  ```
  - 0 Treffer in aktiven Seiten (außer admin Tools, Backups, ERRATA)

---

## 🚫 Anti-Patterns (NICHT tun)

- **KEINE** Behauptungen ohne Quelle
- **KEINE** "100m = automatisch ok/nicht ok" (immer Einzelfall betonen)
- **KEINE** konkreten Kosten ohne "Orientierungswert, nicht rechtsverbindlich"
- **KEINE** Gemeinde-Listen im Fließtext (immer Verweis auf aktuelle Verordnung)
- **KEINE** Spekulationen über Verwaltungspraxis ohne öffentliche Belege
- **KEINE** veralteten Daten ohne "Stand" + "stets aktuell prüfen"

---

## 📋 Vor Merge/Deploy

- [ ] Alle Punkte der Checklist erfüllt
- [ ] ERRATA aktualisiert (falls Patches erforderlich waren)
- [ ] Commit Message beschreibt Änderungen nachvollziehbar
- [ ] Build passes, Preview tested
- [ ] Safety grep clean

---

**Letzte Aktualisierung:** 14. Juli 2026 (A3 – Frischeprüfung und maschinell geprüfte NotebookLM-Quellentrennung)

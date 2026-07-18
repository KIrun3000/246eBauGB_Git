# Produktionsfreigabe vom 18. Juli 2026

## Entscheidung

Die bestehende Vercel-Verknüpfung darf nach erfolgreicher Zusammenführung in den geschützten `main`-Branch automatisch eine Produktionsbereitstellung auslösen. Vorschauen auf `codex/*`-Branches bleiben unverändert aktiv.

## Geprüfte Freigabepunkte

- Hauptdomain `246ebaugb.de` und dauerhafte Weiterleitungen der vier Nebendomains
- Impressum, Datenschutzerklärung und öffentliche Kontaktadresse `luca@ingenbleek.io`
- Google-Search-Console-Bestätigung, Sitemap und wöchentlicher Bericht
- Google-Kostenwarnung für das Projekt `baugb246e-seo-berichte`: monatlich 1 Euro mit Meldungen bei 50, 90 und 100 Prozent; keine Ausgabensperre
- Einwilligungsverwaltung für die freiwillige Besuchsmessung
- keine Google-Analytics- oder Tag-Manager-Anfrage vor ausdrücklicher Einwilligung
- Ausschluss des unfertigen Grundstücksprüfers aus der Indexierung
- vollständiger Projektcheck mit `npm run check`
- amtliche Quellen- und NotebookLM-Prüfung mit `npm run legal:check`
- keine im Repository gespeicherten Zugangs- oder Abrechnungsdaten

## Infrastrukturprüfung

Die Änderung betrifft ausschließlich die Vercel-Bereitstellungsfreigabe für `main` und die zugehörige Betriebsdokumentation. Branch-Vorschauen, GitHub-Schutzregeln, Qualitätsprüfungen und zusätzliche Rechts- beziehungsweise Infrastrukturprüfungen bleiben bestehen. Die Änderung erweitert keine Anwendungsberechtigungen und legt keine Geheimnisse ab.

## Prüfung nach der ersten Bereitstellung

Nach der Zusammenführung werden mindestens geprüft:

1. Erreichbarkeit von Startseite, Impressum, Datenschutz, `robots.txt` und Sitemap,
2. Weiterleitung aller Nebendomains auf die kanonische Hauptdomain,
3. sichtbare Einwilligungsabfrage und erreichbare Datenschutzeinstellungen,
4. keine Besuchsmessung vor Einwilligung,
5. Laden des Google Tag Managers erst nach Zustimmung,
6. erfolgreicher öffentlicher SEO-Prüflauf.

## Rückfallstrategie

Bei einem Fehler wird in Vercel zunächst die letzte funktionierende Produktionsbereitstellung wiederhergestellt. Die dauerhafte Korrektur erfolgt anschließend über einen neuen `codex/*`-Branch und einen geprüften Pull Request. DNS- oder Zugangsdaten werden nur verändert, wenn der Fehler nachweislich dort liegt.

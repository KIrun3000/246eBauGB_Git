# NotebookLM-Quellenpolicy für 246eBauGB

**Stand:** 14. Juli 2026

NotebookLM dient in diesem Projekt als Recherche- und Synthesehilfe. Es ist weder Rechtsquelle noch Freigabestelle. Jede rechtliche Aussage muss vor Veröffentlichung auf die aktuelle amtliche Primärquelle zurückgeführt werden.

## Zulässige Quellen

1. Aktuelle Normtexte aus `research/sources/legal-sources.json`
2. Bundesgesetzblatt und Bundestagsdrucksachen, sofern Entwurfsstand und endgültige Fassung klar getrennt werden
3. Aktuelle amtliche FAQ oder Anwendungshinweise von Bund, Ländern und zuständigen Behörden
4. Eigene, bereits mit Datum und Legal-Review dokumentierte Inhalte

## Nicht importieren

- Dateien mit dem Hinweis `QUARANTÄNE`
- `*.perplexity-raw.md`
- undatierte LLM-Ausgaben oder Web-Zusammenfassungen
- Blogartikel ohne `updatedDate`, wenn sie als fachliche Quelle statt nur als zu prüfender Gegenstand dienen sollen
- Sekundärquellen als alleinigen Beleg für Norminhalt, Fristen oder Rechtsbehelfe

## Arbeitsablauf für neue oder aktualisierte Artikel

1. `npm run sources:check` ausführen.
2. Amtliche Quellen als Notebook-Quellen hinzufügen; Abrufdatum dokumentieren.
3. Eine Claim-Matrix erstellen: Aussage, Fundstelle, Geltungsstand, Unsicherheit.
4. Entwurf erstellen und jede harte Rechtsbehauptung gegen die Fundstelle prüfen.
5. SEO und Verständlichkeit erst nach der Sachprüfung optimieren.
6. `updatedDate` setzen, Auditnotiz ergänzen und Legal-Review-Gate im PR beachten.

## Umgang mit einem Änderungsalarm

Wenn der gespeicherte Normtext-Hash nicht mehr passt, wird **nicht** automatisch ein neuer Hash übernommen. Zuerst werden Änderung, Inkrafttreten und betroffene Aussagen ermittelt. Danach werden Artikel und Faktensammlungen angepasst, ein zweites Legal-Review eingeholt und erst dann Hash sowie Prüfdatum aktualisiert.

# NotebookLM-Integrations- und Quellenaudit

**Prüfstand:** 14. Juli 2026

**Gegenstand:** NotebookLM-Anbindung auf dem zentralen Mac mini, Quellenbestand des Projekt-Notebooks und Eignung für die rechtliche Qualitätskontrolle der Website

## Ergebnis

- Die NotebookLM-CLI/MCP-Anbindung ist installiert, authentifiziert und kann Notebooks, Quellen, Abfragen sowie Studio-Inhalte verwalten.
- Das vorhandene Alias `246e` verweist auf das breite Recherche-Notebook `Projekt §246e BauGB`. Es enthält 29 Quellen unterschiedlicher Qualität und bleibt deshalb auf Themenfindung und Gegenrecherche beschränkt.
- Eine unbeschränkte Probeabfrage im breiten Notebook stützte eine umfangreiche Antwort nur auf die allgemeine Seite „Aktuelles - Götze Rechtsanwälte“. Die Fundstellen trugen wesentliche Aussagen nicht. Das Notebook ist damit ohne Quellenbegrenzung nicht publikationsgeeignet.
- Für Rechts- und Tatsachenprüfungen wurde das getrennte Alias `246e-amtlich` mit 13 amtlichen Quellen aus `research/sources/legal-sources.json` angelegt.
- Eine Probeabfrage im amtlichen Prüf-Notebook verwendete passend den Gesetzestext, Bundesinformationen sowie die Brandenburger FAQ-Blöcke E und F. Die ausgegebenen Fundstellen waren den jeweiligen Aussagen zugeordnet.
- `npm run notebooklm:check` gleicht Notebook-ID, Titel und den vollständigen Quellenbestand mit `research/sources/notebooklm-notebooks.json` ab. Fehlende oder zusätzliche Quellen führen zu einem Fehler.

## Verhältnis zu den bestehenden Website-Inhalten

Die NotebookLM-Einrichtung hat keine Website-Aussage automatisch verändert oder freigegeben. Am Prüfstand waren folgende Kontrollen erfolgreich:

- 11 Blogartikel: Struktur-, Quellen- und Risikophrasenprüfung ohne Befund
- 26 Inhaltsdateien: Sprachprüfung ohne unnötige englische Begriffe
- 13 amtliche Quellen: erreichbar, erwartete Kernaussagen beziehungsweise geprüfte Dokument-Hashes unverändert
- vollständiger Astro-Build: erfolgreich
- gerenderte SEO-Prüfung: Titel, Beschreibung, kanonische Adresse und genau eine H1 ohne Befund

Damit liegt kein neuer Änderungsalarm für die überwachten Rechtsquellen vor. Diese technische Feststellung ersetzt keine neue juristische Einzelfallprüfung, wenn ein Artikel inhaltlich verändert wird.

## Verbindlicher Arbeitsablauf

1. `npm run sources:check`
2. `npm run notebooklm:check`
3. Abfrage ausschließlich im Alias `246e-amtlich`
4. Jede wesentliche Aussage an der konkreten amtlichen Fundstelle kontrollieren
5. Inhalt ändern und `updatedDate` nur nach tatsächlichem fachlichem Review setzen
6. unabhängige Zweitprüfung und Legal-Review-Gate im Pull Request dokumentieren

## Grenzen

- NotebookLM ist keine amtliche Quelle und keine Rechtsberatung.
- Eine passende NotebookLM-Fundstelle beweist nicht automatisch die rechtliche Schlussfolgerung.
- Neue oder geänderte amtliche Quellen werden zuerst im Projektmanifest geprüft. Der gespeicherte Hash oder das Prüfdatum wird niemals automatisch übernommen.
- Das breite Recherche-Notebook darf für Gegenpositionen und Themenideen genutzt werden, aber keine veröffentlichte Rechtsaussage allein tragen.

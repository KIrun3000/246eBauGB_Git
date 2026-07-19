# Betrieb für Suchmaschinen- und KI-Sichtbarkeit

## Zweck

Die Website führt klassische Suche und Sichtbarkeit in KI-Antwortsystemen als zwei Messspuren derselben maßgeblichen Inhalte. Es entstehen keine doppelten Beiträge nur für einzelne Such- oder Antwortsysteme.

Die Messung beantwortet vier unterschiedliche Fragen:

1. Mit welchen Suchanfragen wird die eigene Website bereits gefunden?
2. Welche eigenen Seiten überschneiden sich bei derselben Suchanfrage?
3. Wie groß ist die allgemeine Suchnachfrage in Brandenburg und welche Seiten erscheinen dort?
4. Wird die Website in KI-Antworten zitiert oder von dort besucht?

Diese Fragen dürfen nicht vermischt werden. Insbesondere zeigt die Search Console nur die Sichtbarkeit der eigenen Website. Sie zeigt nicht die gesamte regionale Nachfrage.

## Maschinenlesbare Grundlage

`src/data/seo-observation-model.json` enthält:

- die vier redaktionellen Zielgruppen;
- Themenfelder mit Suchmustern, vorrangiger Zielgruppe und maßgeblicher Zielseite;
- Ausgangssuchfragen für die regionale Nachfrageprüfung;
- feste Prüffragen für KI-Antwortsysteme.

`src/data/search-visibility-baseline.json` trennt:

- amtliche Vertrauensquellen für Rechtsstand und Belegführung;
- redaktionelle und gewerbliche Wettbewerber;
- die beobachteten Suchanfragen, erwarteten eigenen Zielseiten und den nächsten Prüftermin.

`npm run sichtbarkeit:check` prüft Struktur, Zuordnungen, Suchmuster, Zielseiten und die Trennung der Quellengruppen. `npm run sichtbarkeit:frist` stoppt den wöchentlichen Prüflauf, wenn die Wettbewerbsbeobachtung überfällig ist, und erzeugt eine GitHub-Aufgabe.

## Messspur 1: eigene Google-Sichtbarkeit

Der Search-Console-Wochenbericht läuft mittwochs und wertet aus:

- Klicks, Impressionen, Klickrate und Durchschnittsposition der letzten 28 Tage;
- Vergleich mit den vorherigen 28 Tagen;
- Suchanfragen nach Themenfeld und der vorgesehenen redaktionellen Zielgruppe;
- Marken- und allgemeine Suchanfragen;
- noch nicht zugeordnete Suchanfragen;
- konkrete Chancen und Rückgänge;
- mögliche Überschneidungen mehrerer eigener Seiten in einem 90-Tage-Zeitraum.

Die Zielgruppenzuordnung beschreibt die Zielgruppe der passenden Inhalte. Sie ist keine Aussage über Alter, Beruf oder Identität einzelner Suchender.

Der Bericht aktualisiert die feste GitHub-Aufgabe `SEO-Wochenbericht: Search Console`. Er ändert keine Seite selbst. Entscheidungen über Ausbau, Zusammenführung oder Weiterleitung benötigen eine redaktionelle und bei Rechtsinhalten fachliche Prüfung.

Google hat im Juni 2026 eigene Leistungsberichte für generative Suchfunktionen angekündigt. Sie werden nur für einen Teil der Websites schrittweise freigeschaltet; die Werte bleiben zugleich im allgemeinen Leistungsbericht enthalten. Sobald der getrennte Bericht in der Search Console der Website erscheint, wird er als zusätzliche Ansicht geprüft. Die derzeit dokumentierte Search-Console-Schnittstelle bietet keine verlässliche eigene Brandenburg-Dimension für Suchanfragen.

Quellen:

- [Google: Berichte zu generativen Suchfunktionen in der Search Console](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)
- [Google: Search-Analytics-Schnittstelle und verfügbare Dimensionen](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)

## Messspur 2: allgemeine Nachfrage und Wettbewerber in Brandenburg

Der hinterlegte Ausgangsbestand vom 19. Juli 2026 umfasst vier Suchfelder:

- `246e BauGB`;
- `Bau Turbo Brandenburg Grundstück`;
- `100 Meter Regel 246e BauGB`;
- `Gemeindezustimmung 246e BauGB`.

Die neue Domain war in dieser regionalisierten Momentaufnahme noch nicht unter den zuerst ausgegebenen unbezahlten Treffern. Das widerspricht der ersten Search-Console-Impression mit Position 8 nicht: Suchergebnisse schwanken nach genauer Anfrage, Ort, Gerät, Zeitpunkt und Rechenzentrum.

Amtliche Seiten werden nicht als redaktionelle Wettbewerber behandelt. Sie sind vorrangige Beleg- und Vertrauensquellen. Beobachtet werden daneben unter anderem Fachverlage, Kanzleien, Berufsvertretungen, Haus-und-Grund-Angebote und Regionalmedien.

Die allgemeine monatliche Nachfrage wird später aus dem Google-Ads-Keyword-Planer für Brandenburg übernommen. Google verlangt dafür ein vollständig eingerichtetes Google-Ads-Konto mit Abrechnungsangaben. Kleine regionale Schätzungen können ungenau sein und werden deshalb als Schätzwerte, nicht als exakte Nutzerzahlen geführt.

Quellen:

- [Google Ads: Keyword-Planer verwenden](https://support.google.com/google-ads/answer/7337243)
- [Google Ads: Suchvolumen und Prognosen](https://support.google.com/google-ads/answer/3022575)

## Messspur 3: Verweise aus KI-Antwortsystemen

Der neue KI-Verweisbericht wertet nach Einwilligung gemessene Besuche aus:

- ChatGPT;
- Perplexity;
- Microsoft Copilot;
- Google Gemini;
- Claude.

Er zeigt Herkunft und Zielseiten nur ab drei Sitzungen. Darunter wird lediglich gemeldet, dass die Berichtsschwelle nicht erreicht wurde. Der Bericht misst Besuche, nicht bloße Nennungen ohne Klick.

OpenAI kennzeichnet Verweise aus der ChatGPT-Suche mit `utm_source=chatgpt.com`. Die technische Prüfung stellt wöchentlich sicher, dass `OAI-SearchBot` und `Bingbot` nicht vollständig gesperrt sind. Die getrennte Entscheidung über eine Freigabe für Modelltraining wird dadurch nicht verändert.

Das bestehende kurzlebige Google-Dienstkonto hat seit dem 19. Juli 2026 ausschließlich die Rolle `Betrachter` für die Analytics-Property `545814927`; Kosten- und Umsatzmesswerte sind zusätzlich gesperrt. Die Google Analytics Data API ist im Projekt `baugb246e-seo-berichte` aktiviert. Es wird kein dauerhafter Schlüssel gespeichert. Der Bericht ist mit der GitHub-Variablen `ANALYTICS_REPORT_ENABLED=true` freigeschaltet, läuft mittwochs als eigener Auftrag neben der Search-Console-Auswertung und aktualisiert die feste GitHub-Aufgabe `KI-Verweisbericht: freiwillige Besuchsmessung`.

Quelle:

- [OpenAI: Hinweise für Herausgeber und Entwickler](https://help.openai.com/de-de/articles/12627856-publisher-und-entwickler-faq)

## Messspur 4: Zitate in Bing und Copilot

Bing stellt seit Februar 2026 einen eigenen Bericht zur KI-Sichtbarkeit bereit. Er zeigt zitierte Seiten, zugrunde liegende Suchfragen und zeitliche Entwicklungen in Bing- und Copilot-Antworten. Die bestätigte Google-Search-Console-Property kann in Bing Webmaster Tools übernommen werden; dadurch lassen sich Website und Sitemap ohne zweiten DNS-Nachweis einrichten.

`246ebaugb.de` wurde am 19. Juli 2026 mit dem Projektkonto aus der Google Search Console in Bing Webmaster Tools übernommen. Die kanonische Sitemap `https://246ebaugb.de/sitemap-index.xml` wurde erfolgreich zur Verarbeitung eingereicht. Der KI-Leistungsbericht ist erreichbar und weist zum Einrichtungszeitpunkt null Zitate aus. Bing weist darauf hin, dass die erste Datenverarbeitung bis zu 48 Stunden dauern kann.

Diese Messung bleibt kontogebunden. Solange keine dokumentierte Programmierschnittstelle für den KI-Bericht verwendet wird, wird sie monatlich anhand der in `seo-observation-model.json` hinterlegten Prüffragen kontrolliert. Werte werden nur mit Datum, System und sichtbarem Beleg in den Bestand übernommen.

Quellen:

- [Bing: KI-Leistungsbericht in den Webmasterwerkzeugen](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
- [Bing: Websites aus der Google Search Console übernehmen](https://blogs.bing.com/webmaster/september-2019/Import-sites-from-Search-Console-to-Bing-Webmaster-Tools)

## Entscheidungsregeln

1. Neue Suchanfrage mit vorhandener Leseraufgabe: bestehende maßgebliche Seite verbessern.
2. Neue Suchanfrage mit eigener Leseraufgabe: Abgrenzung gegen den Bestand prüfen, dann gegebenenfalls neue Seite planen.
3. Mehrere eigene Seiten für dieselbe Suchanfrage: Ursache im 90-Tage-Bericht prüfen; nichts automatisch löschen oder weiterleiten.
4. Wettbewerber behandelt eine unbeantwortete Frage: Primärquellen prüfen und die eigene Informationslücke schließen, nicht den Text nachahmen.
5. KI-System nennt oder zitiert die Website nicht: keine künstliche Zweitfassung erstellen; Quellenklarheit, direkte Antworten, Struktur und Belegabdeckung der maßgeblichen Seite verbessern.
6. Rang- oder Zitierwerte ohne belastbaren Zugriff: als unbekannt kennzeichnen, niemals schätzen oder erfinden.

## Später benötigter Nachfragezugang

Für regionale Suchvolumina kommt später ein vollständig eingerichtetes Google-Ads-Konto für den Keyword-Planer hinzu. Dies ist keine Lücke in der Messung der eigenen Sichtbarkeit, sondern die getrennte Messung der allgemeinen Nachfrage. Bis dahin werden keine angeblichen Brandenburg-Suchvolumina veröffentlicht.

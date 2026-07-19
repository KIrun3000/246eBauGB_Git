# SEO-Betrieb: öffentlich, messbar und redaktionell sicher

## Ziel des ersten Pakets

Der vorhandene Blog wird unter einer einzigen Hauptdomain öffentlich, indexierbar und technisch überwacht. Neue Inhalte entstehen nicht auf Vorrat, sondern aus belegten Leserfragen, amtlichen Änderungen und später aus Daten der Google Search Console.

Das Paket ist abgeschlossen, wenn:

1. `https://246ebaugb.de` öffentlich und ohne Anmeldung erreichbar ist,
2. die vier weiteren Domains dauerhaft auf die Hauptdomain weiterleiten,
3. die im Impressum und in der Datenschutzerklärung genannte Kontaktadresse funktioniert,
4. Google Search Console die Domain bestätigt und die Sitemap verarbeitet,
5. technische und redaktionelle Prüfungen automatisch laufen,
6. Herausgeber, Quellenmethode und KI-Unterstützung transparent sind,
7. das unfertige Kartenwerkzeug nicht indexiert und nicht als fertige Leistung beworben wird.

## Betriebsstand am 18. Juli 2026

- `246ebaugb.de` ist die bestätigte Hauptdomain; die vier weiteren Domains leiten dauerhaft auf sie weiter.
- Die öffentliche Kontaktadresse ist `luca@ingenbleek.io`.
- Die Domain ist in der Google Search Console bestätigt, die Sitemap ist eingereicht und der wöchentliche Bericht ist eingerichtet.
- Für das Google-Projekt `baugb246e-seo-berichte` warnt ein monatliches Budget von 1 Euro bei 50, 90 und 100 Prozent. Es ist eine Kostenwarnung, keine technische Ausgabensperre.
- Google Tag Manager und Google Analytics sind technisch vorbereitet, laden aber erst nach ausdrücklicher Einwilligung.
- Das kurzlebige Google-Dienstkonto besitzt für Analytics nur Betrachterrechte ohne Kosten- und
  Umsatzmesswerte; die Analytics-Berichtsschnittstelle ist aktiviert.
- `246ebaugb.de` ist aus der Search Console in Bing Webmaster Tools übernommen; die Sitemap ist
  eingereicht und der Bing-Bericht zu KI-Zitaten ist erreichbar.
- Der unfertige Grundstücksprüfer bleibt von der Indexierung ausgeschlossen.
- Technische, redaktionelle, sprachliche, rechtliche und Quellenprüfungen sind als Veröffentlichungstore eingerichtet.
- Produktionsbereitstellungen erfolgen nach grünen Prüfungen und dokumentiertem Review automatisch aus `main`.

Der Betriebsstand ersetzt keine fortlaufende Prüfung: Änderungen an Recht, Quellen, Datenschutz, externen Diensten oder Infrastruktur durchlaufen weiterhin die jeweils vorgesehene zusätzliche Review-Stufe.

## Domainstrategie

- Hauptdomain: `246ebaugb.de`
- Weiterleitungsdomains: `246e-baugb.de`, `paragraf-246e-baugb.de`, `paragraf246e-baugb.de`, `bau-turbo-246e.de`
- Ziel aller Varianten einschließlich `www`: dauerhaft per HTTP 301 oder 308 auf dieselbe Adresse unter der Hauptdomain
- Sitemap, Canonical-Angaben, strukturierte Daten und öffentliche E-Mail verwenden ausschließlich die Hauptdomain

Es werden keine gleichlautenden Kopien auf mehreren Domains veröffentlicht.

## Zielgruppenmodell

### 1. Grundstückseigentümer am Ortsrand

- Ausgangslage: Gartenland, Hinterland, Wiese oder eine kleinere unbebaute Fläche
- typische Fragen: räumlicher Zusammenhang, Außenbereich, 100-m-Leitplanke, benötigte Unterlagen
- sinnvoller nächster Schritt: Ausgangslage einordnen und fehlende Informationen sammeln
- geschäftlicher Weg: zunächst unverbindliche Einordnung oder Kooperation

### 2. Regionaler Grundstücksmakler

- Ausgangslage: Angebot ohne eindeutig belegte Baulandqualität
- typische Fragen: Welche Unterlagen fehlen? Welche Aussagen sind gegenüber Eigentümern und Käufern vertretbar? Ist eine Zusammenarbeit sinnvoll?
- sinnvoller nächster Schritt: öffentlichen Angebotslink und nicht vertrauliche Eckdaten übermitteln
- geschäftlicher Weg: Maklerkooperation vor Ankauf oder Eigenentwicklung

### 3. Bauwilliger Eigentümer

- Ausgangslage: konkretes Vorhaben wie Aufstockung, zweite Reihe, Nutzungsänderung oder Neubau
- typische Fragen: Anwendungsbereich, Gemeindezustimmung, Verfahren und Fachbelange
- sinnvoller nächster Schritt: Unterlagen und offene Behördenfragen vorbereiten
- geschäftlicher Weg: vorrangig fachliche Orientierung, nicht zwingend eine Zusammenarbeit

Gemeinden und Bauaufsichten sind wichtige Vertrauensleser, im ersten Paket aber keine unmittelbare Vertriebszielgruppe.

## Themenstruktur

Die vier Grundlagenseiten bilden die Themenzentren:

1. § 246e BauGB in Brandenburg
2. räumlicher Zusammenhang und 100-m-Leitplanke
3. Außenbereich
4. Gemeindezustimmung

Jeder Magazinbeitrag soll mindestens auf ein Themenzentrum und zwei passende Vertiefungen verweisen. Die Beitragsseite ergänzt diese Verweise automatisch anhand von Kategorie und Schlagworten.

Inhaltsart, Thema, Leseraufgabe und Zielgruppe werden getrennt erfasst. Dadurch kann dasselbe Thema als dauerhafter Ratgeber, konkrete Nachricht oder belegter Projektfall erscheinen, ohne dieselbe Leserfrage mehrfach zu beantworten. Die verbindlichen Regeln stehen in [INHALTSARCHITEKTUR.md](./INHALTSARCHITEKTUR.md); die ausführliche Herleitung in `research/SEO_KANNIBALISIERUNG_KI_SICHTBARKEIT_2026-07-15.md`.

## KI- und Suchmaschinenregeln

- KI unterstützt Recherche, Gliederung, Gegenprüfung und Verständlichkeit; sie ist keine Rechtsquelle und keine automatische Freigabe.
- Es werden keine massenhaft erzeugten Orts- oder Schlagwortvarianten veröffentlicht.
- Kurze direkte Antworten, klare Überschriften, sichtbare Quellen und nachvollziehbare Aktualisierungsdaten dienen zuerst den Lesern.
- Eine eigene Datei wie `llms.txt` ist für Google nicht erforderlich und wird nicht als Ranking-Abkürzung behandelt.
- KI-Sichtbarkeit wird als eigene Messspur geführt, aber nicht durch doppelte Fassungen vorhandener Artikel erzeugt.
- Suchcrawler und Trainingscrawler sind getrennte Entscheidungen. Eine Änderung der Trainingsfreigabe erfolgt nur nach ausdrücklicher geschäftlicher Entscheidung.
- Strukturierte Daten dürfen nur Angaben wiedergeben, die auch sichtbar auf der Seite stehen.
- Neue rechtliche Aussagen durchlaufen Quellenprüfung, NotebookLM-Gegenprüfung und unabhängige Zweitprüfung gemäß `PROMPT_CONTRACT.md` und `CONTENT_DOD.md`.

Offizielle Google-Dokumentation zu diesen Regeln:

- [Google: hilfreiche, zuverlässige und nutzerorientierte Inhalte](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: generative KI-Inhalte auf Websites](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)
- [Google: Optimierung für generative Suchfunktionen](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

## Automatische Prüfungen

### Bei jeder Änderung

`npm run check` kontrolliert unter anderem:

- Inhaltspflichtfelder und Zielgruppe,
- Sprache und unerwünschte englische Modebegriffe,
- Titel, Beschreibungen, Canonicals und genau eine Hauptüberschrift,
- Indexierbarkeit und Robots-Angaben,
- vorhandene Open-Graph- und Inhaltsbilder,
- interne Verweise,
- strukturierte Beitrags- und WebSite-Daten,
- Sitemap-Inhalt und Ausschluss unfertiger Seiten,
- doppelte Titel und Beschreibungstexte.
- eindeutige Inhaltsabsichten, Hauptfragen und Themenzentren,
- Ähnlichkeit zu vorhandenen Grundlagenseiten und Beiträgen,
- Pflichtangaben für Nachrichten, Projekte und Entscheidungen,
- Aktualisierungsgrund und fachlichen Stand.

### Bei Änderungen an Rechtsinhalten

`npm run legal:check` prüft auf dem Mac mini die 13 amtlichen Ausgangsquellen und ihren Bestand im richtigen NotebookLM-Notizbuch. Dieser Schritt ist ein dokumentiertes Veröffentlichungstor, aber kein Teil des allgemeinen GitHub-Prüflaufs, weil der persönliche NotebookLM-Zugang nur auf dem Mac mini vorliegt. Das Prüfergebnis wird im Pull Request festgehalten.

### Wöchentlich

- `content-freshness.yml` überwacht amtliche Quellen und Prüffristen.
- `seo-live-monitor.yml` ruft die öffentliche Domain, Robots, Sitemap und alle indexierbaren Seiten ab.
- `search-console-report.yml` wertet nach gesonderter Freigabe die Search-Console-Daten der
  vergangenen 28 Tage aus und aktualisiert eine feste GitHub-Aufgabe mit dem Wochenbericht.
- `analytics-referral-report.yml` wertet nach einer gesonderten Lesefreigabe freiwillig gemessene
  Verweise aus KI-Antwortsystemen aus und unterdrückt sehr kleine Fallzahlen.
- Die SEO-Liveprüfung kontrolliert zusätzlich die Erreichbarkeit für `OAI-SearchBot` und `Bingbot`
  sowie die Frist der hinterlegten Wettbewerbsbeobachtung.
- Fehler erzeugen eine GitHub-Aufgabe; Inhalte oder Prüfdaten werden nicht automatisch umgeschrieben.
- Der Prüflauf wird erst nach erfolgreichem Produktivstart mit der GitHub-Variablen `SEO_LIVE_ENABLED=true` freigeschaltet.
- Der Search-Console-Bericht wird erst nach Einrichtung der Google-Arbeitslastidentität mit
  `SEARCH_CONSOLE_REPORT_ENABLED=true` freigeschaltet. Zugangsschlüssel werden nicht im Projekt gespeichert.

## Messung und Optimierung

Google Search Console ist für Suchanfragen und Indexierung angebunden. Zusätzlich kann eine
freiwillige Besuchsmessung mit Google Analytics erfolgen. Google Tag Manager und Google Analytics
werden erst nach einer ausdrücklichen Einwilligung geladen. Werbemessung und personalisierte
Werbung bleiben ausgeschaltet; die Auswahl kann im Fußbereich jeder Seite widerrufen werden.

Ausgewertet werden in einem rollierenden Zeitraum von 28 Tagen:

- indexierte und ausgeschlossene Seiten,
- Suchanfragen und Zielseiten,
- Impressionen, Klicks und Klickrate,
- Darstellungen in generativen Google-Suchergebnissen, soweit im Konto verfügbar,
- Core Web Vitals,
- Seiten mit vielen Impressionen, aber unklarer Suchintention oder schwacher Klickrate.

Erst diese Daten entscheiden über neue Beiträge, Zusammenführungen oder neue Seitenschwerpunkte.
Der Search-Console-Wochenbericht ordnet Suchanfragen den festgelegten Themenfeldern und
redaktionellen Zielgruppen zu. Er meldet Chancen, Rückgänge, noch nicht zugeordnete Suchanfragen
und mögliche Überschneidungen mehrerer Zielseiten über 90 Tage. Er ändert weder Beiträge noch
Weiterleitungen automatisch.

Die allgemeine Suchnachfrage in Brandenburg ist davon getrennt: Die Search Console zeigt nur
Suchanfragen, bei denen die eigene Website sichtbar war. Regionale Nachfragewerte werden erst aus
einem vollständig eingerichteten Google-Ads-Keyword-Planer übernommen und als Schätzwerte
gekennzeichnet. Der Ausgangsbestand zu Suchumfeld, Wettbewerbern, KI-Prüffragen und Zielseiten
steht in `src/data/seo-observation-model.json` und `src/data/search-visibility-baseline.json`.

Google-Analytics-Verweise aus KI-Antwortsystemen können nach der dokumentierten Lesefreigabe
wöchentlich automatisch ausgewertet werden. Der öffentliche Bericht zeigt Herkunft und Zielseite
erst ab drei Sitzungen. Einzelne Besucher oder sehr kleine Fallzahlen werden nicht offengelegt.

Nach dem Produktivstart werden klassische und generative Sichtbarkeit getrennt erfasst, aber derselben kanonischen Seite zugeordnet:

- Google-Suche und der verfügbare Bericht zu generativen Suchfunktionen,
- Bing-Suche und Bing/Copilot-Zitate,
- Verweise aus ChatGPT und anderen Antwortsystemen, soweit sie in der freiwilligen Besuchsmessung erkennbar sind,
- ergänzende Beobachtung weiterer Antwortsysteme ohne behauptete Ranggarantie.

Die Search-Console-Prüfung meldet Suchanfragen, für die mehrere Seiten derselben gepflegten Leseraufgabe sichtbar werden. Sie erzeugt Prüfaufgaben und ändert niemals automatisch Inhalte oder Weiterleitungen.

Die vollständige Betriebsbeschreibung, Quellen und noch nötigen Kontofreigaben stehen in
[SICHTBARKEITSBETRIEB.md](./SICHTBARKEITSBETRIEB.md).

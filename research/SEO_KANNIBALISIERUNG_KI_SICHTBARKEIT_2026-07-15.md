# Recherche: Inhaltsüberschneidungen, Nachrichten, Projektfälle und KI-Sichtbarkeit

**Stand:** 15. Juli 2026

**Geltungsbereich:** öffentliche Inhalte von 246ebaugb.de

**Zweck:** fachliche Grundlage für Inhaltsplanung, Veröffentlichungsprüfung und spätere Erfolgsmessung

## Ergebnis in einem Satz

Pro dauerhaftem Informationsbedürfnis, Zielgruppe und fachlichem Geltungsbereich wird genau eine maßgebliche Seite geführt; Nachrichten und Projektfälle dürfen dasselbe Thema aufgreifen, müssen aber ein konkretes Ereignis oder einen konkreten Vorgang behandeln. KI-Sichtbarkeit wird getrennt gemessen, jedoch nicht durch doppelte „KI-Fassungen“ vorhandener Artikel erzeugt.

## 1. Was mit „Kannibalisierung“ gemeint ist

Google beschreibt keine gesonderte Abstrafung namens „Schlagwort-Kannibalisierung“. Doppelte Inhalte sind nicht automatisch ein Verstoß gegen die Spamrichtlinien. Das praktische Problem entsteht, wenn mehrere Seiten dieselbe Leserfrage nahezu gleich beantworten:

- Suchsysteme müssen zwischen mehreren ähnlichen Adressen wählen;
- Verweise und Messwerte können sich auf mehrere Seiten verteilen;
- Leser erkennen schwerer, welche Seite maßgeblich und aktuell ist;
- mehrere fast gleiche Seiten erhöhen Pflege-, Widerspruchs- und Aktualitätsrisiken;
- unnötige Varianten verbrauchen Abrufkapazität, ohne zusätzlichen Nutzen zu schaffen.

Die Projektregel „eine Seite pro Suchabsicht“ ist daher eine redaktionelle Ableitung, keine wörtliche Google-Vorgabe. Sie wird präzisiert zu:

> Pro dauerhaftem Informationsbedürfnis, Hauptzielgruppe und räumlichem Geltungsbereich existiert genau eine maßgebliche, kanonische Seite.

Mehrere Seiten zum Oberthema § 246e BauGB sind richtig, wenn sie nachweisbar verschiedene Aufgaben erfüllen. Dieselben Fachbegriffe allein sind noch kein Problem.

## 2. Vier getrennte Inhaltsarten

### 2.1 Dauerhafter Ratgeber

Ein Ratgeber beantwortet eine wiederkehrende Rechts-, Verfahrens- oder Vorprüfungsfrage. Er behält seine Adresse und wird bei einer erheblichen Änderung unter derselben Adresse aktualisiert.

Beispiele:

- Bedeutung der 100-Meter-Leitplanke verstehen;
- räumlichen Zusammenhang eines Grundstücks dokumentieren;
- Unterlagen für die Gemeindezustimmung vorbereiten.

Ein neues Datum ohne erhebliche sachliche Änderung ist unzulässig. `updatedDate` benötigt deshalb künftig einen dokumentierten `updateReason`.

### 2.2 Nachricht

Eine Nachricht berichtet über ein eindeutig bestimmtes Ereignis:

- Gesetz oder amtliche Arbeitshilfe wurde geändert;
- Gemeinde veröffentlicht eine Stellungnahme;
- Gemeindevertretung fasst einen Beschluss;
- Gericht oder Behörde entscheidet einen für § 246e bedeutsamen Fall;
- neue amtliche Zahlen oder Karten werden veröffentlicht.

Die Nachricht erhält eine dauerhafte Adresse, ein Ereignisdatum, eine Ereigniskennung und mindestens eine amtliche Ausgangsquelle. Sie erklärt nur, **was jetzt geschehen ist und welche Bedeutung das hat**. Die dauerhafte Rechtsfrage bleibt auf der zugeordneten Grundlagenseite.

Bei einer Rechtsänderung sind zwei Arbeitsschritte nötig:

1. Nachricht zum konkreten Ereignis veröffentlichen.
2. Betroffenen Ratgeber auf derselben Adresse fachlich aktualisieren und auf die Nachricht als Änderungsnachweis verweisen.

Eine Nachricht wird nicht gelöscht, nur weil sie älter wird. Sie wird als historischer Stand gekennzeichnet und verweist auf den aktuellen Ratgeber. Eine Google-Nachrichtensitemap enthält dagegen nur die von Google vorgesehene kurze Zeitspanne; ältere Artikel bleiben in der normalen Sitemap und auf der Website erhalten.

### 2.3 Dauerhaftes Projektprofil

Ein Projektprofil ist die fortlaufende, quellengebundene Akte eines konkreten Vorhabens. Es enthält nur öffentlich belegbare Angaben, etwa Gemeinde, Lage auf angemessener räumlicher Ebene, Projektart, öffentlich bekannten Verfahrensstand, wichtige Daten und Quellen.

Eine neue Nachricht darf auf das Profil verweisen, kopiert aber nicht dessen gesamte Darstellung. Das Profil wird mit neuen belegten Stationen fortgeschrieben.

### 2.4 Entscheidungsprofil

Ein Entscheidungsprofil dokumentiert eine konkrete Zustimmung, Ablehnung, teilweise Zustimmung oder einen noch offenen Verfahrensstand. Es muss unterscheiden zwischen:

- Zustimmung der Gemeinde;
- bauaufsichtlicher Genehmigung oder Ablehnung;
- gerichtlicher Entscheidung;
- sonstiger behördlicher oder politischer Erklärung.

„Zugestimmt“ darf niemals mit „Baugenehmigung erteilt“ gleichgesetzt werden. Gründe werden nur aus veröffentlichten Beschlüssen, Bescheiden, Gerichtsentscheidungen oder amtlichen Mitteilungen übernommen. Eigene Vermutungen über Motive einer Gemeinde sind unzulässig.

## 3. Empfohlene Adressstruktur

Die Inhaltsart und die fachliche Aufgabe werden getrennt:

```text
/246e-baugb-brandenburg/                         dauerhafter Grundratgeber
/blog/grundstueck-raeumlichen-zusammenhang/     praktische Vertiefung
/nachrichten/gemeinde-beschliesst-vorhaben/     konkretes Ereignis
/projekte/vorhaben-gemeinde/                     dauerhafte Projektakte
/entscheidungen/vorhaben-gemeinde-zustimmung/   einzelne Entscheidung
```

Die genauen neuen Übersichtsseiten werden erst angelegt, sobald der erste belegte Inhalt des jeweiligen Typs vorliegt. Leere Bereiche und erfundene Musterfälle werden nicht veröffentlicht.

## 4. Redaktionelle Taxonomie

Jede Seite wird entlang unabhängiger Achsen eingeordnet:

1. **Inhaltsart:** Ratgeber, Nachricht, Projekt oder Entscheidung.
2. **Thema:** zum Beispiel räumlicher Zusammenhang, Gemeindezustimmung, Erschließung oder Umweltprüfung.
3. **Leseraufgabe:** verstehen, vorprüfen, vorbereiten, reagieren, Änderung verfolgen oder Fall recherchieren.
4. **Hauptzielgruppe:** Grundstückseigentümer, Makler, Bauwillige oder Kommune.
5. **Geltungsbereich:** Bund, Brandenburg oder konkrete Gemeinde.
6. **übergeordnete Seite:** fachlich maßgebliches Themenzentrum.

Dasselbe Thema darf mehrere Seiten haben. Dieselbe dauerhafte Leseraufgabe im selben Geltungsbereich darf nicht mehrfach angelegt werden.

Beispiel:

| Seite | Thema | Aufgabe | Abgrenzung |
|---|---|---|---|
| 100-Meter-Grundlagenseite | räumlicher Zusammenhang | verstehen | Rechtsquelle, Bedeutung und Auslegung |
| Grundstücksbeitrag | räumlicher Zusammenhang | vorprüfen | Referenzfläche, Karte, Entfernung, Trennwirkungen und Unterlagen |
| kommunaler Beschluss | räumlicher Zusammenhang | Änderung verfolgen | konkretes Ereignis, Gemeinde, Datum und Quelle |

## 5. Entscheidungsregel bei Überschneidungen

| Befund | Maßnahme |
|---|---|
| Gleiche Inhalte beantworten dieselbe Frage | in die stärkere Seite übernehmen; alte Adresse dauerhaft auf das sachlich passende Ziel weiterleiten |
| Technische Kopie muss erreichbar bleiben | maßgebliche Adresse kanonisch auszeichnen; nur diese in Sitemap und internen Verweisen verwenden |
| Gleiches Oberthema, aber andere Leseraufgabe | beide Seiten behalten; Titel, Hauptüberschrift, Einleitung, Schwerpunkt und interne Verweise eindeutig trennen |
| Historische Nachricht ist weiterhin belegt | behalten, historischen Stand sichtbar machen und auf aktuellen Ratgeber verweisen |
| Inhalt entfällt ohne sachlich ähnlichen Ersatz | HTTP 404 oder 410; nicht pauschal auf Startseite weiterleiten |
| Inhalt hat einen eindeutigen Ersatz | dauerhafte Weiterleitung auf genau diesen Ersatz |
| Seite soll erreichbar, aber nicht auffindbar sein | `noindex`; nicht als Ersatz für Kanonisierung verwenden |

Zusammenführung und Weiterleitung werden niemals allein aufgrund eines maschinellen Ähnlichkeitswertes ausgeführt. Der Wert erzeugt einen Prüfauftrag; die redaktionelle Entscheidung bleibt nachvollziehbar dokumentiert.

## 6. Prüfung des Bestands am 15. Juli 2026

Geprüft wurden vier Grundlagenseiten und elf Magazinbeiträge.

### 6.1 Behobene höchste Überschneidung

`/246e-baugb-brandenburg/` und `/blog/ueberblick-246e-baugb-brandenburg/` beantworteten beide dieselbe allgemeine Frage. Titel, Beschreibungen und Hauptabschnitte überschnitten sich stark. Der Magazinbeitrag wurde deshalb entfernt; die alte Adresse wird dauerhaft auf die Grundlagenseite weitergeleitet. Die Grundlagenseite ist die einzige maßgebliche Übersicht.

### 6.2 Neu abgegrenzte Paare

| Paar | Maßgebliche Trennung |
|---|---|
| 100-Meter-Grundlagenseite / Grundstücksvorprüfung | rechtliche Bedeutung und Auslegung / tatsächliche Dokumentation und Arbeitsschritte |
| Gemeinde-Grundlagenseite / Unterlagenbeitrag | Rechtsrahmen, Prüfmaßstab, Frist und Rechtsschutz / praktische Unterlagen- und Ablaufhilfe |

Titel, Beschreibungen, Einstiege und gegenseitige Verweise wurden entsprechend geschärft.

### 6.3 Beobachtungsfälle ohne aktuelle Zusammenlegung

| Seiten | Begründung |
|---|---|
| Außenbereich-Themenzentrum / Grundstücksvorprüfung | Themenzentrum ordnet breit ein; Vertiefung führt den konkreten Arbeitsablauf aus. Beim nächsten größeren Redaktionslauf sollte das Themenzentrum noch stärker als Wegweiser gekürzt werden. |
| Naturschutz und Ausgleich / Strategische Umweltprüfung | unterschiedliche Rechtsfragen: Eingriffsregelung und Naturschutzrecht einerseits, UVPG/SUP andererseits. Die Abgrenzung bleibt ausdrücklich zu überwachen. |
| Aufstockung und Anbau / Hinterlandbebauung | unterschiedliche Vorhabenarten; Titel und Einleitungen müssen dauerhaft am konkreten Vorhaben bleiben. |

Befristung, Erschließung, Nutzungsänderung und Vorgehen nach einer Ablehnung besitzen eigenständige Leseraufgaben.

## 7. Automatische Prüfung im Projekt

Die Datei `scripts/content-overlap-check.mjs` prüft künftig bei jeder Änderung:

- vollständige Strategie-Metadaten;
- global eindeutige Inhaltsabsicht;
- global eindeutige normalisierte Hauptfrage;
- höchstens ein Themenzentrum pro Thema;
- vorhandene und gültige übergeordnete Seite;
- keine aktive Seite hinter einer Weiterleitungsregel;
- Ähnlichkeit von Titel, Beschreibung, Hauptfrage, Überschriften und Text;
- formatabhängige Pflichtfelder zusätzlich über das Astro-Inhaltsschema;
- nachvollziehbaren Aktualisierungsgrund bei geändertem Datum.

Allgemeine Wörter der Website wie „§ 246e“, „BauGB“, „Brandenburg“, „Ratgeber“ und „Prüfung“ werden beim Ähnlichkeitsvergleich ausgeblendet. Dadurch zählt die tatsächliche Fach- und Leseraufgabe stärker als unvermeidbare gemeinsame Begriffe.

Harte Fehler und ungeklärte Ähnlichkeitsfunde stoppen `npm run check`. Ein berechtigt getrennt bleibendes Paar benötigt eine dokumentierte, befristete Redaktionsentscheidung in `src/data/content-overlap-decisions.json`. Die Entscheidung ist über eine Prüfsignatur an den exakten Inhaltsstand beider Seiten gebunden; spätere Änderungen machen sie ungültig. Ähnlichkeitsfunde lösen keine automatische Textänderung, Zusammenführung oder Weiterleitung aus. Das verhindert, dass ein einfacher Wortvergleich fachlich notwendige Seiten zerstört, ohne Warnungen stillschweigend zu übergehen.

## 8. Laufende Prüfung mit echten Suchdaten

Die statische Prüfung verhindert Überschneidungen vor der Veröffentlichung. Nach dem Produktivstart kommt eine zweite Ebene hinzu:

1. Search-Console-Daten nach Suchanfrage und Seite abrufen.
2. Zeiträume von 28 und 90 Tagen vergleichen.
3. Suchanfragen den gepflegten Leseraufgaben zuordnen.
4. melden, wenn mehrere kanonische Seiten innerhalb derselben Aufgabe relevante Sichtbarkeit erhalten.
5. melden, wenn die führende Seite wiederholt zwischen zwei Adressen wechselt.
6. Entwicklung von Impressionen und Klicks stärker bewerten als einzelne Positionswerte.

Vorgesehene anfängliche Warnschwelle, ausdrücklich als Projektwert und nicht als Google-Empfehlung:

- mindestens 20 Impressionen innerhalb von 90 Tagen für eine Leseraufgabe;
- mindestens zwei Seiten mit jeweils mindestens 20 Prozent der Impressionen;
- oder Wechsel der führenden Seite in mindestens drei aufeinanderfolgenden Wochenprüfungen.

Search Console liefert nicht garantiert jede Datenzeile und ordnet Messwerte überwiegend der von Google gewählten kanonischen Adresse zu. Ein Treffer ist deshalb ein Prüfauftrag, kein automatischer Beweis für Kannibalisierung.

Dieser datenbasierte Lauf wird erst aktiviert, wenn Hauptdomain, Search-Console-Property und ein geeigneter technischer Zugang eingerichtet sind.

## 9. KI-Sichtbarkeit: getrennt messen, gemeinsam veröffentlichen

### 9.1 Entscheidung

KI-Sichtbarkeit ist eine eigene **Mess-, Verteilungs- und Prüfspur**, aber kein zweiter Inhaltsbestand.

Es werden keine nahezu gleichen Fassungen „für Google“, „für ChatGPT“ oder „für andere KI-Systeme“ angelegt. Ein zusätzlicher Artikel ist nur erlaubt, wenn er eine echte neue Leserfrage beantwortet. Ein Beitrag über die Verlässlichkeit einer KI-gestützten Grundstücksvorprüfung wäre beispielsweise ein eigenes Thema für Menschen; eine umformulierte Kopie des vorhandenen Grundstücksratgebers wäre es nicht.

### 9.2 Qualitätsmerkmale und technische Auffindbarkeit

Die redaktionellen Qualitätsmerkmale in den folgenden Punkten werden insbesondere durch die offiziellen Hinweise von Google und Microsoft gestützt:

- eigenständiger fachlicher Mehrwert;
- klare Frage und eindeutiger Seitenschwerpunkt;
- sichtbare Quellen, Prüfmethode und tatsächliches Aktualisierungsdatum;
- konkrete Gemeindenamen, Daten, Aktenzeichen und Verfahrensstände, wenn öffentlich belegt;
- verständliche Überschriften, kurze direkte Antworten, Tabellen und Prüfschritte, wenn sie Lesern helfen;
- crawlbare HTML-Inhalte, korrekte kanonische Adresse, Sitemap und interne Verweise;
- keine massenhafte Erzeugung geringwertiger Orts- oder Fragevarianten.

Google erklärt, dass seine generativen Suchfunktionen auf den normalen Suchgrundlagen aufbauen und keine besondere KI-Auszeichnung benötigen. Eine `llms.txt`-Datei wird von Google nicht verwendet. Sie wird deshalb nicht als vermeintliche Rangabkürzung eingeführt.

Die geprüften OpenAI-Unterlagen belegen demgegenüber vor allem die technische Auffindbarkeit über `OAI-SearchBot`, die davon getrennte Steuerung von `GPTBot`, mögliche Herkunftskennzeichnungen bei Besuchen und Anforderungen an zugängliche Seiten. Sie veröffentlichen kein vollständiges redaktionelles Rangmodell. Die oben genannten Inhaltsmerkmale werden OpenAI deshalb nicht als eigene Rangvorgaben zugeschrieben.

### 9.3 Suchabruf und Modelltraining sind getrennte Entscheidungen

| System | Abruf für Suche und Zitate | getrennte Trainingssteuerung |
|---|---|---|
| Google | Googlebot und normale Indexierbarkeit | `Google-Extended` betrifft bestimmte Gemini-Nutzungen, nicht die Rangfolge der Google-Suche |
| ChatGPT | `OAI-SearchBot` | `GPTBot` kann unabhängig davon erlaubt oder gesperrt werden |
| Bing/Copilot | Bingbot und Bing-Index | `nocache` und `noarchive` wirken nach Bing-Dokumentation gekoppelt auf bestimmte Copilot-Ausgaben und Trainingsnutzung; dies ist keine so saubere Trennung wie bei OpenAI |
| Perplexity | `PerplexityBot` | laut Anbieter nicht für das Training von Grundlagenmodellen genutzt |

Die heutige allgemeine Freigabe in `robots.txt` lässt Suchcrawler zu. Ob auch Trainingscrawler dauerhaft zugelassen werden sollen, ist eine gesonderte geschäftliche Entscheidung und wird nicht stillschweigend im Rahmen einer SEO-Änderung umgestellt.

### 9.4 Getrennte Messung

| Messspur | Kennzahlen | Einschränkung |
|---|---|---|
| Google-Suche | Suchanfragen, Seiten, Impressionen, Klicks, Klickrate | Search Console zeigt nicht jede Abfrage |
| generative Google-Suche | betroffene Seiten, Impressionen und verfügbare Leistungswerte | eigener Bericht wird schrittweise bereitgestellt |
| Bing/Copilot | Zitate, zitierte Seiten, Themen und zeitliche Entwicklung | Zitat ist nicht gleich Besuch oder Rang |
| ChatGPT Search | Besuche mit erkennbarer Herkunft `utm_source=chatgpt.com` | erfordert später eine datenschutzrechtlich freigegebene Auswertung |
| Perplexity | ergänzende Beobachtung von Abrufen und erkennbaren Besuchen | kein gleichwertiges allgemeines Herausgeber-Berichtssystem belegt |

Die Werte werden getrennt gespeichert, aber immer derselben kanonischen Adresse, Inhaltsabsicht und Themenzuordnung zugerechnet. Ein Suchcrawler-Abruf ist noch keine Sichtbarkeit, ein Zitat noch kein Besuch und ein Besuch noch keine Anfrage.

## 10. Anforderungen an Nachrichten und Projektentscheidungen

Vor Veröffentlichung muss eine Nachricht mindestens enthalten:

- eindeutige Ereigniskennung und Ereignisdatum;
- Art der Nachricht, etwa Gesetzesänderung, kommunalpolitischer Beschluss oder Projektfortschritt;
- betroffene Gemeinde oder räumlichen Geltungsbereich;
- Einordnung des Verfahrensstands;
- mindestens eine amtliche Ausgangsquelle, die ausdrücklich als Beleg des Ereignisses gekennzeichnet ist;
- Verweis auf den zugehörigen dauerhaften Ratgeber;
- Prüftermin, wenn sich die Lage weiterentwickeln kann;
- sichtbare Trennung zwischen Ereignisdatum, Veröffentlichungsdatum und Änderungsdatum.

Ein Projektprofil benötigt zusätzlich:

- dauerhafte Vorgangskennung;
- Gemeinde und Projektart;
- aktuellen, genau bezeichneten Projektstand;
- mindestens eine konkrete öffentliche Ausgangsquelle mit dokumentierter Quellenrolle und Belegfunktion für das Projekt;
- bei einem laufenden Stand einen vorgesehenen erneuten Prüftermin;
- keine personenbezogenen oder nicht veröffentlichten Angaben.

Ein Entscheidungsprofil benötigt zusätzlich:

- Zuordnung zu einer dauerhaften Projektkennung;
- exakt bezeichnete Entscheidungsebene;
- Ergebnis `zugestimmt`, `abgelehnt`, `teilweise zugestimmt` oder `offen`;
- Entscheidungsdatum und veröffentlichte Akten- oder Beschlusskennung;
- veröffentlichte Entscheidungsstelle und belegte Kurzfassung der tragenden Gründe;
- veröffentlichte Entscheidung oder Gerichtsentscheidung als Primärquelle und ausdrücklicher Ereignisbeleg;
- spätere Änderungen, Rechtsbehelfe oder Aufhebungen als eigener belegter Stand;
- keine personenbezogenen oder nicht veröffentlichten Angaben.

Die bloße Erwähnung in einer Makleranzeige reicht nicht als Beleg für eine Zustimmung oder Genehmigung.

## 11. Betriebsablauf

### Vor jedem neuen Entwurf

1. Bestehende Inhaltskarte und Hauptfragen prüfen.
2. Inhaltsart, Thema, Leseraufgabe, Zielgruppe und übergeordnete Seite festlegen.
3. Bei Überschneidung zuerst entscheiden: vorhandene Seite aktualisieren, klar abgrenzen oder Inhalte zusammenführen.
4. Primärquellen sichern und rechtliches Veröffentlichungstor anwenden.

### Bei jeder Änderung

1. `npm run check` einschließlich Überschneidungsprüfung.
2. Bei Rechtsinhalten zusätzlich `npm run legal:check` und unabhängige Zweitprüfung.
3. Keine automatische Veröffentlichung bei ungeklärtem Ähnlichkeitshinweis.

### Wöchentlich nach Produktivstart

1. technische Erreichbarkeit, Robots-Angaben und Sitemap prüfen;
2. neue amtliche Quellen und Prüffristen überwachen;
3. Search-Console-Überschneidungen prüfen, sobald ausreichend Daten vorliegen;
4. Google- und Bing-KI-Berichte getrennt derselben Inhaltskarte zuordnen;
5. nur Prüfaufgaben erzeugen, keine automatischen Rechts- oder Weiterleitungsentscheidungen.

## 12. Offizielle Quellen

Alle nachstehenden Quellen wurden am 15. Juli 2026 geprüft.

### Google

- [SEO-Starthilfe](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Doppelte URLs und kanonische Adresse](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Weiterleitungen und Google-Suche](https://developers.google.com/search/docs/crawling-indexing/301-redirects)
- [Hilfreiche, zuverlässige und nutzerorientierte Inhalte](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Optimierung für generative Suchfunktionen](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Verwendung generativer KI für Websiteinhalte](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)
- [Artikel-Strukturdaten](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Datumsangaben auf Webseiten](https://developers.google.com/search/docs/appearance/publication-dates)
- [Nachrichtensitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap)
- [Search Console: Suchanfrage und Zielseiten auswerten](https://support.google.com/webmasters/answer/17010961)
- [Search-Console-Programmierschnittstelle](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
- [Bericht für generative KI-Suchergebnisse](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)
- [Google-Extended](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)

### OpenAI

- [Crawler von OpenAI](https://developers.openai.com/api/docs/bots)
- [Hinweise für Herausgeber und Entwickler](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)

### Microsoft und IndexNow

- [Bing-Richtlinien für Websitebetreiber](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
- [Bing-Bericht zur KI-Leistung](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c)
- [Bing: Inhaltsentfernung und Ausgabebeschränkungen](https://www.bing.com/webmasters/help/content-removal-cb6c294d)
- [IndexNow-Dokumentation](https://www.indexnow.org/documentation)

### Perplexity

- [Crawler-Dokumentation](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)

## 13. Grenzen der Recherche

- Anbieter können Berichte, Crawlerregeln und Produktbezeichnungen ändern; diese Quellen gehören deshalb in die laufende Aktualitätsprüfung.
- Anbieter veröffentlichen keine vollständigen Rangmodelle. Aus Empfehlungen darf keine Erfolgsgarantie abgeleitet werden.
- Ähnlichkeitswerte sind interne Prüfwerte, keine Kennzahlen von Google, OpenAI, Microsoft oder Perplexity.
- Rechtliche Richtigkeit und Suchsichtbarkeit sind getrennte Veröffentlichungstore; eine SEO-Prüfung ersetzt keine Rechtsprüfung.

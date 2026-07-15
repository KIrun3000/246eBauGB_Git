# Bildrichtlinie für Magazin und Ratgeber

Stand: 15. Juli 2026

## Ziel

Bilder sollen den konkreten Prüfgegenstand eines Beitrags verständlich machen. Sie dürfen weder einen amtlichen Plan vortäuschen noch ein reales Grundstück, eine Gemeindeentscheidung oder ein erfolgreiches Projekt erfinden.

## Zulässige Bildarten

1. **Eigene oder lizenzierte Fotografie**
   Bevorzugt bei Ortsbezug, realen Projekten und redaktionellen Berichten. Urheber, Quelle, Nutzungsrecht und Aufnahmedatum müssen dokumentiert sein.
2. **Amtliche Darstellung**
   Nur mit genauer Behörde, Fundstelle, Abrufdatum und geklärten Nutzungsbedingungen. Ausschnitt und Bearbeitung sind zu kennzeichnen.
3. **Redaktionelle Grafik**
   Für Abläufe, Vergleiche und Prüfschritte. Sie wird als HTML, CSS oder SVG umgesetzt und darf keine erfundenen Messwerte enthalten.
4. **KI-generiertes Symbolbild**
   Zulässig für allgemeine Ratgeber ohne konkreten Ort oder Fall. Die Bildunterschrift nennt die KI-Erzeugung und grenzt das Motiv von echten Plänen, Unterlagen, Standorten oder Vorhaben ab.

## Verbindliche Grenzen

- Nachrichten, Gemeindeentscheidungen und konkrete Projekte erhalten kein KI-Bild, das den berichteten Ort oder Fall vermeintlich zeigt.
- Keine erfundenen Behördennamen, Aktenzeichen, Kartensymbole, Beschlüsse oder amtlichen Stempel.
- Keine Bildunterschrift darf eine Genehmigung, Bebaubarkeit oder behördliche Bewertung behaupten.
- Ein Motiv wird nicht als allgemeines Kategorienbild über mehrere fachlich verschiedene Beiträge verteilt, wenn dadurch ein falscher Zusammenhang entsteht.
- Reale Personen und private Grundstücke werden nur mit geklärter Einwilligung beziehungsweise gesicherter redaktioneller Rechtsgrundlage verwendet.

## Technischer Standard

- Hauptformat: 1536 × 864 Pixel, WebP, Seitenverhältnis 16:9.
- Kleine Fassung: 768 × 432 Pixel, WebP.
- Kurzer, beschreibender deutscher Dateiname ohne Umlaute.
- Das Bild wird mit `src`, `srcset`, `sizes`, Breite, Höhe und einem inhaltlich passenden Alternativtext eingebunden.
- Bilder im ersten sichtbaren Bereich werden bevorzugt geladen; spätere Bilder werden verzögert geladen.
- Alternativtexte beschreiben das sichtbare Motiv. Sie wiederholen weder die Überschrift noch Suchbegriffe ohne Informationswert.

## Nachweis je Bild

Der Bildnachweis ist keine getrennte Liste mehr, sondern ein verpflichtender Teil der Artikeldaten. Die vollständige [Vorlage für Bildnachweise](./bildnachweis-vorlage.md) wird bei jedem neuen Beitrag ausgefüllt.

Für jedes Bild werden mindestens diese Angaben festgehalten:

- Dateiname
- Alternativtext und Bildunterschrift
- Bildart und Herkunft
- Urheber, Fotografin, Fotograf oder erzeugendes System
- Quelle und Fundstelle bei amtlichen oder lizenzierten Bildern
- Aufnahme- oder Erzeugungsdatum
- Lizenz oder Nutzungsgrundlage
- Zweck des Bildes im Beitrag
- Prüfung von Themenbezug, kleinem Bildausschnitt, irreführenden Einzelheiten und Rechten
- prüfende Person und Prüfdatum

Ein Beitrag lässt sich nicht bauen, wenn diese Pflichtangaben fehlen. Eine unvollständige Herkunft ist nur für ausdrücklich dokumentierte Bestandsbilder zulässig; neue Ausnahmen sind technisch gesperrt.

## Auswahl vor der Veröffentlichung

1. Zuerst wird geklärt, welche Aussage das Bild für genau diesen Beitrag leisten soll.
2. Für Nachrichten, Entscheidungen und reale Projekte wird eine belegte echte oder amtliche Darstellung gesucht. KI-Symbolbilder sind dort gesperrt.
3. Bei allgemeinen Ratgebern wird eine eigene oder lizenzierte Fotografie bevorzugt. Ein KI-Symbolbild ist nur zulässig, wenn kein konkreter Ort, Fall oder amtlicher Eindruck behauptet wird.
4. Der Ausschnitt wird sowohl im Format 1536 × 864 als auch in der kleinen Fassung 768 × 432 geprüft.
5. Bildunterschrift, Alternativtext, Rechte und Herkunft werden vor der Freigabe eingetragen und bestätigt.

## Bestand nach der Prüfung

| Beitrag | Motiv | Entscheidung |
| --- | --- | --- |
| Ablehnungsgründe Gemeindezustimmung | Besprechung am Grundstücksplan | behalten, als KI-Symbolbild präziser kennzeichnen |
| Aufstockung und Anbau | Wohnhaus während Dachaufbau und Anbau | neu erzeugt |
| Befristung bis 2030 | gemeinsame Ablauf- und Fristplanung | neu erzeugt |
| Erschließung | Prüfung von Zufahrt und Anschlüssen vor Ort | neu erzeugt |
| Gemeindezustimmung vorbereiten | geordnete Bau- und Lageunterlagen | behalten, als KI-Symbolbild präziser kennzeichnen |
| Nachverdichtung in zweiter Reihe | tiefes Grundstück mit seitlicher Zufahrt | neu erzeugt |
| Naturschutz und Ausgleich | Standortprüfung an Wiese und Hecke | neu erzeugt |
| Nutzungsänderung | Besichtigung eines älteren Gewerbegebäudes | neu erzeugt |
| Räumlicher Zusammenhang | schematische Lagebeziehung von Siedlung und Flurstück | behalten, deutlich als nicht amtlich kennzeichnen |
| Umweltprüfung | Vergleich von Luftbild, Standortfotos und Prüfebenen | neu erzeugt |

Die sieben neuen Motive wurden am 15. Juli 2026 mit der Codex-Bildgenerierung von OpenAI erzeugt. Sie bilden keine realen Standorte oder Verfahren ab.

Die automatische Prüfung `npm run bilder:check` kontrolliert für jeden Beitrag die eigene Zuordnung, Bildart, Herkunft, Rechte, Fundstelle, Freigabe und beide vorgeschriebenen Bildgrößen. `npm run bilder:rules:test` prüft zusätzlich, dass die Sperrregeln nicht versehentlich aufgeweicht werden. Beide Prüfungen sind Teil der vollständigen Projektprüfung.

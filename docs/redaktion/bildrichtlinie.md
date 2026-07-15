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

Für jedes künftig ergänzte Bild werden mindestens diese Angaben festgehalten:

- Beitragsadresse
- Dateiname
- Bildart
- Urheber oder erzeugendes System
- Quelle oder Erzeugungsdatum
- Lizenz oder Nutzungsgrundlage
- redaktionelle Bildunterschrift

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

Die automatische Prüfung `npm run bilder:check` kontrolliert für jeden Beitrag die eigene Zuordnung, die Kennzeichnung und beide vorgeschriebenen Bildgrößen. Sie ist Teil der vollständigen Projektprüfung.

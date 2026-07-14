# Redaktionelle Nutzerführung und Auffindbarkeit

Stand: 14. Juli 2026

Dieser Leitfaden übersetzt aktuelle Originalquellen von Google und W3C in prüfbare Regeln für das §246e-Magazin. Er ist keine Zusage für eine bestimmte Platzierung in Suchergebnissen. Google bewertet Seiten mit vielen Systemen und Signalen; es gibt weder eine garantierte Punktzahl noch eine bevorzugte Wortzahl.

## 1. Was Google nach eigener Aussage berücksichtigt

### Hilfreiche und verlässliche Inhalte

- Jeder Beitrag beantwortet eine erkennbare Frage für die Zielgruppe und hilft bei einem nächsten Schritt.
- Aussagen sind eigenständig eingeordnet, vollständig genug für den Zweck und mit aktuellen Primärquellen belegt.
- Titel und Zwischenüberschriften beschreiben den Inhalt sachlich und ohne Übertreibung.
- Wer den Inhalt erstellt oder fachlich geprüft hat, wie er entstanden ist und warum er veröffentlicht wird, muss nachvollziehbar sein. Solange eine belastbare Autoren- oder Prüferangabe fehlt, wird keine Person erfunden.
- Bei rechtlich bedeutsamen Themen hat Vertrauen besonderes Gewicht: aktuelle Gesetzesfassungen, sichtbare Aktualisierungsdaten, Quellen und klare Grenzen der Einordnung.
- Inhalte werden nicht auf eine vermeintlich ideale Wortzahl verlängert und nicht nur für Suchmaschinen massenhaft erzeugt.

Quelle: Google Search Central, „Creating helpful, reliable, people-first content“, zuletzt aktualisiert am 10. Dezember 2025: https://developers.google.com/search/docs/fundamentals/creating-helpful-content

### Seitenqualität und Technik

- Die Seite muss auf kleinen und großen Bildschirmen verständlich, sicher und schnell nutzbar sein.
- Bilder erhalten feste Maße, responsive Varianten und aussagekräftige Alternativtexte. Das vermeidet Layoutsprünge und hilft Menschen sowie Suchmaschinen beim Verständnis.
- Bilder stehen in einem echten `img`-Element nahe am zugehörigen Inhalt. Dateinamen sind kurz und beschreibend.
- Für Blogbeiträge werden nur sichtbare und zutreffende Angaben als `BlogPosting` ausgezeichnet: Überschrift, Beschreibung, Veröffentlichungs- und Änderungsdatum sowie repräsentative Bilder.
- Strukturierte Daten können die Darstellung in Suchergebnissen verbessern, garantieren sie aber nicht.

Quellen:

- Google Search Central, „Google image SEO best practices“, zuletzt aktualisiert am 2. März 2026: https://developers.google.com/search/docs/appearance/google-images
- Google Search Central, „Article structured data“, abgerufen am 14. Juli 2026: https://developers.google.com/search/docs/appearance/structured-data/article
- Google Search Central, „A guide to Google Search ranking systems“, zuletzt aktualisiert am 10. Dezember 2025: https://developers.google.com/search/docs/appearance/ranking-systems-guide

## 2. Was die Orientierung für Leser verbessert

- Lange Beiträge beginnen mit einer kurzen Inhaltsübersicht und einer realistischen Lesezeit.
- Klare H2- und H3-Überschriften bilden die tatsächliche Gliederung ab und dienen als Sprungziele.
- Absätze behandeln möglichst einen Gedanken. Prüfschritte stehen in Listen oder klar getrennten Abschnitten.
- Kurze Textblöcke, Weißraum, verständliche Wörter und eindeutige Bilder erleichtern die Aufnahme.
- Interaktion erfüllt eine Aufgabe: Sprungnavigation, sichtbarer Lesefortschritt, Teilen und ein passender nächster Schritt. Dekorative Bewegung oder künstliche Beschäftigungselemente entfallen.
- Rechtsaussagen werden nicht hinter Interaktionen verborgen. Ohne JavaScript bleibt der vollständige Beitrag lesbar.

Quellen:

- W3C WAI, „Use Clear and Understandable Content“: https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/
- W3C WAI, „Headings“: https://www.w3.org/WAI/tutorials/page-structure/headings/
- W3C WAI, „Writing for Web Accessibility“: https://www.w3.org/WAI/tips/writing/

## 3. Regeln für redaktionelle Bilder

- Das Bild muss den Beitrag erkennbar vertreten; ein allgemeines Logo oder eine beliebige Häuseransicht reicht nicht.
- Erzeugte Pläne, Flurstücke und Luftaufnahmen sind fiktiv. Sie dürfen nicht wie ein echter amtlicher Auszug für einen bestimmten Standort ausgegeben werden.
- Die Bildunterschrift kennzeichnet jede erzeugte Planungsszene als illustrative Darstellung.
- Keine lesbaren Namen, Adressen, Flurstücksnummern, amtlichen Siegel oder erfundenen Rechtsaussagen im Bild.
- Für Vorschaubilder werden WebP, mindestens 768 Pixel Breite, feste Maße, `srcset`, `sizes` und ein inhaltlicher Alternativtext verwendet.
- Das wichtigste Beitragsbild erhält Varianten im Verhältnis 1:1, 4:3 und 16:9 für eine mögliche Darstellung in Suchergebnissen.

## 4. Musterprüfung

Musterseite: `/blog/raeumlicher-zusammenhang-pruefen-grundstueck/`

Der Versuch gilt technisch als bestanden, wenn:

1. die Magazinübersicht echte `img`-Elemente mit Alternativtext, festen Maßen und responsiven Quellen ausgibt,
2. die Musterseite eine Inhaltsübersicht, Lesezeit, sichtbaren Lesefortschritt und eine nutzbare Teilen-Funktion besitzt,
3. alle Sprungziele per Tastatur erreichbar sind und ohne JavaScript weiterhin der vollständige Artikel erscheint,
4. die Seite genau eine H1 und eine schlüssige Überschriftenfolge besitzt,
5. `BlogPosting` nur sichtbare, zutreffende Angaben enthält,
6. Projektbau, Inhaltsprüfung, Sprachprüfung und gerenderte Suchmaschinenprüfung ohne Fehler laufen.

Nach einer späteren Veröffentlichung werden keine Rankingversprechen abgeleitet. Sinnvolle Vergleichswerte sind Suchanfragen und Klickrate in der Google Search Console, Core Web Vitals sowie – erst nach einer datenschutzrechtlich geprüften Messlösung – Sprungnutzung und Lesetiefe.

# Legal-Content- und SEO-Audit

**Prüfstand:** 14. Juli 2026  
**Gegenstand:** 11 Blogartikel, 4 Pillar-Seiten, zentrale Faktensammlungen und Content-Regeln  
**Methode:** Abgleich mit aktuellen amtlichen Normtexten, BMWSB-Informationen, bestehender Content-DoD und automatisierter Struktur-/SEO-Prüfung

Dieses Audit ist eine redaktionelle Qualitätssicherung und keine Rechtsberatung. Es ersetzt insbesondere nicht das vorgeschriebene zweite Legal-Review vor dem Merge rechtlicher Inhalte.

## Ergebnis in Kürze

- **Hohes Risiko behoben:** veralteter Überblicksartikel mit falschem Gesetzeslink und falscher Darstellung der 100-Meter-Angabe wurde neu gefasst.
- **Hohes Risiko behoben:** die Gemeindezustimmung wird nicht mehr als separat anfechtbarer eigenständiger Verwaltungsakt beschrieben; Fristbeginn und Einbindung in das Genehmigungsverfahren wurden korrigiert.
- **Hohes Risiko behoben:** die Befristung wird nicht mehr auf eine bloße Antragstellung bis 31.12.2030 verkürzt.
- **Faktensammlungen gesperrt:** alte Evidence-/FAQ-Dateien sind wegen ungeprüfter und teils veralteter Aussagen für Publikation und NotebookLM quarantänisiert.
- **Fortlaufende Kontrolle eingerichtet:** acht amtliche Quellen werden auf Erreichbarkeit, erwartete Kernaussagen, Prüffristen und – bei Normtexten – Inhaltsänderungen überwacht.
- **SEO-Basis erweitert:** Titel- und Description-Längen, amtliche Pflichtquellen, veraltete URL-Pfade sowie typische rechtliche Risikophrasen werden automatisiert geprüft.
- **Technischer SEO-Fehler behoben:** MDX-Pillar-Seiten übergaben Titel und Description nicht an das Layout; leere Meta-Tags werden jetzt nach dem Build automatisch blockiert.

## Verifizierte Kernaussagen

| Aussage | Amtliche Grundlage | Bewertung |
|---|---|---|
| § 246e kann bis Ende 2030 im bauaufsichtlichen Verfahren genutzt werden; die Frist begrenzt nicht die spätere Geltungsdauer der Genehmigung. | § 246e Abs. 1 und 4 BauGB | bestätigt |
| Erfasst sind Neubau, bestimmte Erweiterungen/Änderungen/Erneuerungen und Nutzungsänderungen zu Wohnzwecken. | § 246e Abs. 1 Nr. 1–3 BauGB | bestätigt |
| Die Gemeindezustimmung ist erforderlich; § 36a gilt entsprechend. | § 246e Abs. 1 und 2 BauGB | bestätigt |
| Die Drei-Monats-Frist beginnt mit Eingang des Ersuchens der Genehmigungsbehörde bei der Gemeinde. | § 36a Abs. 2 BauGB | bestätigt |
| Eine fingierte Zustimmung ist keine Baugenehmigung. | Systematik § 36a und amtliche BMWSB-FAQ | bestätigt |
| Die Entscheidung der Gemeinde ist nur im Rechtsbehelf gegen die Genehmigungsentscheidung überprüfbar. | § 36a Abs. 3 BauGB | bestätigt |
| Im Außenbereich ist ein räumlicher Zusammenhang mit Bereichen nach § 30 Abs. 1/2 oder § 34 erforderlich. | § 246e Abs. 3 BauGB | bestätigt |
| Die 100-Meter-Angabe steht in der Begründung, nicht im Normtext. | BT-Drs. 21/781, S. 28 | bestätigt, aber nur Auslegungshilfe |

## Kritische Einzelbefunde und Bearbeitungsstand

### Bereits in diesem Arbeitszweig korrigiert

| Datei | Befund | Maßnahme |
|---|---|---|
| `src/content/blog/ueberblick-246e-baugb-brandenburg.mdx` | Vor Inkrafttreten datiert; falscher Gesetzeslink; § 246e zu Unrecht als reine Außenbereichs-/100-m-Regel und ausschließlich für Wohngebäude dargestellt | vollständig neu gefasst, `updatedDate` gesetzt, amtliche Quellen ergänzt |
| `src/pages/zustimmung-gemeinde-246e.mdx` | Zustimmung als eigenständiger Verwaltungsakt und separat anfechtbar; keine gesetzliche Frist; direkter formaler Antrag als Regelfall | Verfahrenseinbindung, Drei-Monats-Frist, Genehmigungsbehördenersuchen und § 36a Abs. 3 korrekt dargestellt |
| `src/content/blog/gemeindezustimmung-beantragen-unterlagen.mdx` | direkter separater Antrag und Rechtsnatur zu pauschal | Verfahrensweg und Fristbeginn präzisiert, `updatedDate` gesetzt |
| `src/content/blog/befristung-2030-fristen-beachten.mdx` | Befristung und laufende Verfahren zu unbestimmt | Wortlaut des § 246e Abs. 4 eingearbeitet, `updatedDate` gesetzt |
| `src/pages/100m-regel-raeumlicher-zusammenhang.mdx` | § 30 Abs. 2 fälschlich als einfacher B-Plan; identische Länderpraxis behauptet | § 30-Systematik und Unsicherheit korrigiert |
| `src/pages/aussenbereich-brandenburg-246e.mdx` | B-Plan könne § 246e ausschließen; pauschale UVP- und Erfolgsaussagen | Anwendungsbereich, Umweltprüfung und fehlende Erfolgsprognose korrigiert |
| `src/content/blog/umweltpruefung-sup-erforderlich.mdx` | zwei nicht mehr erreichbare UVPG-URLs | amtliche aktuelle Pfade `/uvpg/` eingesetzt |

### Noch nicht als vollständig legal-reviewed freigegeben

Die folgenden Artikel haben die bisherige automatische Strukturprüfung bestanden und enthalten amtliche Quellen. Sie wurden in diesem Durchgang auf auffällige Risikophrasen gescreent, aber **nicht Claim für Claim fachlich freigegeben**:

- `ablehnungsgruende-gemeindezustimmung.mdx` – Rechtsbehelfspassagen anhand § 36a Abs. 3 nachprüfen
- `aufstockung-anbau-innenbereich.mdx` – Abweichungsumfang und Verhältnis zu § 30/§ 34 prüfen
- `erschliessung-sichern-anforderungen.mdx` – bundesrechtliche und landesrechtliche Erschließungsanforderungen trennen
- `nachverdichtung-hinterlandbebauung.mdx` – Lagekategorien und Einzelfallbeispiele prüfen
- `naturschutz-ausgleich-aussenbereich.mdx` – § 18 BNatSchG und Fachprüfungen Claim für Claim prüfen
- `nutzungsaenderung-gewerbe-zu-wohnen.mdx` – Bauordnungs-/Immissionsschutz-Aussagen prüfen
- `raeumlicher-zusammenhang-pruefen-grundstueck.mdx` – 100-m-Leitplanke und funktionale Kriterien nicht überdehnen
- `umweltpruefung-sup-erforderlich.mdx` – SUP/UVP-Abgrenzung anhand UVPG vollständig fachprüfen

Bis dieses Review erfolgt, ist ein vorhandener Artikel kein zulässiger Beleg für einen neuen Artikel.

### Rechtstexte der Website separat prüfen

`impressum.astro` und `datenschutz.astro` erhalten nun wieder korrekte SEO-Metadaten. Ihre materiellen Angaben wurden jedoch nicht als aktuell freigegeben. Insbesondere müssen Betreiberangaben, Erreichbarkeit der Kontaktadresse, Hosting-/Logfile-Praxis, Cookie-/Tracking-Aussagen und die inzwischen geänderte telemedienrechtliche Terminologie anhand des tatsächlichen Betriebs geprüft werden.

## Faktensammlungen

`research/evidence/246e-brandenburg.md` und `research/faq/246e-owner-faq.md` enthalten unter anderem:

- veraltete Standsangaben aus Januar 2026,
- die unzutreffende Kurzformel „Antrag bis 31.12.2030",
- teilweise zu weitgehende Aussagen zu Bedingungen, Ermessen, Rechtsbehelfen und Verwaltungspraxis,
- Sekundär- und LLM-Recherche, die nicht immer sauber von finalem Normtext getrennt ist.

Beide Dateien sind deshalb quarantänisiert. Die `*.perplexity-raw.md`-Dateien bleiben reine Rohrecherche und dürfen nicht in den redaktionellen Wissensbestand oder NotebookLM importiert werden.

## SEO-Befunde

- Alle Artikel haben Titel, Description, mindestens zwei Quellen, interne Links und einen FAQ-Block.
- Die automatisierte Prüfung meldet künftig Titel außerhalb 35–70 und Descriptions außerhalb 120–165 Zeichen.
- Nur fachlich tatsächlich geprüfte Artikel erhalten ein neues `updatedDate`; ein Datum darf nicht allein zur SEO-Optik gesetzt werden.
- Rechtliche Korrektheit hat Vorrang vor Keyword-Optimierung. Insbesondere dürfen „100-m-Regel“, Erfolgschancen, Fristen und Rechtsbehelfe nicht zugespitzt werden.
- Für E-E-A-T sollten sichtbarer Autor/Reviewer, Prüfdatum, Quellenbox und Änderungsverlauf pro Artikel ergänzt werden. Das ist eine nächste redaktionelle Ausbaustufe.

## Automatischer Folgeprozess

1. Montags läuft `.github/workflows/content-freshness.yml`.
2. `npm run sources:check` vergleicht normalisierte amtliche Normtexte mit geprüften Hashes.
3. Bei Änderung oder überfälligem manuellen Review wird ein GitHub-Issue erzeugt bzw. aktualisiert und der Workflow schlägt fehl.
4. Ein Mensch oder Legal-Agent prüft die Änderung, erstellt eine Betroffenheitsliste und aktualisiert die Inhalte.
5. Erst nach zweitem Legal-Review werden Hash, Prüfdatum und `updatedDate` angepasst.

## Amtliche Ausgangsquellen

- [§ 246e BauGB](https://www.gesetze-im-internet.de/bbaug/__246e.html)
- [§ 36a BauGB](https://www.gesetze-im-internet.de/bbaug/__36a.html)
- [§ 30 BauGB](https://www.gesetze-im-internet.de/bbaug/__30.html)
- [§ 34 BauGB](https://www.gesetze-im-internet.de/bbaug/__34.html)
- [§ 35 BauGB](https://www.gesetze-im-internet.de/bbaug/__35.html)
- [§ 18 BNatSchG](https://www.gesetze-im-internet.de/bnatschg_2009/__18.html)
- [Anlage 1 UVPG](https://www.gesetze-im-internet.de/uvpg/anlage_1.html)
- [BMWSB-Informationen für Privatpersonen](https://www.bmwsb.bund.de/DE/bauen/baurecht/bau-turbo/bauherren.html)

# Automatisierter Projektablauf

## Einfaches Betriebsmodell

Der Mac mini ist die einzige Arbeitsmaschine für dieses Projekt. MacBook und iPhone steuern Codex lediglich aus der Ferne. Dadurch greifen alle Geräte auf dieselben Dateien, Branches, Skills und Zugangsdaten zu.

Der Projektinhaber muss für normale Arbeiten keine Terminal-, GitHub- oder Vercel-Befehle ausführen. Eine klare Anweisung wie „Setze diese Änderung um“ umfasst den kompletten technischen Ablauf.

## Was automatisch geschieht

1. Codex prüft, ob es im richtigen Projekt auf dem Mac mini arbeitet.
2. Codex legt einen eigenen `codex/<task>`-Branch an.
3. Codex setzt die Änderung um und führt `npm run check` aus.
4. Codex prüft den vollständigen Diff, erstellt einen Commit und pusht den Branch.
5. GitHub erstellt beziehungsweise erhält einen Pull Request und wiederholt die Qualitätsprüfung.
6. Vercel erstellt nach der Git-Verknüpfung eine Vorschau für den Branch.
7. Unkritische Änderungen können nach grünen Checks automatisch zusammengeführt werden.
8. Ein freigegebener Merge nach `main` löst automatisch das Produktionsdeployment aus.

## Öffentliche SEO-Prüfung

Nach dem Produktivstart prüft `.github/workflows/seo-live-monitor.yml` die öffentliche Hauptdomain wöchentlich. Kontrolliert werden Erreichbarkeit, Robots-Datei, Sitemap, Canonicals und versehentliche `noindex`-Angaben. Bei einem Fehler wird eine GitHub-Aufgabe mit Verweis auf den Prüflauf erstellt. Die Automatisierung verändert weder Inhalte noch DNS- oder Google-Einstellungen.

## NotebookLM: sichtbare Arbeit und Automatisierung

- Der integrierte Codex-Browser eignet sich für sichtbare NotebookLM-Arbeiten und die Kontrolle erzeugter Infografiken, Videos oder Präsentationen.
- Die NotebookLM-MCP-/CLI-Anbindung auf dem Mac mini übernimmt wiederholbare Abfragen, Quellenverwaltung und automatische Prüfungen.
- Das Alias `246e-amtlich` enthält ausschließlich die im Projektmanifest erfassten amtlichen Quellen. Das breitere Alias `246e` bleibt von der Veröffentlichungsprüfung getrennt.
- Vor juristischen Inhaltsarbeiten führt Codex `npm run sources:check` und anschließend `npm run notebooklm:check` aus.
- NotebookLM liefert Recherchehinweise. Eine Freigabe erfolgt erst nach Abgleich mit der konkreten amtlichen Fundstelle und dem Legal-Review-Gate.

## Drei Sicherheitsstufen

| Änderung | Ablauf |
| --- | --- |
| Design, Komponenten, kleine Technik- oder SEO-Änderungen | Checks, Pull Request und automatischer Merge sind möglich. |
| Juristische Aussagen, Blogartikel, Quellen oder Recherche | Zusätzliches Legal-Review mit aktuellen amtlichen Primärquellen. |
| Workflows, Codex-Regeln, Abhängigkeiten, Vercel oder Sicherheit | Zusätzliches Infrastruktur-Review der Berechtigungen und Auswirkungen. |

Die zusätzlichen Reviews führt Codex aus und dokumentiert sie im Pull Request. Der Projektinhaber muss GitHub nicht selbst bedienen. Nur echte Geschäfts-, Rechts-, Kosten-, Zugangsdaten-, Domain- oder Veröffentlichungsentscheidungen werden zurückgefragt.

## Produktionsstatus

Vorschauen und Produktionsbereitstellungen laufen über die bestehende Vercel-Verknüpfung. `codex/*`-Branches erzeugen Vorschauen; ausschließlich der geschützte `main`-Branch darf die öffentliche Website aktualisieren.

Das Release-Gate wurde am 18. Juli 2026 geprüft: Haupt- und Weiterleitungsdomains, öffentliche Pflichtseiten, Kontaktadresse, Datenschutz- und Einwilligungslogik, Search Console, amtliche Quellen sowie die technischen Projektprüfungen sind eingerichtet beziehungsweise erfolgreich geprüft. Die automatische Produktionsbereitstellung für `main` ist deshalb freigeschaltet.

Eine fehlerhafte Veröffentlichung wird zuerst in Vercel auf die letzte funktionierende Bereitstellung zurückgesetzt. Die eigentliche Korrektur erfolgt anschließend auf einem neuen `codex/*`-Branch mit denselben Prüf- und Review-Stufen. Zugangsdaten und DNS-Einstellungen werden nicht im Repository gespeichert.

## Parallel arbeiten

Zwei unabhängige Aufgaben dürfen gleichzeitig laufen, wenn jede Aufgabe einen eigenen Worktree und eine eigene Branch verwendet. Zwei Tasks dürfen niemals gleichzeitig dieselbe Branch oder denselben Projektordner bearbeiten.

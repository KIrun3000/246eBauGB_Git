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
8. Ein freigegebener Merge nach `main` löst später automatisch das Produktionsdeployment aus.

## Drei Sicherheitsstufen

| Änderung | Ablauf |
| --- | --- |
| Design, Komponenten, kleine Technik- oder SEO-Änderungen | Checks, Pull Request und automatischer Merge sind möglich. |
| Juristische Aussagen, Blogartikel, Quellen oder Recherche | Zusätzliches Legal-Review mit aktuellen amtlichen Primärquellen. |
| Workflows, Codex-Regeln, Abhängigkeiten, Vercel oder Sicherheit | Zusätzliches Infrastruktur-Review der Berechtigungen und Auswirkungen. |

Die zusätzlichen Reviews führt Codex aus und dokumentiert sie im Pull Request. Der Projektinhaber muss GitHub nicht selbst bedienen. Nur echte Geschäfts-, Rechts-, Kosten-, Zugangsdaten-, Domain- oder Veröffentlichungsentscheidungen werden zurückgefragt.

## Produktionsstatus

Preview-Deployments dürfen automatisiert laufen. Das automatische Produktionsdeployment ist in `vercel.json` vorübergehend für `main` deaktiviert, weil der Inhaltsaudit bekannte juristische Altstände festgestellt hat und `246ebaugb.de` noch nicht eingerichtet ist.

Nach Korrektur der fachlichen Basis und der öffentlichen Pflichtangaben wird `main` in einem gesondert geprüften Infrastruktur-Pull-Request für automatische Produktionsdeployments freigeschaltet.

## Parallel arbeiten

Zwei unabhängige Aufgaben dürfen gleichzeitig laufen, wenn jede Aufgabe einen eigenen Worktree und eine eigene Branch verwendet. Zwei Tasks dürfen niemals gleichzeitig dieselbe Branch oder denselben Projektordner bearbeiten.

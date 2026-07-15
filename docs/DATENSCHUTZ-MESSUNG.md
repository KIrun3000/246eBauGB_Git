# Datenschutzkonzept für die Besuchsmessung

Stand: 16. Juli 2026

## Festgelegte Lösung

- Google Analytics 4 wird über den Google Tag Manager eingebunden.
- Vor einer ausdrücklichen Einwilligung wird kein Google-Messdienst geladen oder kontaktiert.
- Es wird der grundlegende Einwilligungsmodus verwendet. Anfragelose Signale vor der
  Einwilligung sind ausgeschlossen.
- Nur `analytics_storage` kann freigegeben werden. `ad_storage`, `ad_user_data` und
  `ad_personalization` bleiben immer verweigert.
- „Nur notwendige“ und „Besuchsmessung erlauben“ stehen gleichwertig in der ersten Ansicht.
- Die Auswahl kann im Fußbereich jeder Seite geändert werden.
- Die lokale Entscheidung wird 180 Tage berücksichtigt und beim nächsten Seitenaufruf danach
  gelöscht. Analytics-Cookies laufen nach spätestens 90 Tagen ab; Nutzer- und Ereignisdaten
  werden in Analytics zwei Monate aufbewahrt.

## Technische Kennungen

- Google-Analytics-Property: `545814927`
- Datenstrom: `15264529547`
- Mess-ID: `G-28VS42PWW4`
- Tag-Manager-Container: `258474362`
- Tag-Manager-ID: `GTM-THB97PRN`

Diese Kennungen sind keine Zugangsschlüssel. Passwörter, API-Schlüssel und dauerhafte
Google-Zugangsdaten dürfen nicht im Projekt gespeichert werden.

## Prüfpunkte vor einer Veröffentlichung

1. Tag-Manager-Container enthält nur das Google-Analytics-Tag für alle Seiten.
2. Cookie-Laufzeit im Google-Tag beträgt 90 Tage (`7776000` Sekunden).
3. Werbefunktionen und personalisierte Werbung sind in Analytics ausgeschaltet.
4. Aufbewahrung der Ereignisdaten ist auf zwei Monate gestellt.
5. Ohne Einwilligung entstehen keine Anfragen an `googletagmanager.com`, `google-analytics.com`
   oder verwandte Google-Messadressen.
6. Ablehnen, Erlauben, spätere Änderung und Widerruf funktionieren mit Maus und Tastatur.
7. Datenschutzerklärung, Impressum und Kontaktadresse sind öffentlich erreichbar und aktuell.

## Rechts- und Anbieterquellen

- [§ 25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html)
- [DSGVO, insbesondere Art. 6 und Art. 7](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A02016R0679-20160504)
- [Orientierungshilfe der Datenschutzkonferenz für Telemedien](https://www.datenschutzkonferenz-online.de/media/oh/20211220_oh_telemedien.pdf)
- [Google: grundlegender und erweiterter Einwilligungsmodus](https://developers.google.com/tag-platform/security/concepts/consent-mode?hl=de)
- [Google: Einwilligungsmodus einrichten](https://developers.google.com/tag-platform/security/guides/consent?hl=de)
- [Google: IP-Verarbeitung in Analytics](https://support.google.com/analytics/answer/12017362?hl=de)
- [Google-Analytics-Nutzungsbedingungen](https://marketingplatform.google.com/about/analytics/terms/de/)

## Veröffentlichungstor

Änderungen an Einwilligung, Messzwecken, Anbietern, Speicherfristen oder der
Datenschutzerklärung gelten als rechtlich sensibel. Vor dem Zusammenführen ist eine zweite
rechtliche und sachliche Prüfung im Pull Request zu dokumentieren. Dieses Konzept ersetzt keine
individuelle Rechtsberatung.

# Vorlage für den Bildnachweis

Stand: 15. Juli 2026

Dieser Block gehört in die Kopfdaten jedes neuen Magazinbeitrags. Er wird erst auf `geprueft` gesetzt, wenn alle vier Kontrollen tatsächlich abgeschlossen sind.

```yaml
image:
  fileName: "kurzer-deutscher-dateiname"
  alt: "Sachliche Beschreibung des sichtbaren Motivs"
  caption: "Fotografie · kurze Einordnung des Motivs"
  kind: "fotografie"
  origin: "lizenziert"
  creator: "Name der Fotografin oder des Fotografen"
  rightsBasis: "Bezeichnung der Lizenz oder Nutzungsvereinbarung"
  sourceLabel: "Bezeichnung der Quelle"
  sourceUrl: "https://beispiel.de/genaue-fundstelle"
  createdAt: 2026-07-15
  provenanceStatus: "vollstaendig"
  purpose: "Welche Aussage dieses Bild im Beitrag unterstützt"
  reviewStatus: "geprueft"
  reviewedAt: 2026-07-15
  reviewedBy: "Name oder Redaktion 246eBauGB"
  checks:
    topicFit: true
    mobileCrop: true
    noMisleadingDetails: true
    rightsVerified: true
```

## Zulässige Werte

- `kind`: `fotografie`, `amtliche-darstellung`, `redaktionelle-grafik` oder `ki-symbolbild`
- `origin`: `eigenaufnahme`, `lizenziert`, `amtlich` oder `intern-erzeugt`
- `provenanceStatus`: für neue Bilder immer `vollstaendig`
- `reviewStatus`: vor der Veröffentlichung `geprueft`

`sourceLabel` und `sourceUrl` sind für lizenzierte und amtliche Bilder verpflichtend. Bei eigenen oder intern erzeugten Bildern entfallen sie. KI-Symbolbilder dürfen nur in allgemeinen Ratgebern verwendet werden und müssen in der Bildunterschrift ausdrücklich als solche bezeichnet sein.

Die vier Wahrheitswerte sind keine bloße Formsache. Sie bestätigen, dass Themenbezug, kleiner Bildausschnitt, mögliche Täuschung und Nutzungsrechte einzeln geprüft wurden.

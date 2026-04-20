# PBL ConsultING – Einbau-Anleitung

## Dateien
- `pbl_animations.js` – alle 3 Animationen (Hero Beams, Partikel-Text, Shader)
- `pbl_style_additions.css` – CSS-Ergänzungen

---

## Schritt 1: Dateien auf GitHub hochladen

Beide Dateien in das Root-Verzeichnis des Repositories hochladen:
```
sonntagniko-tech/pbl-website/
  ├── pbl_consulting_final.html
  ├── pbl_animations.js         ← NEU
  └── pbl_style_additions.css   ← NEU
```

---

## Schritt 2: HTML-Datei anpassen

In `pbl_consulting_final.html` zwei Zeilen einfügen:

### Im `<head>` (z.B. direkt vor `</head>`):
```html
<link rel="stylesheet" href="pbl_style_additions.css">
```

### Direkt vor `</body>`:
```html
<script src="pbl_animations.js"></script>
```

---

## Was die Dateien bewirken

| Animation | Beschreibung |
|-----------|-------------|
| **Hero Beams** | Goldene Lichtstrahlen im Hintergrund des Hero-Bereichs |
| **Partikel-Text** | Neue Section nach dem Hero – zeigt alle 6 Leistungen als Partikel-Text (7 Sek pro Begriff) |
| **Shader Prozess** | Goldene WebGL-Wellenlinien in der "Unsere Arbeitsweise"-Sektion |

---

## Voraussetzungen

Die Scripts suchen folgende HTML-IDs:
- `#hero` – Hero-Bereich
- `#prozess` – Prozess/Arbeitsweise-Sektion

Diese IDs müssen in der HTML-Datei vorhanden sein (bereits der Fall).

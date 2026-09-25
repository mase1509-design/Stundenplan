# Stundenplan

Eine kleine Progressive Web App (PWA) für iPhone und Android. Sie läuft komplett ohne Backend:
- GitHub Pages reicht als Hosting.
- Nach dem ersten Laden wird die App offline gecacht.
- Die aktuelle Unterrichtsstunde wird anhand der Geräte-Uhrzeit hervorgehoben.
- „Heute“ öffnet automatisch den aktuellen Wochentag.
- Die App kann auf iPhone und Android zum Home-Bildschirm hinzugefügt werden.

## GitHub Pages

1. Repository auf GitHub anlegen.
2. Den Inhalt dieses Ordners in das Repository laden.
3. In GitHub: **Settings → Pages → Deploy from a branch → main → /(root)**.
4. Die angezeigte GitHub-Pages-Adresse auf dem Smartphone öffnen.

### iPhone
In Safari öffnen → Teilen → **Zum Home-Bildschirm**.

### Android
In Chrome öffnen → Menü → **App installieren** bzw. **Zum Startbildschirm hinzufügen**.

## Stundenplan ändern

Alle Stunden stehen in `schedule.json`. Dort können Fach, Raum und weitere Stunden geändert werden. Die Uhrzeiten befinden sich ebenfalls dort.

## Daten aus den Vorlagen

Die Einträge wurden aus den beiden hochgeladenen Fotos übertragen. Bei handschriftlichen Kürzeln bleiben die Kürzel bewusst erhalten, damit keine Fächer geraten werden. Falls z. B. „O“ oder einzelne Raumkürzel anders gemeint sind, kann das direkt in `schedule.json` angepasst werden.

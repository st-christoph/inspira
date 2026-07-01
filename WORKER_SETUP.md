# Worker-Theming fuer den Inspira-Relay

Die Website sendet beim Laden des `iframe` bereits ein Theme per `postMessage`.

Gesendet wird dieses Format:

```js
{
  type: "inspira-theme",
  theme: {
    fontFamily,
    background,
    panel,
    border,
    text,
    muted,
    accent,
    translationSize,
    sourceSize
  }
}
```

Damit der Inhalt im `iframe` darauf reagiert, brauchst du im HTML/JS deines Cloudflare Workers zwei Dinge:

1. CSS-Variablen im Worker-HTML
2. Einen `message`-Listener, der die Werte entgegennimmt

## 1. CSS im Worker anpassen

Suche im Worker-HTML den `:root`-Block und ersetze oder ergaenze ihn etwa so:

```css
:root {
  color-scheme: light;
  --bg: transparent;
  --panel: rgba(255, 255, 255, 0.72);
  --border: rgba(15, 23, 42, 0.12);
  --text: #0f172a;
  --muted: #475569;
  --ok: #0f766e;
  --warn: #b45309;
  --error: #b91c1c;
  --translation-size: clamp(1.2rem, 3vw, 2.1rem);
  --source-size: clamp(0.95rem, 2vw, 1.15rem);
}
```

Und aendere die Stellen mit festen Schriftgroessen so:

```css
html, body {
  margin: 0;
  min-height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: Arial, Helvetica, Verdana, sans-serif;
}

.translation {
  font-size: var(--translation-size);
  line-height: 1.25;
  font-weight: 600;
  white-space: pre-wrap;
}

.source {
  font-size: var(--source-size);
  line-height: 1.35;
  color: var(--muted);
  white-space: pre-wrap;
}
```

## 2. JavaScript im Worker anpassen

Füge im Script des Workers diesen Block ein:

```js
function applyIncomingTheme(theme) {
  if (!theme || typeof theme !== "object") {
    return;
  }

  const root = document.documentElement;

  if (theme.background) {
    root.style.setProperty("--bg", theme.background);
  }
  if (theme.panel) {
    root.style.setProperty("--panel", theme.panel);
  }
  if (theme.border) {
    root.style.setProperty("--border", theme.border);
  }
  if (theme.text) {
    root.style.setProperty("--text", theme.text);
  }
  if (theme.muted) {
    root.style.setProperty("--muted", theme.muted);
  }
  if (theme.accent) {
    root.style.setProperty("--ok", theme.accent);
  }
  if (theme.translationSize) {
    root.style.setProperty("--translation-size", theme.translationSize);
  }
  if (theme.sourceSize) {
    root.style.setProperty("--source-size", theme.sourceSize);
  }
  if (theme.fontFamily) {
    document.body.style.fontFamily = theme.fontFamily;
  }
}

window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "inspira-theme") {
    return;
  }

  applyIncomingTheme(data.theme);
});
```

## 3. Test

Wenn du den Worker neu deployt hast, sollte beim Laden der GitHub-Pages-Seite der `iframe` die Farben und Schrift von der Host-Seite uebernehmen.

Wenn nichts passiert, liegt es fast immer daran, dass:

- der Listener im Worker-Script nicht wirklich ausgefuehrt wird
- die CSS-Variablen im Worker-HTML noch nicht verwendet werden
- eine alte Worker-Version noch gecacht ist

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

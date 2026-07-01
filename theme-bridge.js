function readThemeValue(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function buildLivestreamTheme() {
  return {
    fontFamily: readThemeValue("--iframe-font-family"),
    background: readThemeValue("--iframe-bg"),
    panel: readThemeValue("--iframe-panel"),
    border: readThemeValue("--iframe-panel-border"),
    text: readThemeValue("--iframe-text"),
    muted: readThemeValue("--iframe-muted"),
    accent: readThemeValue("--iframe-accent"),
    translationSize: readThemeValue("--iframe-translation-size"),
    sourceSize: readThemeValue("--iframe-source-size")
  };
}

function sendLivestreamTheme() {
  const iframe = document.getElementById("livestream-frame");
  if (!iframe || !iframe.contentWindow) {
    return;
  }

  iframe.contentWindow.postMessage(
    {
      type: "inspira-theme",
      theme: buildLivestreamTheme()
    },
    "*"
  );
}

window.applyLivestreamTheme = sendLivestreamTheme;

window.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("livestream-frame");
  if (!iframe) {
    return;
  }

  iframe.addEventListener("load", () => {
    sendLivestreamTheme();
    window.setTimeout(sendLivestreamTheme, 300);
  });

  sendLivestreamTheme();
});

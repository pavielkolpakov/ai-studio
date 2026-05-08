declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: {
        url: string;
        utm?: {
          utmCampaign?: string;
          utmSource?: string;
          utmMedium?: string;
          utmContent?: string;
          utmTerm?: string;
        };
        prefill?: Record<string, unknown>;
      }) => void;
    };
  }
}

let loaded = false;

function loadScript(): Promise<void> {
  if (loaded || window.Calendly) {
    loaded = true;
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => {
      loaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load Calendly"));
    document.head.appendChild(script);
  });
}

export async function openCalendlyPopup(sessionId?: string | null): Promise<void> {
  const url = import.meta.env.VITE_CALENDLY_URL;
  if (!url) {
    console.error("VITE_CALENDLY_URL is not set");
    return;
  }

  await loadScript();
  window.Calendly?.initPopupWidget({
    url,
    ...(sessionId ? { utm: { utmContent: sessionId } } : {}),
  });
}

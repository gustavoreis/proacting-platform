const GA_TRACKING_ID = process.env.NODE_ENV === "development" 
  ? "G-XXXXXXXXXX" 
  : process.env.NEXT_PUBLIC_GA_TRACKING_ID || "G-D1NRNCV53L";

export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, { page_path: url });
  }
};

export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export { GA_TRACKING_ID };

// Declaração global para o gtag
declare global {
  interface Window {
    gtag: (
      type: string,
      action: string,
      config?: {
        page_path?: string;
        event_category?: string;
        event_label?: string;
        value?: number;
      }
    ) => void;
  }
} 
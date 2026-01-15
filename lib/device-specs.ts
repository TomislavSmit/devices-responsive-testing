/**
 * Device specifications and types for viewport testing
 */

export interface DeviceSpec {
  id: string;
  name: string;
  width: number;
  height: number;
  userAgent: string;
  hasNotch?: boolean;
  borderRadius?: number;
}

export const DEVICE_SPECS: DeviceSpec[] = [
  {
    id: "samsung-galaxy-s24",
    name: "Samsung Galaxy S24",
    width: 360,
    height: 800,
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    hasNotch: false,
    borderRadius: 40,
  },
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    width: 393,
    height: 852,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    hasNotch: true,
    borderRadius: 55,
  },
  {
    id: "google-pixel-8",
    name: "Google Pixel 8",
    width: 412,
    height: 915,
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    hasNotch: false,
    borderRadius: 42,
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    width: 820,
    height: 1180,
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    hasNotch: false,
    borderRadius: 18,
  },
  {
    id: "macbook-air-13",
    name: "MacBook Air 13\"",
    width: 1440,
    height: 900,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    hasNotch: false,
    borderRadius: 8,
  },
];

/**
 * Validates if a URL is properly formatted
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Ensures URL has a protocol
 */
export function normalizeUrl(url: string): string {
  if (!url) return "";

  // If no protocol, add https://
  if (!url.match(/^https?:\/\//i)) {
    return `https://${url}`;
  }

  return url;
}

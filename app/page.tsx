"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { UrlInput } from "@/components/url-input";
import { DeviceFrame } from "@/components/device-frame";
import { ThemeToggle } from "@/components/theme-toggle";
import { DEVICE_SPECS } from "@/lib/device-specs";
import { Monitor } from "lucide-react";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState("");

  // Load URL from query params on mount
  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam) {
      setCurrentUrl(urlParam);
    }
  }, [searchParams]);

  const handleUrlLoad = (url: string) => {
    setCurrentUrl(url);

    // Update URL query params
    const params = new URLSearchParams(searchParams.toString());
    if (url) {
      params.set("url", url);
    } else {
      params.delete("url");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleDeviceUrlChange = (newUrl: string) => {
    // Sync all devices and UrlInput when one device navigates
    setCurrentUrl((prev) => {
      if (prev !== newUrl) {
        return newUrl;
      } else {
        // Force update to trigger reload even if URL is the same
        return "";
      }
    });

    // Always update URL query params
    const params = new URLSearchParams(searchParams.toString());
    params.set("url", newUrl);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="w-full">
        {/* Compact Header */}
        <div className="border-b bg-card">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <h1 className="text-sm font-semibold">Device Viewport Tester</h1>
            </div>
            <ThemeToggle />
          </div>

          {/* URL Input */}
          <div className="px-4 pb-2">
            <UrlInput onUrlLoad={handleUrlLoad} initialUrl={currentUrl} />
          </div>

          {/* Compact Browser Warning */}
          {!currentUrl && (
            <div className="mx-4 mb-2 rounded border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 px-3 py-2">
              <p className="text-xs text-amber-800 dark:text-amber-300">
                <strong>Note:</strong> Brave/Firefox users may need to disable Shields. For your own sites: viewport injection works for same-origin only. External sites use their own responsive design.
              </p>
            </div>
          )}
        </div>

        {/* Device Row - Full Width */}
        <div className="flex gap-2 p-2 overflow-x-auto">
          {DEVICE_SPECS.map((device) => (
            <DeviceFrame
              key={device.id}
              device={device}
              url={currentUrl}
              onUrlChange={handleDeviceUrlChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

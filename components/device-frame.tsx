"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeviceSpec } from "@/lib/device-specs";
import { RefreshCw, AlertCircle } from "lucide-react";

interface DeviceFrameProps {
  device: DeviceSpec;
  url: string;
  onUrlChange?: (url: string) => void;
}

export function DeviceFrame({ device, url, onUrlChange }: DeviceFrameProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [key, setKey] = useState(0);
  const [currentIframeUrl, setCurrentIframeUrl] = useState(url);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTrackingUrl = useRef(false);

  // Sync url prop to currentIframeUrl state only
  useEffect(() => {
    if (url !== currentIframeUrl) {
      setCurrentIframeUrl(url);
    }
    // No side effects here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // Handle loading, error, and key when currentIframeUrl changes
  useEffect(() => {
    if (currentIframeUrl) {
      setIsLoading(true);
      setError(false);
      setErrorMessage("");
      setKey((prev) => prev + 1);

      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        setError(true);
        setErrorMessage("Timeout: Page took too long to load (>30s)");
      }, 30000);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIframeUrl]);

  // Track iframe URL changes for same-origin iframes (supports client-side routing)
  useEffect(() => {
    if (!iframeRef.current || !onUrlChange) return;

    const iframe = iframeRef.current;
    let lastUrl = currentIframeUrl;

    const checkIframeUrl = () => {
      try {
        if (iframe && iframe.contentWindow) {
          const iframeLocation = iframe.contentWindow.location.href;

          if (
            iframeLocation &&
            iframeLocation !== 'about:blank' &&
            iframeLocation !== lastUrl
          ) {
            lastUrl = iframeLocation;

            // Only update if different from url prop (prevent loops)
            if (iframeLocation !== url) {
              setCurrentIframeUrl(iframeLocation);

              if (!isTrackingUrl.current) {
                isTrackingUrl.current = true;
                onUrlChange(iframeLocation);
                setTimeout(() => {
                  isTrackingUrl.current = false;
                }, 100);
              }
            }
          }
        }
      } catch {
        // Cross-origin - can't access iframe URL
      }
    };

    // Poll for URL changes (catches both real navigation and client-side routing)
    const interval = setInterval(checkIframeUrl, 100); // Faster polling for better UX

    // Also listen to iframe load events for real navigation
    const handleLoad = () => {
      checkIframeUrl();
    };

    iframe.addEventListener('load', handleLoad);

    // Listen to popstate events in iframe for back/forward navigation
    try {
      iframe.contentWindow?.addEventListener('popstate', checkIframeUrl);
      iframe.contentWindow?.addEventListener('hashchange', checkIframeUrl);
    } catch {
      // Cross-origin - can't add listeners
    }

    return () => {
      clearInterval(interval);
      iframe.removeEventListener('load', handleLoad);
      try {
        iframe.contentWindow?.removeEventListener('popstate', checkIframeUrl);
        iframe.contentWindow?.removeEventListener('hashchange', checkIframeUrl);
      } catch {
        // Cross-origin cleanup
      }
    };
  }, [currentIframeUrl, onUrlChange, url]);

  const handleIframeLoad = () => {
    // Clear the timeout when iframe loads successfully
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsLoading(false);
    setError(false);

    // Try to inject viewport meta tag and set user agent for proper mobile rendering
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentDocument) {
        const iframeDoc = iframe.contentDocument;

        // Check if viewport meta tag exists
        let viewportMeta = iframeDoc.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;

        if (!viewportMeta) {
          // Create and inject viewport meta tag
          viewportMeta = iframeDoc.createElement('meta') as HTMLMetaElement;
          viewportMeta.name = 'viewport';
          viewportMeta.content = `width=${device.width}, initial-scale=1.0, maximum-scale=1.0, user-scalable=no`;

          const head = iframeDoc.head || iframeDoc.getElementsByTagName('head')[0];
          if (head) {
            head.appendChild(viewportMeta);
          }
        } else {
          // Update existing viewport meta tag
          viewportMeta.content = `width=${device.width}, initial-scale=1.0, maximum-scale=1.0, user-scalable=no`;
        }

        // Force a reflow to apply viewport changes
        void iframeDoc.body?.offsetHeight;
      }
    } catch (e) {
      // Cross-origin restrictions prevent meta tag injection
      // This is expected for external sites - they'll use their own responsive design
      console.log('Cannot inject viewport meta (cross-origin):', e);
    }
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError(true);
  };

  const handleReload = () => {
    setIsLoading(true);
    setError(false);
    setKey((prev) => prev + 1);
  };

  return (
    <div
      className="shrink-0 border rounded-lg bg-card overflow-hidden"
      style={{
        width: `${device.width}px`,
      }}
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between px-2 py-1 border-b bg-muted/30">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium">{device.name}</span>
          <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
            {device.width}×{device.height}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReload}
          disabled={!url || isLoading}
          className="h-6 w-6 p-0"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Device Display */}
      <div className="bg-muted/10">
        <div
          className="relative bg-white dark:bg-gray-950 shadow border rounded overflow-hidden"
          style={{
            width: `${device.width}px`,
            height: `${device.height}px`,
          }}
        >
          {!url && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-[10px]">
              Enter URL above
            </div>
          )}

          {url && (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
                  <div className="flex flex-col items-center gap-1">
                    <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-[10px] text-muted-foreground">Loading...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-background z-10 p-2">
                  <div className="flex flex-col gap-1 rounded border border-destructive bg-destructive/10 p-2 max-w-70">
                    <div className="flex items-start gap-1.5">
                      <AlertCircle className="h-3 w-3 text-destructive mt-0.5 shrink-0" />
                      <p className="text-[10px] text-destructive leading-tight font-medium">
                        {errorMessage || "Failed to load"}
                      </p>
                    </div>
                    {!errorMessage && (
                      <p className="text-[9px] text-destructive/80 leading-tight ml-4.5">
                        Possible causes: iframe blocking, server down, or browser shields
                      </p>
                    )}
                  </div>
                </div>
              )}

              <iframe
                key={key}
                ref={iframeRef}
                src={url}
                className="w-full h-full border-0"
                style={{
                  width: `${device.width}px`,
                  height: `${device.height}px`,
                }}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={`${device.name} viewport`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

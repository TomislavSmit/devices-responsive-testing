"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isValidUrl, normalizeUrl, isMixedContent } from "@/lib/device-specs";
import { AlertCircle, Globe, AlertTriangle } from "lucide-react";

interface UrlInputProps {
  onUrlLoad: (url: string) => void;
  initialUrl?: string;
}

export function UrlInput({ onUrlLoad, initialUrl }: UrlInputProps) {
  const [url, setUrl] = useState(initialUrl || "");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  // Update input when initialUrl changes (from query params or device navigation)
  useEffect(() => {
    if (initialUrl !== undefined && initialUrl !== url) {
      setUrl(initialUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

  const handleLoad = () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    const normalizedUrl = normalizeUrl(url.trim());

    if (!isValidUrl(normalizedUrl)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setError("");
    
    // Check for mixed content
    if (isMixedContent(normalizedUrl)) {
      setWarning("HTTP sites cannot be loaded on HTTPS pages due to browser security. To test HTTP/localhost sites, run this app locally.");
    } else {
      setWarning("");
    }
    
    onUrlLoad(normalizedUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLoad();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter website URL (e.g., example.com or https://example.com)"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
        </div>
        <Button onClick={handleLoad} size="default">
          Load URL
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {warning && (
        <Alert className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

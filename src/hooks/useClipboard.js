import { useState, useCallback, useEffect, useRef } from 'react';

export function useClipboard(text) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);
  const mountedRef = useRef(true);

  // Track mount state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = useCallback(async () => {
    if (!text) return;

    // Clear any pending timeout from a previous copy
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    if (mountedRef.current) {
      setCopied(true);
      timeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setCopied(false);
          timeoutRef.current = null;
        }
      }, 2000);
    }
  }, [text]);

  return { copied, copy };
}
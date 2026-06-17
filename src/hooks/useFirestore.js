import { useState, useCallback, useRef, useEffect } from 'react';
import { performSave as saveExportDataService } from '../services/firestore';

export function useFirestore() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const isMountedRef = useRef(true);
  const controllerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Abort any ongoing operation
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
    };
  }, []);

  /**
   * Save export data to Firestore.
   * @param {Object} data – the data to save.
   * @param {Object} [options] – optional settings.
   * @param {AbortSignal} [options.signal] – external abort signal.
   * @returns {Promise<string|null>} docId if successful.
   */
  const performSave = useCallback(async (data, options = {}) => {
    if (!isMountedRef.current) return null;

    // Abort any previous save still in progress
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Create a new controller – merge with external signal if provided
    const controller = new AbortController();
    controllerRef.current = controller;

    // If consumer gave a signal, forward its abort to our controller
    if (options.signal) {
      options.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
      setSuccess(false);
    }

    try {
      const docId = await saveExportDataService(data, { signal: controller.signal });
      controllerRef.current = null;
      if (isMountedRef.current) {
        setLoading(false);
        setSuccess(true);
      }
      return docId;
    } catch (err) {
      if (err.name === 'AbortError') {
        // Operation was cancelled – no state update needed
        controllerRef.current = null;
        return null;
      }
      console.error('Firestore save failed:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
        setSuccess(false);
      }
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    // Abort any in‑flight save
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    if (isMountedRef.current) {
      setLoading(false);
      setError(null);
      setSuccess(false);
    }
  }, []);

  return { performSave, loading, error, success, reset };
}
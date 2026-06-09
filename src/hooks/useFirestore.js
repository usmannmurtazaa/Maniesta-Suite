import { useState, useCallback, useRef, useEffect } from 'react';
import { saveExportData as saveExportDataService } from '../services/firestore';

export function useFirestore() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => { isMountedRef.current = false; };
  }, []);

  const saveExportData = useCallback(async (data) => {
    if (!isMountedRef.current) return null;
    setLoading(true);
    setError(null);
    try {
      const docId = await saveExportDataService(data);
      if (isMountedRef.current) setLoading(false);
      return docId;
    } catch (err) {
      console.error('Firestore save failed:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    if (isMountedRef.current) {
      setLoading(false);
      setError(null);
    }
  }, []);

  return { saveExportData, loading, error, reset };
}
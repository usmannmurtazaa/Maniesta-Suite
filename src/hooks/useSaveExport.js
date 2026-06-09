// hooks/useSaveExport.js
import { useState, useCallback, useRef, useEffect } from 'react';
import { saveExportData } from '../services/firestore.js';

export function useSaveExport() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const controllerRef = useRef(null);

    const abort = useCallback(() => {
        if (controllerRef.current) {
            controllerRef.current.abort();
            controllerRef.current = null;
        }
    }, []);

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setSuccess(false);
    }, []);

    const save = useCallback(async (data) => {
        if (controllerRef.current) {
            controllerRef.current.abort();
            controllerRef.current = null;
        }

        const controller = new AbortController();
        controllerRef.current = controller;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const docId = await saveExportData(data, { signal: controller.signal });
            controllerRef.current = null;
            setLoading(false);
            setSuccess(true);
            return docId;
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err);
                setSuccess(false);
            }
            setLoading(false);
            throw err;
        }
    }, []);

    useEffect(() => {
        return () => {
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
        };
    }, []);

    return { save, loading, error, success, abort, reset };
}

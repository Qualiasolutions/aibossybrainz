"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { CanvasType } from "@/lib/supabase/types";

interface UseCanvasPersistenceOptions<T> {
  canvasType: CanvasType;
  defaultData: T;
  transformForSave?: (data: T) => unknown;
  transformFromLoad?: (data: unknown) => T;
}

interface UseCanvasPersistenceReturn<T> {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  canvasId: string | null;
  isSaving: boolean;
  isLoading: boolean;
  lastSaved: Date | null;
  saveNow: () => Promise<void>;
}

export function useCanvasPersistence<T>({
  canvasType,
  defaultData,
  transformForSave,
  transformFromLoad,
}: UseCanvasPersistenceOptions<T>): UseCanvasPersistenceReturn<T> {
  const [data, setData] = useState<T>(defaultData);
  const [canvasId, setCanvasId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const hasLoadedRef = useRef(false);
  const isInitialLoadRef = useRef(true);

  // Load saved canvas on mount
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    async function loadCanvas() {
      try {
        const res = await fetch(`/api/canvas?type=${canvasType}`);
        if (res.ok) {
          const canvas = await res.json();
          if (canvas?.data) {
            setCanvasId(canvas.id);
            const loadedData = transformFromLoad
              ? transformFromLoad(canvas.data)
              : (canvas.data as T);
            setData(loadedData);
          }
        }
      } catch (error) {
        console.warn("[Canvas] Failed to load:", error);
      } finally {
        setIsLoading(false);
        // After a short delay, mark initial load as complete
        setTimeout(() => {
          isInitialLoadRef.current = false;
        }, 500);
      }
    }

    loadCanvas();
  }, [canvasType, transformFromLoad]);

  // Debounced save function
  const debouncedSave = useDebouncedCallback(
    async (dataToSave: T) => {
      // Skip save during initial load
      if (isInitialLoadRef.current) return;

      setIsSaving(true);
      try {
        const saveData = transformForSave
          ? transformForSave(dataToSave)
          : dataToSave;

        const res = await fetch("/api/canvas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            canvasType,
            data: saveData,
            canvasId,
            isDefault: true,
          }),
        });

        if (res.ok) {
          const result = await res.json();
          if (result.id && !canvasId) {
            setCanvasId(result.id);
          }
          setLastSaved(new Date());
        }
      } catch (error) {
        console.warn("[Canvas] Failed to save:", error);
      } finally {
        setIsSaving(false);
      }
    },
    2000, // 2 second debounce
  );

  // Auto-save when data changes (after initial load)
  useEffect(() => {
    if (!isInitialLoadRef.current && !isLoading) {
      debouncedSave(data);
    }
  }, [data, debouncedSave, isLoading]);

  // Manual save function
  const saveNow = useCallback(async () => {
    debouncedSave.cancel();
    setIsSaving(true);
    try {
      const saveData = transformForSave ? transformForSave(data) : data;

      const res = await fetch("/api/canvas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          canvasType,
          data: saveData,
          canvasId,
          isDefault: true,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.id && !canvasId) {
          setCanvasId(result.id);
        }
        setLastSaved(new Date());
      }
    } catch (error) {
      console.warn("[Canvas] Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  }, [canvasId, canvasType, data, debouncedSave, transformForSave]);

  return {
    data,
    setData,
    canvasId,
    isSaving,
    isLoading,
    lastSaved,
    saveNow,
  };
}

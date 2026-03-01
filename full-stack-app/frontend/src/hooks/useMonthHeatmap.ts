/**
 * Hook pour la heatmap du calendrier mensuel
 */

import { useState, useEffect, useCallback } from 'react';
import type { DayHeatmapEntry } from '../types/posts';
import { getMonthHeatmap } from '../services/mock/posts';

export function useMonthHeatmap(year: number, month: number) {
  const [heatmap, setHeatmap] = useState<DayHeatmapEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    getMonthHeatmap(year, month)
      .then(setHeatmap)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year, month]);

  useEffect(() => {
    load();
  }, [load]);

  return { heatmap, loading, refresh: load };
}

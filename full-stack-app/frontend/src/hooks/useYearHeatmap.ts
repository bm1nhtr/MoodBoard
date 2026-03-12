/**
 * Hook pour la heatmap des 12 mois (vue principale) — données réelles MongoDB
 */

import { useState, useEffect, useCallback } from 'react';
import type { DayHeatmapEntry } from '../types/posts';
import { getYearHeatmap } from '../services/api/heatmap';

export function useYearHeatmap(year: number) {
  const [heatmapByMonth, setHeatmapByMonth] = useState<Record<number, DayHeatmapEntry[]>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    getYearHeatmap(year)
      .then(setHeatmapByMonth)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year]);

  useEffect(() => {
    load();
  }, [load]);

  return { heatmapByMonth, loading, refresh: load };
}

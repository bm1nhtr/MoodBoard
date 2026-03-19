/**
 * Hook pour la heatmap annuelle : charge les données des 12 mois depuis l'API.
 * Regroupe les entrées par mois (Record<numéro_mois, DayHeatmapEntry[]>).
 */

import { useState, useEffect, useCallback } from 'react';
import type { DayHeatmapEntry } from '../types/posts';
import { getYearHeatmap } from '../services/api/heatmap';

export function useYearHeatmap(year: number) {
  /** Données heatmap indexées par mois (1 = janvier, 12 = décembre). */
  const [heatmapByMonth, setHeatmapByMonth] = useState<Record<number, DayHeatmapEntry[]>>({});
  const [loading, setLoading] = useState(true);

  /** Récupère les données heatmap de toute l'année depuis le backend. */
  const load = useCallback(() => {
    setLoading(true);
    getYearHeatmap(year)
      .then(setHeatmapByMonth)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year]);

  // Charge les données au montage et à chaque changement d'année
  useEffect(() => {
    load();
  }, [load]);

  return { heatmapByMonth, loading, refresh: load };
}

/**
 * Service API pour la heatmap annuelle.
 * Récupère les données agrégées de l'année et les regroupe par mois.
 */

import type { DayHeatmapEntry } from '../../types/posts';

/**
 * Charge toutes les entrées heatmap d'une année (GET /api/notes/heatmap?year=...).
 * Retourne un dictionnaire indexé par numéro de mois (1–12),
 * chaque valeur étant la liste des jours actifs du mois.
 */
export async function getYearHeatmap(year: number): Promise<Record<number, DayHeatmapEntry[]>> {
  const res = await fetch(`/api/notes/heatmap?year=${year}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Erreur chargement heatmap');
  const entries: DayHeatmapEntry[] = await res.json();

  // Initialise tous les mois avec un tableau vide
  const byMonth: Record<number, DayHeatmapEntry[]> = {};
  for (let m = 1; m <= 12; m++) byMonth[m] = [];

  // Répartit chaque entrée dans le tableau du mois correspondant
  entries.forEach((entry) => {
    const month = parseInt(entry.date.slice(5, 7), 10);
    if (byMonth[month]) byMonth[month].push(entry);
  });

  return byMonth;
}

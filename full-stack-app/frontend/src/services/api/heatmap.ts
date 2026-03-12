import type { DayHeatmapEntry } from '../../types/posts';

export async function getYearHeatmap(year: number): Promise<Record<number, DayHeatmapEntry[]>> {
  const res = await fetch(`/api/notes/heatmap?year=${year}`);
  if (!res.ok) throw new Error('Erreur chargement heatmap');
  const entries: DayHeatmapEntry[] = await res.json();

  const byMonth: Record<number, DayHeatmapEntry[]> = {};
  for (let m = 1; m <= 12; m++) byMonth[m] = [];

  entries.forEach((entry) => {
    const month = parseInt(entry.date.slice(5, 7), 10);
    if (byMonth[month]) byMonth[month].push(entry);
  });

  return byMonth;
}

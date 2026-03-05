/**
 * Heatmap transposée : en colonnes = mois (12), en lignes = jour du mois (1–31).
 * Affichage vertical, prévue pour ~1/3 de largeur écran.
 */

import { useMemo, type FC } from 'react';
import type { DayHeatmapEntry } from '../../types/posts';
import { MOOD_VISUALS } from '../../constants/moodVisuals';
import './HeatmapView.css';

const MONTH_NAMES = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
  'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc',
];

interface HeatmapViewProps {
  year: number;
  heatmapByMonth: Record<number, DayHeatmapEntry[]>;
  accessibleDates: string[];
  onSelectDay: (date: string) => void;
}

function getDayColor(day: DayHeatmapEntry | null): string {
  if (!day || day.noteCount === 0) return 'var(--color-bg)';
  const color = day.dominantMood ? MOOD_VISUALS[day.dominantMood].color : 'var(--color-border)';
  const alpha = 0.3 + 0.6 * day.intensity;
  return hexToRgba(color, alpha);
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const HeatmapView: FC<HeatmapViewProps> = ({
  year,
  heatmapByMonth,
  accessibleDates,
  onSelectDay,
}) => {
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const accessibleSet = useMemo(() => new Set(accessibleDates), [accessibleDates]);
  const byDate = useMemo(() => {
    const map: Record<string, DayHeatmapEntry> = {};
    for (let m = 1; m <= 12; m++) {
      const entries = heatmapByMonth[m] ?? [];
      entries.forEach((e) => { map[e.date] = e; });
    }
    return map;
  }, [heatmapByMonth]);

  const daysInMonth = (month: number) => new Date(year, month, 0).getDate();

  const handleCellClick = (dateStr: string) => {
    if (!accessibleSet.has(dateStr)) return;
    onSelectDay(dateStr);
  };

  return (
    <div className="heatmap-view heatmap-view--vertical">
      <h2 className="heatmap-view__section-title">Année</h2>
      <div className="heatmap-view__grid-wrap heatmap-view__grid-wrap--transpose">
        <div className="heatmap-view__row heatmap-view__row--header">
          <span className="heatmap-view__day-label heatmap-view__day-label--header" />
          {MONTH_NAMES.map((label) => (
            <span key={label} className="heatmap-view__month-header">
              {label}
            </span>
          ))}
        </div>
        {Array.from({ length: 31 }, (_, dayIdx) => {
          const dayNum = dayIdx + 1;
          return (
            <div key={dayNum} className="heatmap-view__row">
              <span className="heatmap-view__day-label">{dayNum}</span>
              {MONTH_NAMES.map((_, monthIdx) => {
                const month = monthIdx + 1;
                const days = daysInMonth(month);
                const isInMonth = dayNum <= days;
                const dateStr = isInMonth
                  ? `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
                  : '';
                const entry = dateStr ? byDate[dateStr] ?? null : null;
                const isToday = dateStr === todayStr;
                const isFuture = dateStr > todayStr;
                const canOpen = dateStr && !isFuture && accessibleSet.has(dateStr);
                const hasColor = entry && entry.noteCount > 0;
                return (
                  <button
                    key={month}
                    type="button"
                    className={`heatmap-view__cell ${!isInMonth ? 'heatmap-view__cell--empty' : ''} ${isToday ? 'heatmap-view__cell--today' : ''} ${isFuture ? 'heatmap-view__cell--future' : ''} ${hasColor && !canOpen ? 'heatmap-view__cell--locked' : ''}`}
                    style={isInMonth ? { backgroundColor: getDayColor(entry) } : undefined}
                    onClick={() => handleCellClick(dateStr)}
                    disabled={!isInMonth || isFuture}
                    title={
                      dateStr
                        ? canOpen
                          ? (entry?.noteCount ? `${entry.noteCount} note(s)` : 'Ouvrir')
                          : hasColor
                            ? 'À partir du 1er mars'
                            : dateStr
                        : ''
                    }
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeatmapView;

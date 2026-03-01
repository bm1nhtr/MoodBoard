/**
 * Vue principale : heatmap 12 mois. Les jours avec des notes sont colorés.
 * Clic sur un jour → ouvrir le board (démo : seuls 1er, 2 et 3 mars accessibles).
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
  /** Jours dont on peut ouvrir le board (démo : 1, 2, 3 mars uniquement) */
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
    <div className="heatmap-view">
      <section className="heatmap-view__section heatmap-view__heatmap-section">
        <h2 className="heatmap-view__section-title">Votre année en couleurs</h2>
        <div className="heatmap-view__grid-wrap">
          <div className="heatmap-view__row heatmap-view__row--header">
            <span className="heatmap-view__month-label heatmap-view__month-label--header" />
            {Array.from({ length: 31 }, (_, i) => (
              <span key={i} className="heatmap-view__day-header">
                {i + 1}
              </span>
            ))}
          </div>
          {MONTH_NAMES.map((label, idx) => {
            const month = idx + 1;
            const days = daysInMonth(month);
            return (
              <div key={month} className="heatmap-view__row">
                <span className="heatmap-view__month-label">{label}</span>
                {Array.from({ length: 31 }, (_, i) => {
                  const dayNum = i + 1;
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
                      key={dayNum}
                      type="button"
                      className={`heatmap-view__cell ${!isInMonth ? 'heatmap-view__cell--empty' : ''} ${isToday ? 'heatmap-view__cell--today' : ''} ${isFuture ? 'heatmap-view__cell--future' : ''} ${hasColor && !canOpen ? 'heatmap-view__cell--locked' : ''}`}
                      style={isInMonth ? { backgroundColor: getDayColor(entry) } : undefined}
                      onClick={() => handleCellClick(dateStr)}
                      disabled={!isInMonth || isFuture}
                      title={
                        dateStr
                          ? canOpen
                            ? (entry?.noteCount ? `${entry.noteCount} note(s) — Cliquer pour ouvrir` : 'Ouvrir le board')
                            : hasColor
                              ? 'Démo : accès limité au 1er, 2 et 3 mars'
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
      </section>

      <div className="heatmap-view__hint" role="status">
        <p className="heatmap-view__hint-text">
          Les jours colorés indiquent des notes. Cliquez sur un jour pour ouvrir le Mood Board.
        </p>
        <p className="heatmap-view__hint-demo">
          Démo : seuls le <strong>1er</strong>, <strong>2</strong> et <strong>3 mars</strong> sont accessibles.
        </p>
      </div>
    </div>
  );
};

export default HeatmapView;

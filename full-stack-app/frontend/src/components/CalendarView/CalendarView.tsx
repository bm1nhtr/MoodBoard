/**
 * Vue calendrier mensuel : heatmap par jour, clic → ouvrir le board du jour
 */

import type { FC } from 'react';
import type { DayHeatmapEntry } from '../../types/posts';
import { MOOD_VISUALS } from '../../constants/moodVisuals';
import './CalendarView.css';

interface CalendarViewProps {
  year: number;
  month: number;
  heatmap: DayHeatmapEntry[];
  onSelectDay: (date: string) => void;
}

const CalendarView: FC<CalendarViewProps> = ({ year, month, heatmap, onSelectDay }) => {
  const monthLabel = new Date(year, month - 1).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });
  const today = new Date().toISOString().slice(0, 10);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const startOffset = (firstDay + 6) % 7;

  return (
    <div className="calendar-view">
      <h2 className="calendar-view__title">{monthLabel}</h2>
      <div className="calendar-view__weekdays">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
          <span key={d} className="calendar-view__weekday">{d}</span>
        ))}
      </div>
      <div className="calendar-view__grid">
        {Array.from({ length: startOffset }, (_, i) => (
          <div key={`pad-${i}`} className="calendar-view__day calendar-view__day--empty" />
        ))}
        {heatmap.map((day) => {
          const isFuture = day.date > today;
          const color = getDayColor(day);
          const isToday = day.date === today;
          return (
            <button
              key={day.date}
              type="button"
              className={`calendar-view__day ${isToday ? 'calendar-view__day--today' : ''} ${isFuture ? 'calendar-view__day--future' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => !isFuture && onSelectDay(day.date)}
              disabled={isFuture}
              title={day.noteCount > 0 ? `${day.noteCount} note(s)` : day.date}
            >
              <span className="calendar-view__day-num">{new Date(day.date + 'T12:00:00').getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/** Couleur du jour : humeur dominante avec opacité selon intensité */
function getDayColor(day: DayHeatmapEntry): string {
  if (day.noteCount === 0) return 'var(--color-bg)';
  const color = day.dominantMood ? MOOD_VISUALS[day.dominantMood].color : 'var(--color-border)';
  const alpha = 0.25 + 0.65 * day.intensity;
  return hexToRgba(color, alpha);
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default CalendarView;

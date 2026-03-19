/**
 * Heatmap annuelle transposée : colonnes = mois (Jan–Déc), lignes = jour du mois (1–31).
 * Chaque cellule représente un jour : couleur = humeur dominante, opacité = nombre de cadres.
 * Un clic sur une cellule accessible charge le board du jour correspondant.
 */

import { useMemo, type FC } from 'react';
import type { DayHeatmapEntry } from '../../types/posts';
import { MOOD_VISUALS } from '../../constants/moodVisuals';
import './HeatmapView.css';

/** Abréviations des mois en français pour les en-têtes de colonnes. */
const MONTH_NAMES = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
  'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc',
];

interface HeatmapViewProps {
  /** Année affichée */
  year: number;
  /** Données heatmap indexées par numéro de mois (1–12) */
  heatmapByMonth: Record<number, DayHeatmapEntry[]>;
  /** Ensemble des dates cliquables (du 1er janv. à aujourd'hui) */
  accessibleDates: string[];
  /** Callback déclenché quand l'utilisateur clique sur un jour */
  onSelectDay: (date: string) => void;
}

/**
 * Calcule la couleur de fond d'une cellule en fonction de l'humeur et de l'intensité.
 * Jours sans contenu : couleur de fond par défaut.
 * Jours avec contenu : couleur du mood à une opacité entre 30 % et 90 %.
 */
function getDayColor(day: DayHeatmapEntry | null): string {
  if (!day || day.noteCount === 0) return 'var(--color-bg)';
  const color = day.dominantMood ? MOOD_VISUALS[day.dominantMood].color : 'var(--color-border)';
  const alpha = 0.3 + 0.6 * day.intensity;
  return hexToRgba(color, alpha);
}

/** Convertit une couleur hexadécimale en rgba avec un canal alpha donné. */
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
  /** Date d'aujourd'hui au format YYYY-MM-DD (pour surligner la cellule courante). */
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  /** Ensemble des dates accessibles pour vérifier en O(1) si une date est cliquable. */
  const accessibleSet = useMemo(() => new Set(accessibleDates), [accessibleDates]);

  /** Index plat date → entrée heatmap pour un accès direct depuis les cellules. */
  const byDate = useMemo(() => {
    const map: Record<string, DayHeatmapEntry> = {};
    for (let m = 1; m <= 12; m++) {
      const entries = heatmapByMonth[m] ?? [];
      entries.forEach((e) => { map[e.date] = e; });
    }
    return map;
  }, [heatmapByMonth]);

  /** Retourne le nombre de jours dans un mois donné pour l'année courante. */
  const daysInMonth = (month: number) => new Date(year, month, 0).getDate();

  /** Charge le board du jour si la cellule est cliquable (passé ou aujourd'hui). */
  const handleCellClick = (dateStr: string) => {
    if (!accessibleSet.has(dateStr)) return;
    onSelectDay(dateStr);
  };

  return (
    <div className="heatmap-view heatmap-view--vertical">
      <h2 className="heatmap-view__section-title">Année</h2>

      <div className="heatmap-view__grid-wrap heatmap-view__grid-wrap--transpose">
        {/* Ligne d'en-tête : noms des mois */}
        <div className="heatmap-view__row heatmap-view__row--header">
          <span className="heatmap-view__day-label heatmap-view__day-label--header" />
          {MONTH_NAMES.map((label) => (
            <span key={label} className="heatmap-view__month-header">
              {label}
            </span>
          ))}
        </div>

        {/* Une ligne par numéro de jour (1 à 31) */}
        {Array.from({ length: 31 }, (_, dayIdx) => {
          const dayNum = dayIdx + 1;
          return (
            <div key={dayNum} className="heatmap-view__row">
              {/* Numéro de jour en étiquette de ligne */}
              <span className="heatmap-view__day-label">{dayNum}</span>

              {/* Une cellule par mois */}
              {MONTH_NAMES.map((_, monthIdx) => {
                const month = monthIdx + 1;
                const days = daysInMonth(month);
                const isInMonth = dayNum <= days;  // certains mois ont moins de 31 jours
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

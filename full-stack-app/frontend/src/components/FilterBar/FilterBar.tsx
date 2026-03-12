/**
 * Barre de filtre par humeur + option "Tout effacer"
 */

import type { FC } from 'react';
import type { MoodId } from '../../types/posts';
import { MOOD_OPTIONS } from '../../services/mock/posts';
import './FilterBar.css';

interface FilterBarProps {
  currentMood: MoodId | null;
  onSelectMood: (mood: MoodId | null) => void;
}

const FilterBar: FC<FilterBarProps> = ({ currentMood, onSelectMood }) => {
  return (
    <nav className="filter-bar" role="navigation" aria-label="Filtrer par humeur">
      <button
        type="button"
        className={`filter-bar__chip ${currentMood === null ? 'filter-bar__chip--active' : ''}`}
        onClick={() => onSelectMood(null)}
      >
        Tous
      </button>
      {MOOD_OPTIONS.map((mood) => (
        <button
          key={mood.id}
          type="button"
          className={`filter-bar__chip ${currentMood === mood.id ? 'filter-bar__chip--active' : ''}`}
          onClick={() => onSelectMood(mood.id)}
        >
          {mood.label}
        </button>
      ))}
    </nav>
  );
};

export default FilterBar;

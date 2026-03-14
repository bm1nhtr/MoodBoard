/**
 * Sélecteur d’humeur : couleur + label (1 couleur = 1 état fixe, pour éviter les biais)
 */

import type { FC } from 'react';
import type { MoodId } from '../../types/posts';
import { MOOD_VISUALS, MOOD_IDS } from '../../constants/moodVisuals';
import './MoodPicker.css';

interface MoodPickerProps {
  value: MoodId;
  onChange: (mood: MoodId) => void;
  disabled?: boolean;
}

const MoodPicker: FC<MoodPickerProps> = ({ value, onChange, disabled = false }) => {
  return (
    <div className={`mood-picker${disabled ? ' mood-picker--disabled' : ''}`} role="group" aria-label="Choisir un état émotionnel">
      {MOOD_IDS.map((id) => {
        const visual = MOOD_VISUALS[id];
        const isActive = value === id;
        return (
          <button
            key={id}
            type="button"
            className={`mood-picker__item ${visual.className} ${isActive ? 'mood-picker__item--active' : ''}`}
            onClick={() => { if (!disabled) onChange(id); }}
            aria-pressed={isActive}
            aria-label={visual.label}
            disabled={disabled}
          >
            <span className="mood-picker__dot" style={{ backgroundColor: visual.color }} />
            <span className="mood-picker__label">{visual.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MoodPicker;

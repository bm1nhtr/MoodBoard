/**
 * Sélecteur d’humeur : couleur + label (1 màu = 1 trạng thái cố định, tránh biais)
 */

import type { FC } from 'react';
import type { MoodId } from '../../types/posts';
import { MOOD_VISUALS, MOOD_IDS } from '../../constants/moodVisuals';
import './MoodPicker.css';

interface MoodPickerProps {
  value: MoodId;
  onChange: (mood: MoodId) => void;
}

const MoodPicker: FC<MoodPickerProps> = ({ value, onChange }) => {
  return (
    <div className="mood-picker" role="group" aria-label="Choisir un état émotionnel">
      {MOOD_IDS.map((id) => {
        const visual = MOOD_VISUALS[id];
        const isActive = value === id;
        return (
          <button
            key={id}
            type="button"
            className={`mood-picker__item ${visual.className} ${isActive ? 'mood-picker__item--active' : ''}`}
            onClick={() => onChange(id)}
            aria-pressed={isActive}
            aria-label={visual.label}
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

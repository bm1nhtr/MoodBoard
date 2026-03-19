/**
 * Sélecteur d'humeur : affiche les 5 états émotionnels sous forme de boutons colorés.
 * L'humeur sélectionnée est mise en évidence. Désactivé en mode lecture seule.
 */

import type { FC } from 'react';
import type { MoodId } from '../../types/posts';
import { MOOD_VISUALS, MOOD_IDS } from '../../constants/moodVisuals';
import './MoodPicker.css';

interface MoodPickerProps {
  /** Humeur actuellement sélectionnée */
  value: MoodId;
  /** Callback déclenché quand l'utilisateur choisit une nouvelle humeur */
  onChange: (mood: MoodId) => void;
  /** Si true : les boutons sont désactivés (jours passés) */
  disabled?: boolean;
}

const MoodPicker: FC<MoodPickerProps> = ({ value, onChange, disabled = false }) => {
  return (
    <div
      className={`mood-picker${disabled ? ' mood-picker--disabled' : ''}`}
      role="group"
      aria-label="Choisir un état émotionnel"
    >
      {MOOD_IDS.map((id) => {
        const visual = MOOD_VISUALS[id];
        const isActive = value === id;
        return (
          <button
            key={id}
            type="button"
            className={`mood-picker__item ${visual.className} ${isActive ? 'mood-picker__item--active' : ''}`}
            onClick={() => { if (!disabled) onChange(id); }}
            aria-pressed={isActive}   // accessibilité : indique si ce bouton est actif
            aria-label={visual.label}
            disabled={disabled}
          >
            {/* Pastille colorée */}
            <span className="mood-picker__dot" style={{ backgroundColor: visual.color }} />
            {/* Label textuel du mood */}
            <span className="mood-picker__label">{visual.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MoodPicker;

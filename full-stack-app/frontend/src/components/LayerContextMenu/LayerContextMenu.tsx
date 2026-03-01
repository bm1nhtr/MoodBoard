/**
 * Menu contextuel (clic droit) : ordre du calque — devant / derrière
 */

import type { FC } from 'react';
import './LayerContextMenu.css';

export type LayerAction = 'front' | 'back' | 'forward' | 'backward';

interface LayerContextMenuProps {
  x: number;
  y: number;
  onAction: (action: LayerAction) => void;
  onClose: () => void;
}

const LayerContextMenu: FC<LayerContextMenuProps> = ({ x, y, onAction, onClose }) => {
  return (
    <>
      <div className="layer-menu__backdrop" onClick={onClose} aria-hidden />
      <menu
        className="layer-menu"
        style={{ left: x, top: y }}
        role="menu"
        aria-label="Ordre du calque"
      >
        <li role="none">
          <button type="button" role="menuitem" onClick={() => onAction('front')}>
            Au premier plan
          </button>
        </li>
        <li role="none">
          <button type="button" role="menuitem" onClick={() => onAction('forward')}>
            Avancer d’un plan
          </button>
        </li>
        <li role="none">
          <button type="button" role="menuitem" onClick={() => onAction('backward')}>
            Reculer d’un plan
          </button>
        </li>
        <li role="none">
          <button type="button" role="menuitem" onClick={() => onAction('back')}>
            À l’arrière-plan
          </button>
        </li>
      </menu>
    </>
  );
};

export default LayerContextMenu;

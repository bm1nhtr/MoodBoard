/**
 * Modal chỉ dẫn lần đầu : kéo thả, resize, clic droit layer, sửa, xóa, thêm khung
 */

import type { FC } from 'react';
import './GuideModal.css';

interface GuideModalProps {
  onClose: () => void;
}

const GuideModal: FC<GuideModalProps> = ({ onClose }) => {
  return (
    <div className="guide-modal" role="dialog" aria-modal="true" aria-labelledby="guide-title">
      <div className="guide-modal__backdrop" onClick={onClose} aria-hidden />
      <div className="guide-modal__panel">
        <h2 id="guide-title" className="guide-modal__title">
          Bienvenue sur votre Mood Board
        </h2>
        <p className="guide-modal__intro">
          Voici un modèle (3 cadres image, 2 cadres texte). Vous pouvez :
        </p>
        <ul className="guide-modal__list">
          <li><strong>Déplacer</strong> un cadre en le faisant glisser</li>
          <li><strong>Redimensionner</strong> depuis le coin en bas à droite</li>
          <li><strong>Ordre des calques</strong> : clic droit sur un cadre → Au premier plan / À l’arrière-plan</li>
          <li><strong>Modifier</strong> : clic sur un cadre image pour changer l’image ; clic sur un cadre texte pour éditer le texte</li>
          <li><strong>Ajouter</strong> des cadres avec le bouton <strong>+</strong> (image ou texte)</li>
        </ul>
        <button type="button" className="guide-modal__btn" onClick={onClose}>
          J’ai compris
        </button>
      </div>
    </div>
  );
};

export default GuideModal;

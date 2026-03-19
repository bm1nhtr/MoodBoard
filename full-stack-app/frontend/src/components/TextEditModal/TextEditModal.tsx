/**
 * Modal d'édition de texte pour un cadre texte.
 * S'ouvre au clic sur un cadre texte. Limite la saisie à MAX_LENGTH caractères.
 */

import { useState, useEffect, useCallback, type FC } from 'react';
import './TextEditModal.css';

interface TextEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Appelé avec le texte validé à la soumission du formulaire */
  onSave: (text: string) => void;
  /** Texte existant pré-rempli dans la zone de saisie */
  initialText: string;
}

/** Nombre maximum de caractères autorisés dans un cadre texte. */
const MAX_LENGTH = 500;

const TextEditModal: FC<TextEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialText,
}) => {
  const [text, setText] = useState(initialText);

  // Réinitialise le texte à chaque ouverture de la modal
  useEffect(() => {
    if (isOpen) setText(initialText);
  }, [isOpen, initialText]);

  /** Tronque et nettoie le texte avant de le sauvegarder. */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSave(text.slice(0, MAX_LENGTH).trim());
      onClose();
    },
    [text, onSave, onClose]
  );

  /** Ferme la modal si l'utilisateur clique sur le fond sombre (backdrop). */
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="text-edit-modal text-edit-modal--open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="text-edit-title"
    >
      <div className="text-edit-modal__backdrop" onClick={handleBackdropClick} />
      <div className="text-edit-modal__panel">
        <header className="text-edit-modal__header">
          <h2 id="text-edit-title" className="text-edit-modal__title">
            Texte
          </h2>
          <button
            type="button"
            className="text-edit-modal__close"
            onClick={onClose}
            aria-label="Fermer"
          >
            ×
          </button>
        </header>
        <form onSubmit={handleSubmit} className="text-edit-modal__form">
          <textarea
            className="text-edit-modal__input"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
            placeholder="Écrire…"
            rows={5}
            autoFocus
          />
          {/* Compteur de caractères restants */}
          <span className="text-edit-modal__counter">{text.length}/{MAX_LENGTH}</span>
          <button type="submit" className="text-edit-modal__submit">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
};

export default TextEditModal;

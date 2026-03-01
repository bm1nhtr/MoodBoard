/**
 * Modal : ajouter image (tự do) et/ou texte. Moodboard ảnh = người dùng tự thêm ảnh (URL).
 * Không bắt buộc ghi note khi chọn ảnh — ảnh hoặc texte, tùy ý.
 */

import { useState, useCallback, type FC } from 'react';
import type { MoodId, FrameShape } from '../../types/posts';
import MoodPicker from '../MoodPicker/MoodPicker';
import { FRAME_SHAPES } from '../../constants/frameShapes';
import { MOCK_IMAGES } from '../../services/mock/posts';
import './CreatePostModal.css';

const MAX_LENGTH = 200;

export interface CreateNoteFormData {
  text: string;
  mood: MoodId;
  shape: FrameShape;
  imageUrl?: string;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNoteFormData) => Promise<void>;
}

const CreatePostModal: FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [text, setText] = useState('');
  const [mood, setMood] = useState<MoodId>('serenity');
  const [shape, setShape] = useState<FrameShape>('rectangle');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = (imageUrl.trim().length > 0 || text.trim().length > 0) && !submitting;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;
      setSubmitting(true);
      try {
        await onSubmit({
          text: text.trim().slice(0, MAX_LENGTH),
          mood,
          shape,
          imageUrl: imageUrl.trim() || undefined,
        });
        setText('');
        setMood('serenity');
        setShape('rectangle');
        setImageUrl('');
        onClose();
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
    [text, mood, shape, imageUrl, onSubmit, onClose, canSubmit, submitting]
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="create-post-modal create-post-modal--open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-post-title"
    >
      <div className="create-post-modal__backdrop" onClick={handleBackdropClick} />
      <div className="create-post-modal__panel">
        <header className="create-post-modal__header">
          <h2 id="create-post-title" className="create-post-modal__title">
            Ajouter une image ou une pensée
          </h2>
          <button
            type="button"
            className="create-post-modal__close"
            onClick={onClose}
            aria-label="Fermer"
          >
            ×
          </button>
        </header>
        <form onSubmit={handleSubmit} className="create-post-modal__form">
          {/* Forme du khung : tròn, trái tim, chữ nhật */}
          <div className="create-post-modal__shape-section">
            <span className="create-post-modal__legend">Forme du cadre</span>
            <div className="create-post-modal__shape-list">
              {FRAME_SHAPES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`create-post-modal__shape-btn ${shape === s.id ? 'create-post-modal__shape-btn--active' : ''}`}
                  onClick={() => setShape(s.id)}
                >
                  <span className={`create-post-modal__shape-icon create-post-modal__shape-icon--${s.id}`} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="create-post-modal__image-section">
            <label htmlFor="post-image-url" className="create-post-modal__label">
              Image — collez l’URL de votre image (vous pouvez en ajouter autant que vous voulez)
            </label>
            <input
              id="post-image-url"
              type="url"
              className="create-post-modal__input create-post-modal__input--url"
              placeholder="https://… (votre image, votre design)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <p className="create-post-modal__hint">
              Exemples ci-dessous (optionnel) — ou utilisez votre propre URL au-dessus
            </p>
            <div className="create-post-modal__image-grid">
              {MOCK_IMAGES.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  className={`create-post-modal__image-btn ${imageUrl === img.url ? 'create-post-modal__image-btn--active' : ''}`}
                  onClick={() => setImageUrl(imageUrl === img.url ? '' : img.url)}
                  title={img.label}
                >
                  <img src={img.url} alt={img.label} />
                </button>
              ))}
            </div>
          </div>

          <div className="create-post-modal__mood-wrap">
            <span className="create-post-modal__legend">Humeur (1 couleur = 1 état émotionnel)</span>
            <MoodPicker value={mood} onChange={setMood} />
          </div>

          <label htmlFor="post-text" className="create-post-modal__label">
            Texte (optionnel — ajoutez si vous voulez)
          </label>
          <textarea
            id="post-text"
            className="create-post-modal__input"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
            maxLength={MAX_LENGTH}
            placeholder="Écrire ici… (optionnel)"
            rows={3}
          />
          <span className="create-post-modal__counter">
            {text.length}/{MAX_LENGTH}
          </span>

          <button
            type="submit"
            className="create-post-modal__submit"
            disabled={!canSubmit}
          >
            {submitting ? 'Envoi…' : 'Ajouter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;

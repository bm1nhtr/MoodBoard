/**
 * Cửa sổ chọn ảnh khi ấn vào khung : fichier local ou lien image (concept Miro)
 */

import { useState, useCallback, useRef, useEffect, type FC } from 'react';
import './ImagePickerModal.css';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageUrl: string) => void;
  currentImageUrl?: string;
}

type Tab = 'file' | 'link';

const ImagePickerModal: FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentImageUrl = '',
}) => {
  const [tab, setTab] = useState<Tab>('link');
  const [linkUrl, setLinkUrl] = useState(currentImageUrl);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setLinkUrl(currentImageUrl);
  }, [isOpen, currentImageUrl]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith('image/')) {
        setError('Veuillez choisir une image (JPG, PNG, etc.)');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        onSave(dataUrl);
        onClose();
      };
      reader.readAsDataURL(file);
      setError(null);
    },
    [onSave, onClose]
  );

  const handleLinkSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const url = linkUrl.trim();
      if (!url) {
        setError('Collez un lien d’image');
        return;
      }
      onSave(url);
      onClose();
    },
    [linkUrl, onSave, onClose]
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
      className="image-picker-modal image-picker-modal--open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-picker-title"
    >
      <div className="image-picker-modal__backdrop" onClick={handleBackdropClick} />
      <div className="image-picker-modal__panel">
        <header className="image-picker-modal__header">
          <h2 id="image-picker-title" className="image-picker-modal__title">
            Chọn ảnh
          </h2>
          <button
            type="button"
            className="image-picker-modal__close"
            onClick={onClose}
            aria-label="Fermer"
          >
            ×
          </button>
        </header>
        <div className="image-picker-modal__tabs">
          <button
            type="button"
            className={`image-picker-modal__tab ${tab === 'file' ? 'image-picker-modal__tab--active' : ''}`}
            onClick={() => setTab('file')}
          >
            Fichier local
          </button>
          <button
            type="button"
            className={`image-picker-modal__tab ${tab === 'link' ? 'image-picker-modal__tab--active' : ''}`}
            onClick={() => setTab('link')}
          >
            Lien image
          </button>
        </div>
        <div className="image-picker-modal__body">
          {tab === 'file' && (
            <div className="image-picker-modal__section">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="image-picker-modal__file-input"
              />
              <button
                type="button"
                className="image-picker-modal__file-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Parcourir…
              </button>
            </div>
          )}
          {tab === 'link' && (
            <form onSubmit={handleLinkSubmit} className="image-picker-modal__section">
              <input
                type="url"
                className="image-picker-modal__input"
                placeholder="https://…"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <button type="submit" className="image-picker-modal__submit">
                Valider
              </button>
            </form>
          )}
          {error && <p className="image-picker-modal__error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ImagePickerModal;

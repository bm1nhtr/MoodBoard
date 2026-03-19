/**
 * Board quotidien : canvas large sur lequel l'utilisateur dispose ses cadres (image ou texte).
 * Fonctionnalités : sélection du mood du jour, ajout via le bouton +, zoom 40–200 %.
 * En mode lecture seule (jours passés), toutes les modifications sont désactivées.
 */

import { useState, useCallback, useMemo, useEffect, useRef, type FC } from 'react';
import type { Post, MoodId, CreatePostPayload } from '../../types/posts';
import EmotionalNote from '../EmotionalNote/EmotionalNote';
import ImagePickerModal from '../ImagePickerModal/ImagePickerModal';
import TextEditModal from '../TextEditModal/TextEditModal';
import MoodPicker from '../MoodPicker/MoodPicker';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  DEFAULT_IMAGE_FRAME_SIZE,
  DEFAULT_TEXT_FRAME_SIZE,
} from '../../constants/frameShapes';
import './DailyBoard.css';

interface DailyBoardProps {
  /** Date du board (format YYYY-MM-DD) */
  boardDate: string;
  /** Liste des cadres à afficher sur le canvas */
  posts: Post[];
  /** Humeur sélectionnée pour ce jour */
  dayMood: MoodId;
  /** Callback déclenché quand l'utilisateur change le mood */
  onDayMoodChange: (mood: MoodId) => void;
  /** Créer un nouveau cadre (sans le champ boardDate, fourni par le hook) */
  createPost: (payload: Omit<CreatePostPayload, 'boardDate'>) => Promise<Post>;
  /** Mettre à jour un cadre existant (position, taille, contenu…) */
  updatePost: (id: string, updates: Partial<Pick<Post, 'x' | 'y' | 'width' | 'height' | 'imageUrl' | 'text' | 'zIndex'>>) => Promise<Post>;
  /** Supprimer un cadre */
  deletePost: (id: string) => Promise<void>;
  /** Si true : jour passé — consultation uniquement, aucune modification */
  isReadOnly?: boolean;
}

const DailyBoard: FC<DailyBoardProps> = ({
  boardDate,
  posts,
  dayMood,
  onDayMoodChange,
  createPost,
  updatePost,
  deletePost,
  isReadOnly = false,
}) => {
  /** Id du cadre actuellement sélectionné (pour ouvrir la modal d'édition). */
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  /** Niveau de zoom courant (1 = 100 %). */
  const [zoom, setZoom] = useState(1);

  /** Contrôle l'ouverture du menu FAB (+). */
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  /** Cadre actuellement sélectionné, calculé depuis la liste des posts. */
  const selectedPost = useMemo(
    () => posts.find((p) => p.id === selectedNoteId) ?? null,
    [posts, selectedNoteId]
  );

  /** Posts triés par zIndex croissant pour respecter l'ordre d'empilement. */
  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)),
    [posts]
  );

  /** Crée un cadre image avec la taille par défaut et le mood du jour. */
  const handleAddImageFrame = useCallback(() => {
    setFabMenuOpen(false);
    createPost({ text: '', mood: dayMood, shape: 'rectangle', frameType: 'image', width: DEFAULT_IMAGE_FRAME_SIZE.width, height: DEFAULT_IMAGE_FRAME_SIZE.height });
  }, [createPost, dayMood]);

  /** Crée un cadre texte avec la taille par défaut et le mood du jour. */
  const handleAddTextFrame = useCallback(() => {
    setFabMenuOpen(false);
    createPost({ text: '', mood: dayMood, shape: 'rectangle', frameType: 'text', width: DEFAULT_TEXT_FRAME_SIZE.width, height: DEFAULT_TEXT_FRAME_SIZE.height });
  }, [createPost, dayMood]);

  // Ferme le menu FAB si l'utilisateur clique en dehors
  useEffect(() => {
    const closeFab = (e: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) setFabMenuOpen(false);
    };
    if (fabMenuOpen) document.addEventListener('click', closeFab);
    return () => document.removeEventListener('click', closeFab);
  }, [fabMenuOpen]);

  /** Persiste la nouvelle position d'un cadre après un drag. */
  const handlePositionChange = useCallback((id: string, x: number, y: number) => {
    updatePost(id, { x, y });
  }, [updatePost]);

  /** Persiste la nouvelle taille d'un cadre après un resize. */
  const handleResize = useCallback((id: string, width: number, height: number) => {
    updatePost(id, { width, height });
  }, [updatePost]);

  /** Sauvegarde l'URL de l'image puis ferme la modal. */
  const handleImageSave = useCallback((imageUrl: string) => {
    if (!selectedNoteId) return;
    updatePost(selectedNoteId, { imageUrl }).then(() => setSelectedNoteId(null));
  }, [selectedNoteId, updatePost]);

  /** Sauvegarde le texte saisi puis ferme la modal. */
  const handleTextSave = useCallback((text: string) => {
    if (!selectedNoteId) return;
    updatePost(selectedNoteId, { text }).then(() => setSelectedNoteId(null));
  }, [selectedNoteId, updatePost]);

  const dateLabel = formatBoardDate(boardDate);
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="daily-board">
      {/* En-tête : date, sélecteur de mood, bannière lecture seule */}
      <header className="daily-board__header">
        <h2 className="daily-board__title">{dateLabel}</h2>

        <div className="daily-board__mood-block">
          <div className="daily-board__mood-self">
            <span className="daily-board__mood-label">Mon humeur</span>
            <MoodPicker value={dayMood} onChange={onDayMoodChange} disabled={isReadOnly} />
          </div>
        </div>
        {isReadOnly && (
          <div className="daily-board__readonly-banner" role="status" aria-live="polite">
            Lecture seule — ce jour est passé
          </div>
        )}
      </header>

      {/* Canvas scrollable : les cadres sont positionnés en absolu à l'intérieur */}
      <div className="daily-board__canvas-wrap">
        <div className="daily-board__canvas-scroll" style={{ width: CANVAS_WIDTH * zoom, height: CANVAS_HEIGHT * zoom }}>
          <div
            className="daily-board__canvas"
            style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, transform: `scale(${zoom})`, transformOrigin: '0 0' }}
          >
            {sortedPosts.map((post) => (
              <EmotionalNote
                key={post.id}
                post={{ ...post, mood: dayMood }}  // le mood du cadre = mood du jour
                onPositionChange={handlePositionChange}
                onResize={handleResize}
                onSelect={isReadOnly ? () => {} : setSelectedNoteId}
                onDelete={deletePost}
                isReadOnly={isReadOnly}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Contrôles de zoom */}
      <div className="daily-board__zoom">
        <button type="button" onClick={() => setZoom((z) => Math.max(0.4, z - 0.25))} aria-label="Zoom arrière">−</button>
        <span>{zoomPercent}%</span>
        <button type="button" onClick={() => setZoom((z) => Math.min(2, z + 0.25))} aria-label="Zoom avant">+</button>
      </div>

      {/* Bouton flottant (FAB) : visible uniquement en mode édition */}
      {!isReadOnly && (
        <div className="daily-board__fab-wrap" ref={fabRef}>
          {fabMenuOpen && (
            <div className="daily-board__fab-menu">
              <button type="button" onClick={handleAddImageFrame}>Cadre image</button>
              <button type="button" onClick={handleAddTextFrame}>Cadre texte</button>
            </div>
          )}
          <button
            type="button"
            className="daily-board__fab"
            onClick={(e) => { e.stopPropagation(); setFabMenuOpen((o) => !o); }}
            aria-label="Ajouter un cadre (image ou texte)"
            title="Ajouter cadre"
          >
            +
          </button>
        </div>
      )}

      {/* Modal d'édition d'image — s'ouvre au clic sur un cadre image */}
      {!isReadOnly && selectedNoteId != null && selectedPost?.frameType === 'image' && (
        <ImagePickerModal isOpen onClose={() => setSelectedNoteId(null)} onSave={handleImageSave} currentImageUrl={selectedPost.imageUrl} />
      )}

      {/* Modal d'édition de texte — s'ouvre au clic sur un cadre texte */}
      {!isReadOnly && selectedNoteId != null && selectedPost?.frameType === 'text' && (
        <TextEditModal isOpen onClose={() => setSelectedNoteId(null)} onSave={handleTextSave} initialText={selectedPost.text ?? ''} />
      )}
    </div>
  );
};

/** Formate une date ISO (YYYY-MM-DD) en libellé lisible en français (ex. "samedi 14 mars"). */
function formatBoardDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');  // T12:00:00 évite les problèmes de fuseau horaire
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default DailyBoard;

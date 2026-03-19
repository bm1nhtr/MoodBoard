/**
 * Cadre individuel sur le canvas : peut contenir une image ou du texte.
 * Supporte le glisser-déposer (drag) et le redimensionnement (resize via la poignée).
 * La couleur de fond est déterminée par l'humeur du jour.
 */

import { useRef, useCallback, useState, useEffect, type FC } from 'react';
import type { Post } from '../../types/posts';
import { MOOD_VISUALS } from '../../constants/moodVisuals';
import './EmotionalNote.css';

interface EmotionalNoteProps {
  /** Données du cadre (position, taille, contenu, humeur…) */
  post: Post;
  /** Appelé après un drag pour persister la nouvelle position */
  onPositionChange: (id: string, x: number, y: number) => void;
  /** Appelé après un resize pour persister la nouvelle taille */
  onResize: (id: string, width: number, height: number) => void;
  /** Appelé au clic (sans drag) pour ouvrir la modal d'édition */
  onSelect: (id: string) => void;
  /** Appelé au clic sur le bouton poubelle pour supprimer le cadre */
  onDelete?: (id: string) => void;
  /** Si true : lecture seule — pas de drag, resize ni suppression */
  isReadOnly?: boolean;
}

const EmotionalNote: FC<EmotionalNoteProps> = ({
  post,
  onPositionChange,
  onResize,
  onSelect,
  onDelete,
  isReadOnly = false,
}) => {
  const visual = MOOD_VISUALS[post.mood];

  /** Offset souris-coin supérieur gauche du cadre, défini au début d'un drag. */
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);

  /** Position affichée pendant le drag (avant persistance). */
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  /** Etat initial du resize (position souris + dimensions du cadre). */
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  /** Indique si la souris a bougé depuis le mousedown (distingue drag de simple clic). */
  const movedRef = useRef(false);

  /** Démarre un drag : enregistre l'offset souris-coin du cadre. */
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (isReadOnly) return;
      e.preventDefault();
      // Ignore le mousedown sur la poignée de resize (gérée séparément)
      if (e.target instanceof HTMLElement && e.target.closest('.emotional-note__resize-handle')) return;
      movedRef.current = false;
      setDragOffset({ x: e.clientX - post.x, y: e.clientY - post.y });
      setDragPosition(null);
    },
    [post.x, post.y, isReadOnly]
  );

  /** Démarre un resize : enregistre la position initiale et les dimensions courantes. */
  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      if (isReadOnly) return;
      e.preventDefault();
      e.stopPropagation(); // empêche le drag de démarrer en même temps
      setResizeStart({ x: e.clientX, y: e.clientY, w: post.width, h: post.height });
    },
    [post.width, post.height, isReadOnly]
  );

  /** Gère le mouvement de la souris pour le drag et le resize en temps réel. */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragOffset !== null) {
        movedRef.current = true;
        setDragPosition({
          x: Math.max(0, e.clientX - dragOffset.x),  // empêche de sortir à gauche du canvas
          y: Math.max(0, e.clientY - dragOffset.y),  // empêche de sortir en haut du canvas
        });
      }
      if (resizeStart !== null) {
        const dx = e.clientX - resizeStart.x;
        const dy = e.clientY - resizeStart.y;
        // Dimensions bornées : min 60×50, max 800×600
        const newW = Math.max(60, Math.min(800, resizeStart.w + dx));
        const newH = Math.max(50, Math.min(600, resizeStart.h + dy));
        onResize(post.id, Math.round(newW), Math.round(newH));
      }
    },
    [dragOffset, resizeStart, post.id, onResize]
  );

  /** Finalise le drag ou le resize au relâchement de la souris. */
  const handleMouseUp = useCallback(() => {
    if (dragOffset !== null) {
      if (dragPosition !== null) {
        // Drag terminé : persiste la nouvelle position
        onPositionChange(post.id, dragPosition.x, dragPosition.y);
      } else if (!movedRef.current) {
        // Pas de mouvement → simple clic : ouvre la modal d'édition
        onSelect(post.id);
      }
      setDragOffset(null);
      setDragPosition(null);
    }
    if (resizeStart !== null) setResizeStart(null);
  }, [dragOffset, dragPosition, resizeStart, post.id, onPositionChange, onSelect]);

  // Attache/détache les listeners globaux uniquement pendant un drag ou resize actif
  useEffect(() => {
    if (dragOffset === null && resizeStart === null) return;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragOffset, resizeStart, handleMouseMove, handleMouseUp]);

  // Position affichée : position de drag en temps réel, sinon position persistée
  const pos = dragPosition ?? { x: post.x, y: post.y };
  const isImageFrame = post.frameType === 'image';
  const hasImage = Boolean(post.imageUrl);

  return (
    <article
      className={`emotional-note emotional-note--${post.shape} emotional-note--${post.frameType} ${hasImage ? 'emotional-note--has-image' : ''} ${visual.className}${isReadOnly ? ' emotional-note--readonly' : ''}`}
      style={{
        left: pos.x,
        top: pos.y,
        width: post.width,
        height: post.height,
        backgroundColor: visual.color,
        zIndex: post.zIndex,
      }}
      onMouseDown={handleDragStart}
    >
      <div className="emotional-note__inner">
        {isImageFrame ? (
          /* Cadre image : affiche l'image ou un placeholder si vide */
          post.imageUrl ? (
            <div className="emotional-note__image-wrap">
              <img src={post.imageUrl} alt="" className="emotional-note__image" />
            </div>
          ) : (
            <div className="emotional-note__placeholder">
              Cliquer pour ajouter une image
            </div>
          )
        ) : (
          /* Cadre texte : affiche le texte ou un placeholder si vide */
          <div className="emotional-note__text-content">
            {post.text ? (
              <p className="emotional-note__text">{post.text}</p>
            ) : (
              <p className="emotional-note__placeholder emotional-note__placeholder--text">
                Écrire…
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bouton suppression — masqué en lecture seule */}
      {!isReadOnly && (
        <button
          type="button"
          className="emotional-note__delete-btn"
          onMouseDown={(e) => e.stopPropagation()}  // empêche le drag de démarrer
          onClick={(e) => { e.stopPropagation(); onDelete?.(post.id); }}
          aria-label="Supprimer"
          title="Supprimer"
        >
          🗑
        </button>
      )}

      {/* Poignée de redimensionnement (coin inférieur droit) — masquée en lecture seule */}
      {!isReadOnly && (
        <div
          className="emotional-note__resize-handle"
          onMouseDown={handleResizeStart}
          aria-label="Redimensionner"
        />
      )}
    </article>
  );
};

export default EmotionalNote;

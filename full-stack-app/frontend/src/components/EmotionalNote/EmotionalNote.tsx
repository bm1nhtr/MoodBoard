/**
 * Khung (image ou texte) : kéo thả, resize. Ảnh cắt theo khung. 1 mood = mood du jour (board).
 */

import { useRef, useCallback, useState, useEffect, type FC } from 'react';
import type { Post } from '../../types/posts';
import { MOOD_VISUALS } from '../../constants/moodVisuals';
import './EmotionalNote.css';

interface EmotionalNoteProps {
  post: Post;
  onPositionChange: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onSelect: (id: string) => void;
  onContextMenu?: (id: string, clientX: number, clientY: number) => void;
  /** Pour le guide pas à pas : cible de la flèche (premier cadre image / premier cadre texte) */
  guideTarget?: 'image' | 'text';
}

const EmotionalNote: FC<EmotionalNoteProps> = ({
  post,
  onPositionChange,
  onResize,
  onSelect,
  onContextMenu,
  guideTarget,
}) => {
  const visual = MOOD_VISUALS[post.mood];
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const movedRef = useRef(false);

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (e.target instanceof HTMLElement && e.target.closest('.emotional-note__resize-handle')) return;
      movedRef.current = false;
      setDragOffset({ x: e.clientX - post.x, y: e.clientY - post.y });
      setDragPosition(null);
    },
    [post.x, post.y]
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setResizeStart({ x: e.clientX, y: e.clientY, w: post.width, h: post.height });
    },
    [post.width, post.height]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragOffset !== null) {
        movedRef.current = true;
        setDragPosition({
          x: Math.max(0, e.clientX - dragOffset.x),
          y: Math.max(0, e.clientY - dragOffset.y),
        });
      }
      if (resizeStart !== null) {
        const dx = e.clientX - resizeStart.x;
        const dy = e.clientY - resizeStart.y;
        const newW = Math.max(60, Math.min(800, resizeStart.w + dx));
        const newH = Math.max(50, Math.min(600, resizeStart.h + dy));
        onResize(post.id, Math.round(newW), Math.round(newH));
      }
    },
    [dragOffset, resizeStart, post.id, onResize]
  );

  const handleMouseUp = useCallback(() => {
    if (dragOffset !== null) {
      if (dragPosition !== null) {
        onPositionChange(post.id, dragPosition.x, dragPosition.y);
      } else if (!movedRef.current) {
        onSelect(post.id);
      }
      setDragOffset(null);
      setDragPosition(null);
    }
    if (resizeStart !== null) setResizeStart(null);
  }, [dragOffset, dragPosition, resizeStart, post.id, onPositionChange, onSelect]);

  useEffect(() => {
    if (dragOffset === null && resizeStart === null) return;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragOffset, resizeStart, handleMouseMove, handleMouseUp]);

  const pos = dragPosition ?? { x: post.x, y: post.y };
  const isImageFrame = post.frameType === 'image';
  const hasImage = Boolean(post.imageUrl);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onContextMenu?.(post.id, e.clientX, e.clientY);
    },
    [post.id, onContextMenu]
  );

  return (
    <article
      className={`emotional-note emotional-note--${post.shape} emotional-note--${post.frameType} ${hasImage ? 'emotional-note--has-image' : ''} ${visual.className}`}
      data-guide-target={guideTarget ?? undefined}
      style={{
        left: pos.x,
        top: pos.y,
        width: post.width,
        height: post.height,
        backgroundColor: visual.color,
        zIndex: post.zIndex,
      }}
      onMouseDown={handleDragStart}
      onContextMenu={handleContextMenu}
    >
      <div className="emotional-note__inner">
        {isImageFrame ? (
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
        {!isImageFrame && (
          <time className="emotional-note__time" dateTime={post.createdAt}>
            {formatTime(post.createdAt)}
          </time>
        )}
      </div>
      <div
        className="emotional-note__resize-handle"
        onMouseDown={handleResizeStart}
        aria-label="Redimensionner"
      />
    </article>
  );
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default EmotionalNote;

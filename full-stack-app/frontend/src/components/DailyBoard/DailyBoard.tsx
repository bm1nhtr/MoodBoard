/**
 * Board du jour : 1 mood pour toute la journée, canvas plus large que l’écran, zoom.
 * Premier accès : template 3 image + 2 texte + guide. Bouton + ouvre le menu (Cadre image / Cadre texte).
 */

import { useState, useCallback, useMemo, useEffect, useRef, type FC } from 'react';
import type { Post } from '../../types/posts';
import type { MoodId } from '../../types/posts';
import EmotionalNote from '../EmotionalNote/EmotionalNote';
import ImagePickerModal from '../ImagePickerModal/ImagePickerModal';
import TextEditModal from '../TextEditModal/TextEditModal';
import MoodPicker from '../MoodPicker/MoodPicker';
import LayerContextMenu, { type LayerAction } from '../LayerContextMenu/LayerContextMenu';
import GuideTooltip from '../GuideTooltip/GuideTooltip';
import type { CreatePostPayload } from '../../types/posts';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  DEFAULT_IMAGE_FRAME_SIZE,
  DEFAULT_TEXT_FRAME_SIZE,
} from '../../constants/frameShapes';
import { MOOD_VISUALS } from '../../constants/moodVisuals';
import { getMockRoomMembers } from '../../services/mock/collab';
import './DailyBoard.css';

const SEEDED_KEY = 'moodboard_seeded_';
const GUIDE_IMAGE_KEY = 'moodboard_guide_image';
const GUIDE_TEXT_KEY = 'moodboard_guide_text';
const GUIDE_FAB_KEY = 'moodboard_guide_fab';
const GUIDE_COLLAB_KEY = 'moodboard_guide_collab';

/** Moods variés pour démo "humeur par cadre" */
const TEMPLATE_MOODS: MoodId[] = ['serenity', 'wonder', 'tenderness', 'longing', 'quiet'];

/** Template au premier accès au board : 3 cadres image + 2 cadres texte (moods variés pour la démo collab). */
function getTemplatePayloads(): Omit<CreatePostPayload, 'boardDate'>[] {
  return [
    { mood: TEMPLATE_MOODS[0], text: '', shape: 'rectangle', frameType: 'image', x: 120, y: 120, width: 200, height: 180 },
    { mood: TEMPLATE_MOODS[1], text: '', shape: 'circle', frameType: 'image', x: 380, y: 140, width: 180, height: 180 },
    { mood: TEMPLATE_MOODS[2], text: '', shape: 'rectangle', frameType: 'image', x: 620, y: 100, width: 220, height: 160 },
    { mood: TEMPLATE_MOODS[3], text: '', shape: 'rectangle', frameType: 'text', x: 140, y: 340, width: 240, height: 100 },
    { mood: TEMPLATE_MOODS[4], text: '', shape: 'rectangle', frameType: 'text', x: 420, y: 320, width: 260, height: 110 },
  ];
}

interface DailyBoardProps {
  boardDate: string;
  posts: Post[];
  dayMood: MoodId;
  onDayMoodChange: (mood: MoodId) => void;
  createPost: (payload: Omit<CreatePostPayload, 'boardDate'>) => Promise<Post>;
  updatePost: (id: string, updates: Partial<Pick<Post, 'x' | 'y' | 'width' | 'height' | 'imageUrl' | 'text' | 'zIndex'>>) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
  /** En mode split (1/3 heatmap, 2/3 board), true si l’utilisateur a cliqué « plein écran ». */
  isFullScreen?: boolean;
  onExpandFullScreen?: () => void;
  onCollapseFullScreen?: () => void;
}

const DailyBoard: FC<DailyBoardProps> = ({
  boardDate,
  posts,
  dayMood,
  onDayMoodChange,
  createPost,
  updatePost,
  deletePost,
  isFullScreen,
  onExpandFullScreen,
  onCollapseFullScreen,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const [guideTargetRect, setGuideTargetRect] = useState<DOMRect | null>(null);
  const [guideVersion, setGuideVersion] = useState(0);
  const fabRef = useRef<HTMLDivElement>(null);
  const selectedPost = posts.find((p) => p.id === selectedNoteId);

  const mockMembers = useMemo(() => getMockRoomMembers(dayMood), [dayMood]);

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)),
    [posts]
  );

  /** Étape du guide : image → texte → fab → collab (localStorage) */
  const guideStep = useMemo((): 'image' | 'text' | 'fab' | 'collab' | null => {
    const hasImage = sortedPosts.some((p) => p.frameType === 'image');
    const hasText = sortedPosts.some((p) => p.frameType === 'text');
    if (hasImage && !localStorage.getItem(GUIDE_IMAGE_KEY)) return 'image';
    if (hasText && !localStorage.getItem(GUIDE_TEXT_KEY)) return 'text';
    if (!localStorage.getItem(GUIDE_FAB_KEY)) return 'fab';
    if (!localStorage.getItem(GUIDE_COLLAB_KEY)) return 'collab';
    return null;
  }, [sortedPosts, guideVersion]);

  /** Récupérer la position de la cible pour la flèche du guide (après rendu, petit délai pour le template) */
  useEffect(() => {
    if (!guideStep) {
      setGuideTargetRect(null);
      return;
    }
    const readRect = () => {
      if (guideStep === 'fab' && fabRef.current) {
        setGuideTargetRect(fabRef.current.getBoundingClientRect());
        return;
      }
      if (guideStep === 'collab') {
        const el = document.querySelector(`[data-guide-target="${guideStep}"]`);
        if (el) setGuideTargetRect(el.getBoundingClientRect());
        else setGuideTargetRect(null);
        return;
      }
      const el = document.querySelector(`[data-guide-target="${guideStep}"]`);
      if (el) setGuideTargetRect(el.getBoundingClientRect());
      else setGuideTargetRect(null);
    };
    const t = setTimeout(readRect, 80);
    return () => clearTimeout(t);
  }, [guideStep, sortedPosts.length]);

  /** Template 3 image + 2 texte au premier accès au board du jour (ne pas quitter si posts.length > 0 avant la fin). */
  useEffect(() => {
    if (!boardDate) return;
    const key = SEEDED_KEY + boardDate;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    const payloads = getTemplatePayloads();
    payloads.forEach((p) => createPost(p));
  }, [boardDate, dayMood, createPost]);

  const handleAddImageFrame = useCallback(() => {
    setFabMenuOpen(false);
    createPost({
      text: '',
      mood: dayMood,
      shape: 'rectangle',
      frameType: 'image',
      width: DEFAULT_IMAGE_FRAME_SIZE.width,
      height: DEFAULT_IMAGE_FRAME_SIZE.height,
    });
  }, [createPost, dayMood]);

  const handleAddTextFrame = useCallback(() => {
    setFabMenuOpen(false);
    createPost({
      text: '',
      mood: dayMood,
      shape: 'rectangle',
      frameType: 'text',
      width: DEFAULT_TEXT_FRAME_SIZE.width,
      height: DEFAULT_TEXT_FRAME_SIZE.height,
    });
  }, [createPost, dayMood]);

  const handleLayerAction = useCallback(
    (id: string, action: LayerAction) => {
      const post = posts.find((p) => p.id === id);
      if (!post) return;
      const currentZ = post.zIndex ?? 0;
      const zIndexes = posts.map((p) => p.zIndex ?? 0);
      const maxZ = Math.max(...zIndexes, 0);
      const minZ = Math.min(...zIndexes, 0);
      let newZ = currentZ;
      if (action === 'delete') {
        deletePost(id).then(() => setContextMenu(null));
        return;
      }
      if (action === 'front') newZ = maxZ + 1;
      else if (action === 'back') newZ = minZ - 1;
      else if (action === 'forward') newZ = currentZ + 1;
      else if (action === 'backward') newZ = currentZ - 1;
      updatePost(id, { zIndex: newZ }).then(() => setContextMenu(null));
    },
    [posts, updatePost, deletePost]
  );

  const handleContextMenu = useCallback((id: string, clientX: number, clientY: number) => {
    setContextMenu({ id, x: clientX, y: clientY });
  }, []);

  useEffect(() => {
    const closeFab = (e: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) setFabMenuOpen(false);
    };
    if (fabMenuOpen) document.addEventListener('click', closeFab);
    return () => document.removeEventListener('click', closeFab);
  }, [fabMenuOpen]);

  const GUIDE_KEYS: Record<'image' | 'text' | 'fab' | 'collab', string> = {
    image: GUIDE_IMAGE_KEY,
    text: GUIDE_TEXT_KEY,
    fab: GUIDE_FAB_KEY,
    collab: GUIDE_COLLAB_KEY,
  };

  const handleGuideClose = useCallback((step: 'image' | 'text' | 'fab' | 'collab') => {
    localStorage.setItem(GUIDE_KEYS[step], '1');
    setGuideVersion((v) => v + 1);
  }, []);

  /** Réafficher le guide (réinitialise toutes les étapes) */
  const handleShowGuideAgain = useCallback(() => {
    localStorage.removeItem(GUIDE_IMAGE_KEY);
    localStorage.removeItem(GUIDE_TEXT_KEY);
    localStorage.removeItem(GUIDE_FAB_KEY);
    localStorage.removeItem(GUIDE_COLLAB_KEY);
    setGuideVersion((v) => v + 1);
  }, []);

  const handlePositionChange = useCallback(
    (id: string, x: number, y: number) => {
      updatePost(id, { x, y });
    },
    [updatePost]
  );

  const handleResize = useCallback(
    (id: string, width: number, height: number) => {
      updatePost(id, { width, height });
    },
    [updatePost]
  );

  const handleImageSave = useCallback(
    (imageUrl: string) => {
      if (!selectedNoteId) return;
      updatePost(selectedNoteId, { imageUrl }).then(() => setSelectedNoteId(null));
    },
    [selectedNoteId, updatePost]
  );

  const handleTextSave = useCallback(
    (text: string) => {
      if (!selectedNoteId) return;
      updatePost(selectedNoteId, { text }).then(() => setSelectedNoteId(null));
    },
    [selectedNoteId, updatePost]
  );

  const dateLabel = formatBoardDate(boardDate);
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="daily-board">
      <header className="daily-board__header">
        <h2 className="daily-board__title">{dateLabel}</h2>
        <div className="daily-board__mood-block" data-guide-target="collab">
          <div className="daily-board__mood-row">
            <span className="daily-board__mood-label">Humeurs du jour (démo collab)</span>
            <div className="daily-board__mood-members">
              {mockMembers.map((m) =>
                m.isMe ? (
                  <div key={m.id} className="daily-board__mood-member daily-board__mood-member--me">
                    <span className="daily-board__mood-member-avatar daily-board__mood-member-avatar--me" aria-hidden>M</span>
                    <span className="daily-board__mood-member-name">{m.name}</span>
                    <MoodPicker value={dayMood} onChange={onDayMoodChange} />
                  </div>
                ) : (
                  <div key={m.id} className="daily-board__mood-member" title={MOOD_VISUALS[m.mood].label}>
                    <span className="daily-board__mood-member-avatar" style={{ backgroundColor: MOOD_VISUALS[m.mood].color }} aria-hidden>{m.name.slice(0, 1)}</span>
                    <span className="daily-board__mood-member-dot" style={{ backgroundColor: MOOD_VISUALS[m.mood].color }} />
                    <span className="daily-board__mood-member-name">{m.name}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className="daily-board__header-actions">
          {isFullScreen && onCollapseFullScreen ? (
            <button
              type="button"
              className="daily-board__expand-btn"
              onClick={onCollapseFullScreen}
              aria-label="Revenir à la vue partagée"
              title="Vue partagée (heatmap + board)"
            >
              ⊟ Vue partagée
            </button>
          ) : onExpandFullScreen ? (
            <button
              type="button"
              className="daily-board__expand-btn"
              onClick={onExpandFullScreen}
              aria-label="Plein écran"
              title="Agrandir le board en plein écran"
            >
              ⊞ Plein écran
            </button>
          ) : null}
          <button
            type="button"
            className="daily-board__help-btn"
            onClick={handleShowGuideAgain}
            aria-label="Voir le guide"
            title="Comment déplacer, redimensionner, ajouter des cadres…"
          >
            ?
          </button>
        </div>
      </header>
      <div className="daily-board__canvas-wrap">
        <div
          className="daily-board__canvas-scroll"
          style={{ width: CANVAS_WIDTH * zoom, height: CANVAS_HEIGHT * zoom }}
        >
          <div
            className="daily-board__canvas"
            style={{
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
              transform: `scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            {sortedPosts.map((post) => {
              const firstImageId = sortedPosts.find((p) => p.frameType === 'image')?.id;
              const firstTextId = sortedPosts.find((p) => p.frameType === 'text')?.id;
              const guideTarget =
                post.id === firstImageId ? 'image' : post.id === firstTextId ? 'text' : undefined;
              return (
                <EmotionalNote
                  key={post.id}
                  post={{ ...post, mood: post.mood }}
                  onPositionChange={handlePositionChange}
                  onResize={handleResize}
                  onSelect={setSelectedNoteId}
                  onContextMenu={handleContextMenu}
                  onDelete={deletePost}
                  guideTarget={guideTarget}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="daily-board__zoom">
        <button type="button" onClick={() => setZoom((z) => Math.max(0.4, z - 0.25))} aria-label="Zoom arrière">−</button>
        <span>{zoomPercent}%</span>
        <button type="button" onClick={() => setZoom((z) => Math.min(2, z + 0.25))} aria-label="Zoom avant">+</button>
      </div>
      <div className="daily-board__fab-wrap" ref={fabRef}>
        {fabMenuOpen && (
          <div className="daily-board__fab-menu">
            <button type="button" onClick={handleAddImageFrame}>
              Cadre image
            </button>
            <button type="button" onClick={handleAddTextFrame}>
              Cadre texte
            </button>
          </div>
        )}
        <button
          type="button"
          className="daily-board__fab"
          onClick={(e) => {
            e.stopPropagation();
            setFabMenuOpen((o) => !o);
          }}
          aria-label="Ajouter un cadre (image ou texte)"
          title="Ajouter cadre"
        >
          +
        </button>
      </div>
      {selectedNoteId != null && selectedPost?.frameType === 'image' && (
        <ImagePickerModal
          isOpen
          onClose={() => setSelectedNoteId(null)}
          onSave={handleImageSave}
          currentImageUrl={selectedPost.imageUrl}
        />
      )}
      {selectedNoteId != null && selectedPost?.frameType === 'text' && (
        <TextEditModal
          isOpen
          onClose={() => setSelectedNoteId(null)}
          onSave={handleTextSave}
          initialText={selectedPost.text ?? ''}
        />
      )}
      {contextMenu && (
        <LayerContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAction={(action) => handleLayerAction(contextMenu.id, action)}
          onClose={() => setContextMenu(null)}
        />
      )}
      {guideStep && (
        <>
          <div
            className="daily-board__guide-backdrop"
            aria-hidden
            onClick={() => handleGuideClose(guideStep)}
          />
          <GuideTooltip
            targetRect={guideTargetRect}
            message={
              guideStep === 'image'
                ? 'Cadre image : glissez pour déplacer, redimensionnez par le coin bas-droit, clic droit pour l’ordre des calques, clic pour ajouter une image.'
                : guideStep === 'text'
                  ? 'Cadre texte : cliquez pour éditer le texte.'
                  : guideStep === 'fab'
                    ? 'Utilisez le bouton + pour ajouter des cadres image ou texte.'
                    : 'Humeurs du jour (démo collab) : vous et les autres membres du groupe avez chacun une humeur. Chaque cadre affiche l\'avatar de son auteur (Moi, Alice, Bob).'
            }
            buttonLabel={guideStep === 'collab' ? "J'ai compris" : 'Suivant'}
            onClose={() => handleGuideClose(guideStep)}
          />
        </>
      )}
    </div>
  );
};

function formatBoardDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default DailyBoard;

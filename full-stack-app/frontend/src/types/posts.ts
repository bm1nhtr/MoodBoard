/**
 * Types pour le Mood Board Collaboratif — Shared Emotional Whiteboard
 * Board quotidien, notes positionnées, humeur = identité visuelle (couleur + effet)
 */

/** 5 états émotionnels — chaque id correspond à une couleur et une expression. */
export type MoodId = 'serenity' | 'wonder' | 'tenderness' | 'longing' | 'quiet';

/** Option pour listes/legacy (label optionnel) */
export interface MoodOption {
  id: MoodId;
  label: string;
}

/** 1 mood = 1 couleur = 1 état émotionnel ; label fixe pour éviter les biais d’interprétation. */
export interface MoodVisual {
  id: MoodId;
  /** Libellé de l’état émotionnel — toujours affiché pour un sens partagé. */
  label: string;
  /** Couleur représentant l’état émotionnel. */
  color: string;
  /** Classe CSS (glow, bord, texture) */
  className: string;
}

/** Forme du cadre — cercle, cœur, rectangle. */
export type FrameShape = 'circle' | 'heart' | 'rectangle';

/** Type de cadre : image (l’utilisateur ajoute une image) ou texte (l’utilisateur ajoute du texte). */
export type FrameType = 'image' | 'text';

/** Cadre sur le board : glisser, redimensionner, image rognée au cadre. 1 mood par jour (board). */
export interface Post {
  id: string;
  text: string;
  /** Humeur du jour (1 mood pour tout le board ce jour-là) */
  mood: MoodId;
  createdAt: string;
  boardDate: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: FrameShape;
  /** Cadre image ou cadre texte. */
  frameType: FrameType;
  imageUrl?: string;
  /** Ordre d’empilement (clic droit : devant / derrière) */
  zIndex: number;
  /** Mock collab : auteur du cadre (démo à partir du 1er mars) */
  createdBy?: 'me' | 'alice' | 'bob';
}

/** Payload pour créer un cadre (image ou texte). */
export interface CreatePostPayload {
  text: string;
  mood: MoodId;
  boardDate: string;
  shape: FrameShape;
  frameType: FrameType;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  imageUrl?: string;
  zIndex?: number;
}

/** Membre du groupe (mock collab) : humeur par utilisateur pour un jour */
export interface MockRoomMember {
  id: string;
  name: string;
  isMe: boolean;
  mood: MoodId;
}

/** Entrée heatmap : intensité émotionnelle d’un jour (pour le calendrier) */
export interface DayHeatmapEntry {
  date: string;
  /** 0–1 : intensité pour la couleur du jour */
  intensity: number;
  /** Humeur dominante du jour (pour teinte) */
  dominantMood: MoodId | null;
  noteCount: number;
}

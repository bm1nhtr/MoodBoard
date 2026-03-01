/**
 * Types pour le Mood Board Collaboratif — Shared Emotional Whiteboard
 * Board quotidien, notes positionnées, humeur = identité visuelle (couleur + effet)
 */

/** 5 trạng thái cảm xúc — mỗi id tương ứng 1 màu, 1 biểu cảm */
export type MoodId = 'serenity' | 'wonder' | 'tenderness' | 'longing' | 'quiet';

/** Option pour listes/legacy (label optionnel) */
export interface MoodOption {
  id: MoodId;
  label: string;
}

/** 1 mood = 1 màu = 1 trạng thái cảm xúc ; label cố định để tránh biais (màu hồng/xanh tùy ý) */
export interface MoodVisual {
  id: MoodId;
  /** Libellé du trạng thái cảm xúc — luôn hiển thị để mọi người dùng cùng nghĩa */
  label: string;
  /** Màu đại diện cho trạng thái cảm xúc */
  color: string;
  /** Classe CSS (glow, bord, texture) */
  className: string;
}

/** Forme du khung — tròn, trái tim, chữ nhật */
export type FrameShape = 'circle' | 'heart' | 'rectangle';

/** Type de khung : ảnh (user thêm ảnh) hoặc texte (user thêm texte) */
export type FrameType = 'image' | 'text';

/** Khung sur le board : kéo thả, resize, ảnh cắt theo khung. Mood = 1 ngày 1 mood (board). */
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
  /** Khung ảnh ou khung texte */
  frameType: FrameType;
  imageUrl?: string;
  /** Ordre d’empilement (clic droit : devant / derrière) */
  zIndex: number;
}

/** Payload pour créer un khung (image ou texte) */
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

/** Entrée heatmap : intensité émotionnelle d’un jour (pour le calendrier) */
export interface DayHeatmapEntry {
  date: string;
  /** 0–1 : intensité pour la couleur du jour */
  intensity: number;
  /** Humeur dominante du jour (pour teinte) */
  dominantMood: MoodId | null;
  noteCount: number;
}

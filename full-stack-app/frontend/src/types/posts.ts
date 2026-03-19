/**
 * Types TypeScript partagés du Mood Board.
 * Définit les structures de données utilisées dans le frontend (posts, moods, heatmap).
 */

/** Les 5 états émotionnels disponibles — chaque id correspond à une couleur fixe. */
export type MoodId = 'serenity' | 'wonder' | 'tenderness' | 'longing' | 'quiet';

/** Propriétés visuelles d'un mood : couleur hexadécimale, label affiché, classe CSS. */
export interface MoodVisual {
  id: MoodId;
  label: string;
  /** Couleur hexadécimale du mood */
  color: string;
  /** Classe CSS appliquée au cadre (glow, bord, texture) */
  className: string;
}

/** Forme du cadre sur le canvas. */
export type FrameShape = 'circle' | 'heart' | 'rectangle';

/** Type de contenu du cadre : image ou texte. */
export type FrameType = 'image' | 'text';

/**
 * Un cadre (post-it) sur le board quotidien.
 * Peut contenir une image ou du texte, positionné librement sur le canvas.
 */
export interface Post {
  /** Identifiant MongoDB */
  id: string;
  /** Contenu texte (vide pour les cadres image) */
  text: string;
  /** Humeur du jour au moment de la création */
  mood: MoodId;
  /** Date de création ISO 8601 */
  createdAt: string;
  /** Date du board (format YYYY-MM-DD) */
  boardDate: string;
  /** Position horizontale sur le canvas (px) */
  x: number;
  /** Position verticale sur le canvas (px) */
  y: number;
  /** Largeur du cadre (px) */
  width: number;
  /** Hauteur du cadre (px) */
  height: number;
  /** Forme visuelle du cadre */
  shape: FrameShape;
  /** Type de contenu : image ou texte */
  frameType: FrameType;
  /** URL de l'image (data URL ou lien externe) */
  imageUrl?: string;
  /** Ordre d'empilement CSS (z-index) */
  zIndex: number;
}

/**
 * Payload envoyé au backend pour créer un nouveau cadre.
 * boardDate est obligatoire ; x, y, width, height ont des valeurs par défaut.
 */
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

/**
 * Entrée heatmap pour un jour donné.
 * Utilisée pour colorier les cellules de la heatmap annuelle.
 */
export interface DayHeatmapEntry {
  /** Date au format YYYY-MM-DD */
  date: string;
  /** Intensité de 0 à 1 : proportionnelle au nombre de cadres du jour */
  intensity: number;
  /** Humeur dominante du jour (détermine la couleur) — null si aucune note */
  dominantMood: MoodId | null;
  /** Nombre de cadres créés ce jour */
  noteCount: number;
}

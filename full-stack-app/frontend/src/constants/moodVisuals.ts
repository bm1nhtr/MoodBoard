/**
 * 1 màu = 1 label = 1 trạng thái cảm xúc (cố định, tránh biais).
 * Palette : xanh lá → nâu (màu họ hàng, dễ nhìn).
 */

import type { MoodId, MoodVisual } from '../types/posts';

/** Palette xanh lá cây → nâu (green to brown), 1 couleur = 1 état émotionnel labellé */
export const MOOD_VISUALS: Record<MoodId, MoodVisual> = {
  serenity: {
    id: 'serenity',
    label: 'Sérénité',
    color: '#C5DFC5',
    className: 'mood--serenity',
  },
  wonder: {
    id: 'wonder',
    label: 'Émerveillement',
    color: '#8FBC8F',
    className: 'mood--wonder',
  },
  tenderness: {
    id: 'tenderness',
    label: 'Tendresse',
    color: '#A8B89A',
    className: 'mood--tenderness',
  },
  longing: {
    id: 'longing',
    label: 'Nostalgie',
    color: '#C4B896',
    className: 'mood--longing',
  },
  quiet: {
    id: 'quiet',
    label: 'Quiétude',
    color: '#A0826D',
    className: 'mood--quiet',
  },
};

/** Liste des ids pour itération */
export const MOOD_IDS: MoodId[] = ['serenity', 'wonder', 'tenderness', 'longing', 'quiet'];

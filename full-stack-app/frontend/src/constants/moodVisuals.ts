/**
 * Palette des humeurs : association fixe entre un identifiant, un label et une couleur.
 * Les couleurs vont du vert clair (sérénité) au brun chaud (quiétude).
 * Les couleurs sont fixes pour éviter les biais dans l'interprétation émotionnelle.
 */

import type { MoodId, MoodVisual } from '../types/posts';

/** Dictionnaire : MoodId → propriétés visuelles (couleur, label, classe CSS). */
export const MOOD_VISUALS: Record<MoodId, MoodVisual> = {
  serenity: {
    id: 'serenity',
    label: 'Sérénité',
    color: '#C5DFC5',        // vert pâle
    className: 'mood--serenity',
  },
  wonder: {
    id: 'wonder',
    label: 'Émerveillement',
    color: '#8FBC8F',        // vert moyen
    className: 'mood--wonder',
  },
  tenderness: {
    id: 'tenderness',
    label: 'Tendresse',
    color: '#A8B89A',        // vert grisé
    className: 'mood--tenderness',
  },
  longing: {
    id: 'longing',
    label: 'Nostalgie',
    color: '#C4B896',        // beige chaud
    className: 'mood--longing',
  },
  quiet: {
    id: 'quiet',
    label: 'Quiétude',
    color: '#A0826D',        // brun doux
    className: 'mood--quiet',
  },
};

/** Liste ordonnée des ids pour itérer sur les humeurs (dans le MoodPicker, etc.). */
export const MOOD_IDS: MoodId[] = ['serenity', 'wonder', 'tenderness', 'longing', 'quiet'];

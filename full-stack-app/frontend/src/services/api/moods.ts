/**
 * Service API pour les humeurs du board (BoardMood).
 * Chaque jour a une humeur unique par utilisateur, persistée en base.
 */

import type { MoodId } from '../../types/posts';

/**
 * Récupère l'humeur du jour (GET /api/board-moods?boardDate=...).
 * Retourne 'serenity' par défaut si aucune humeur n'a encore été définie.
 */
export async function getBoardMood(boardDate: string): Promise<MoodId> {
  const res = await fetch(`/api/board-moods?boardDate=${boardDate}`, { credentials: 'include' });
  if (!res.ok) return 'serenity';
  const data = await res.json();
  return (data.mood as MoodId) ?? 'serenity';
}

/**
 * Enregistre ou met à jour l'humeur du jour (PUT /api/board-moods/:boardDate).
 * Utilise upsert côté backend : crée si inexistant, met à jour sinon.
 */
export async function setBoardMood(boardDate: string, mood: MoodId): Promise<void> {
  await fetch(`/api/board-moods/${boardDate}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ mood }),
  });
}

/**
 * Service API pour les cadres (notes) : wrappeurs fetch vers les routes /api/notes.
 * Chaque fonction retourne des objets Post typés côté frontend.
 */

import type { Post, CreatePostPayload } from '../../types/posts';

/**
 * Transforme un objet brut MongoDB (champs _id, etc.) en objet Post frontend.
 * Applique des valeurs par défaut pour les champs optionnels manquants.
 */
function normalize(raw: Record<string, unknown>): Post {
  return {
    id:        raw._id as string,
    text:      (raw.text as string) ?? '',
    mood:      (raw.mood as Post['mood']) ?? 'serenity',
    createdAt: raw.createdAt as string,
    boardDate: raw.boardDate as string,
    x:         (raw.x as number) ?? 80,
    y:         (raw.y as number) ?? 80,
    width:     (raw.width as number) ?? 200,
    height:    (raw.height as number) ?? 180,
    shape:     (raw.shape as Post['shape']) ?? 'rectangle',
    frameType: (raw.frameType as Post['frameType']) ?? 'text',
    imageUrl:  (raw.imageUrl as string) || undefined,
    zIndex:    (raw.zIndex as number) ?? 0,
  };
}

/** Récupère tous les cadres d'un jour donné (GET /api/notes?boardDate=...). */
export async function getPostsByDate(boardDate: string): Promise<Post[]> {
  const res = await fetch(`/api/notes?boardDate=${boardDate}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Erreur chargement notes');
  const data: unknown = await res.json();
  // Le backend peut retourner un tableau direct ou { notes: [...] }
  const array = Array.isArray(data) ? data : ((data as { notes?: unknown[] }).notes ?? []);
  return (array as Record<string, unknown>[]).map(normalize);
}

/** Crée un nouveau cadre (POST /api/notes) et retourne le cadre créé. */
export async function addPost(payload: CreatePostPayload): Promise<Post> {
  const body = {
    text:      payload.text,
    mood:      payload.mood,
    boardDate: payload.boardDate,
    shape:     payload.shape,
    frameType: payload.frameType,
    imageUrl:  payload.imageUrl ?? '',
    x:         payload.x ?? 80,
    y:         payload.y ?? 80,
    width:     payload.width ?? 200,
    height:    payload.height ?? 180,
    zIndex:    payload.zIndex ?? 0,
  };
  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Erreur création note');
  return normalize(await res.json() as Record<string, unknown>);
}

/** Met à jour partiellement un cadre existant (PATCH /api/notes/:id). */
export async function updatePost(id: string, updates: Partial<Omit<Post, 'id'>>): Promise<Post> {
  const res = await fetch(`/api/notes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Erreur modification note');
  return normalize(await res.json() as Record<string, unknown>);
}

/** Supprime un cadre (DELETE /api/notes/:id). */
export async function deletePost(id: string): Promise<void> {
  const res = await fetch(`/api/notes/${id}`, { method: 'DELETE', credentials: 'include' });
  if (!res.ok) throw new Error('Erreur suppression note');
}

/**
 * Hook pour le board d'un jour : charge les cadres et le mood, expose les actions CRUD.
 * Se recharge automatiquement quand la date change.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Post, CreatePostPayload, MoodId } from '../types/posts';
import { getPostsByDate, addPost, updatePost as updatePostApi, deletePost as deletePostApi } from '../services/api/notes';
import { getBoardMood, setBoardMood as setBoardMoodApi } from '../services/api/moods';

export function useBoard(boardDate: string | null) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [boardMood, setBoardMoodState] = useState<MoodId>('serenity');

  /** Charge en parallèle les cadres du jour et le mood depuis l'API. */
  const load = useCallback(() => {
    if (!boardDate) {
      setPosts([]);
      setBoardMoodState('serenity');
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      getPostsByDate(boardDate),
      getBoardMood(boardDate),
    ])
      .then(([fetchedPosts, fetchedMood]) => {
        setPosts(fetchedPosts);
        setBoardMoodState(fetchedMood);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [boardDate]);

  // Recharge le board à chaque changement de date
  useEffect(() => {
    load();
  }, [load]);

  /**
   * Met à jour le mood localement (optimistic) puis persiste via l'API.
   * Retourne une Promise pour permettre d'enchaîner le rafraîchissement de la heatmap.
   */
  const setBoardMood = useCallback((mood: MoodId): Promise<void> => {
    if (!boardDate) return Promise.resolve();
    setBoardMoodState(mood);   // mise à jour immédiate de l'UI
    return setBoardMoodApi(boardDate, mood).then(() => undefined);
  }, [boardDate]);

  /** Crée un nouveau cadre et l'ajoute en tête de liste localement. */
  const createPost = useCallback(
    (payload: Omit<CreatePostPayload, 'boardDate'>) => {
      if (!boardDate) return Promise.reject(new Error('Aucune date'));
      return addPost({ ...payload, boardDate }).then((newPost) => {
        setPosts((prev) => [newPost, ...prev]);
        return newPost;
      });
    },
    [boardDate]
  );

  /** Met à jour un cadre existant (position, taille, texte, image…). */
  const updatePost = useCallback((id: string, updates: Parameters<typeof updatePostApi>[1]) => {
    return updatePostApi(id, updates).then((updated) => {
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    });
  }, []);

  /** Supprime un cadre de la liste locale après confirmation de l'API. */
  const deletePost = useCallback((id: string) => {
    return deletePostApi(id).then(() => {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    });
  }, []);

  return { posts, loading, boardMood, setBoardMood, createPost, updatePost, deletePost, refresh: load };
}

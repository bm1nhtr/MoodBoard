/**
 * Hook pour le board d’un jour : liste des notes, création
 */

import { useState, useEffect, useCallback } from 'react';
import type { Post } from '../types/posts';
import type { CreatePostPayload } from '../types/posts';
import type { MoodId } from '../types/posts';
import { getPostsByDate, addPost, updatePost as updatePostApi, deletePost as deletePostApi } from '../services/api/notes';
import { getBoardMood, setBoardMood as setBoardMoodApi } from '../services/mock/posts';

export function useBoard(boardDate: string | null) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [boardMood, setBoardMoodState] = useState<MoodId>('serenity');

  const load = useCallback(() => {
    if (!boardDate) {
      setPosts([]);
      setBoardMoodState('serenity');
      setLoading(false);
      return;
    }
    setLoading(true);
    setBoardMoodState(getBoardMood(boardDate));
    getPostsByDate(boardDate)
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [boardDate]);

  useEffect(() => {
    load();
  }, [load]);

  const setBoardMood = useCallback((mood: MoodId) => {
    if (!boardDate) return;
    setBoardMoodApi(boardDate, mood);
    setBoardMoodState(mood);
  }, [boardDate]);

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

  const updatePost = useCallback((id: string, updates: Parameters<typeof updatePostApi>[1]) => {
    return updatePostApi(id, updates).then((updated) => {
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    });
  }, []);

  const deletePost = useCallback((id: string) => {
  return deletePostApi(id).then(() => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  });
  }, []);

  return { posts, loading, boardMood, setBoardMood, createPost, updatePost, deletePost, refresh: load };

  
}


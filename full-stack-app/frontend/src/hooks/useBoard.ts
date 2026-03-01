/**
 * Hook pour le board d’un jour : liste des notes, création
 */

import { useState, useEffect, useCallback } from 'react';
import type { Post } from '../types/posts';
import type { CreatePostPayload } from '../types/posts';
import { getPostsByDate, addPost, updatePost as updatePostApi } from '../services/mock/posts';

export function useBoard(boardDate: string | null) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!boardDate) {
      setPosts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getPostsByDate(boardDate)
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [boardDate]);

  useEffect(() => {
    load();
  }, [load]);

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

  return { posts, loading, createPost, updatePost, refresh: load };
}

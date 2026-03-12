/**
 * Hook pour la liste des posts : chargement, filtre par humeur, ajout
 * Logique métier séparée de l’UI
 */

import { useState, useEffect, useCallback } from 'react';
import type { Post, MoodId } from '../types/posts';
import { getPostsByDate, addPost } from '../services/mock/posts';
import type { CreatePostPayload } from '../types/posts';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [moodFilter, setMoodFilter] = useState<MoodId | null>(null);

  const loadPosts = useCallback(() => {
    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);
    getPostsByDate(today)
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  /** Posts filtrés par humeur (ou tous si pas de filtre) */
  const filteredPosts = moodFilter
    ? posts.filter((p) => p.mood === moodFilter)
    : posts;

  const createPost = useCallback((payload: CreatePostPayload) => {
    return addPost(payload).then((newPost) => {
      setPosts((prev) => [newPost, ...prev]);
      return newPost;
    });
  }, []);

  return {
    posts: filteredPosts,
    allPosts: posts,
    loading,
    moodFilter,
    setMoodFilter,
    createPost,
    refresh: loadPosts,
  };
}

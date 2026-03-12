/**
 * Carte post-it : texte, humeur, date
 * Style sticky-note, pas de métriques de popularité
 */

import type { FC } from 'react';
import type { Post } from '../../types/posts';
import { MOOD_OPTIONS } from '../../services/mock/posts';
import './PostCard.css';

interface PostCardProps {
  post: Post;
}

/** Formate la date en relatif ou court (ex: "Hier", "28 fév.") */
function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

const PostCard: FC<PostCardProps> = ({ post }) => {
  const moodLabel = MOOD_OPTIONS.find((m) => m.id === post.mood)?.label ?? post.mood;

  return (
    <article
      className="post-card"
      style={{ backgroundColor: post.color }}
    >
      <p className="post-card__text">{post.text}</p>
      <footer className="post-card__footer">
        <span className="post-card__mood">{moodLabel}</span>
        <time className="post-card__time" dateTime={post.createdAt}>
          {formatTimestamp(post.createdAt)}
        </time>
      </footer>
    </article>
  );
};

export default PostCard;

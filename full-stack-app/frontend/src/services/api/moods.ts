import type { MoodId } from '../../types/posts';

export async function getBoardMood(boardDate: string): Promise<MoodId> {
  const res = await fetch(`/api/board-moods?boardDate=${boardDate}`, { credentials: 'include' });
  if (!res.ok) return 'serenity';
  const data = await res.json();
  return (data.mood as MoodId) ?? 'serenity';
}

export async function setBoardMood(boardDate: string, mood: MoodId): Promise<void> {
  await fetch(`/api/board-moods/${boardDate}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ mood }),
  });
}

import type { Post, CreatePostPayload } from '../../types/posts';

function normalize(raw: any): Post {
  return {
    id:        raw._id,
    text:      raw.texte ?? '',
    mood:      raw.mood ?? 'serenity',
    createdAt: raw.createdAt,
    boardDate: raw.boardDate,
    x:         raw.x ?? 80,
    y:         raw.y ?? 80,
    width:     raw.width ?? 200,
    height:    raw.height ?? 180,
    shape:     raw.shape ?? 'rectangle',
    frameType: raw.frameType ?? 'text',
    imageUrl:  raw.imageUrl || undefined,
    zIndex:    raw.zIndex ?? 0,
    createdBy: raw.createdBy ?? 'me',
  };
}

export async function getPostsByDate(boardDate: string): Promise<Post[]> {
  const res = await fetch(`/api/notes?boardDate=${boardDate}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Erreur chargement notes');
  const data = await res.json();
  const array = Array.isArray(data) ? data : (data.notes ?? []);
  return array.map(normalize);
}

export async function addPost(payload: CreatePostPayload): Promise<Post> {
  const body = {
    pseudo:    'Moi',
    texte:     payload.text,
    couleur:   'yellow',
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
  return normalize(await res.json());
}

export async function updatePost(id: string, updates: Partial<Omit<Post, 'id'>>): Promise<Post> {
  const body: any = { ...updates };
  if (updates.text !== undefined) {
    body.texte = updates.text;
    delete body.text;
  }
  const res = await fetch(`/api/notes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Erreur modification note');
  return normalize(await res.json());
}

export async function deletePost(id: string): Promise<void> {
  const res = await fetch(`/api/notes/${id}`, { method: 'DELETE', credentials: 'include' });
  if (!res.ok) throw new Error('Erreur suppression note');
}

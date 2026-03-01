/**
 * Service mock pour le Shared Emotional Whiteboard
 * Données en mémoire : posts par boardDate, heatmap mensuelle
 */

import type { Post, MoodId, CreatePostPayload, DayHeatmapEntry } from '../../types/posts';
import type { MoodOption } from '../../types/posts';
import { MOOD_IDS, MOOD_VISUALS } from '../../constants/moodVisuals';
import { DEFAULT_FRAME_SIZE } from '../../constants/frameShapes';

/** Pour composants legacy — labels depuis moodVisuals (1 màu = 1 label) */
export const MOOD_OPTIONS: MoodOption[] = MOOD_IDS.map((id) => ({ id, label: MOOD_VISUALS[id].label }));

/** Exemples d’images pour le moodboard — người dùng có thể dùng ảnh tự thiết kế (URL bất kỳ) */
export const MOCK_IMAGES = [
  { id: 'img-1', url: 'https://picsum.photos/seed/mood1/300/200', label: 'Paysage calme' },
  { id: 'img-2', url: 'https://picsum.photos/seed/mood2/300/200', label: 'Nature' },
  { id: 'img-3', url: 'https://picsum.photos/seed/mood3/300/200', label: 'Lumière' },
  { id: 'img-4', url: 'https://picsum.photos/seed/mood4/300/200', label: 'Douceur' },
  { id: 'img-5', url: 'https://picsum.photos/seed/mood5/300/200', label: 'Sérénité' },
  { id: 'img-6', url: 'https://picsum.photos/seed/mood6/300/200', label: 'Évasion' },
] as const;

/** Données initiales : khung với shape + size (kéo thả, resize, ấn chọn ảnh) */
const initialPosts: Post[] = [
  {
    id: '1',
    text: 'Ce matin, le café et le silence. Rien d’autre.',
    mood: 'serenity',
    createdAt: '2025-02-28T08:30:00.000Z',
    boardDate: '2025-02-28',
    x: 80,
    y: 60,
    width: DEFAULT_FRAME_SIZE.width,
    height: DEFAULT_FRAME_SIZE.height,
    shape: 'rectangle',
    frameType: 'text',
    zIndex: 0,
  },
  {
    id: '2',
    text: 'Une feuille qui tombe peut tout changer.',
    mood: 'wonder',
    createdAt: '2025-02-28T09:15:00.000Z',
    boardDate: '2025-02-28',
    x: 320,
    y: 120,
    width: DEFAULT_FRAME_SIZE.width,
    height: DEFAULT_FRAME_SIZE.height,
    shape: 'circle',
    frameType: 'text',
    zIndex: 1,
  },
  {
    id: 'img-note-1',
    text: '',
    mood: 'tenderness',
    createdAt: '2025-02-28T10:00:00.000Z',
    boardDate: '2025-02-28',
    x: 80,
    y: 260,
    width: 200,
    height: 200,
    shape: 'heart',
    frameType: 'image',
    imageUrl: MOCK_IMAGES[0].url,
    zIndex: 2,
  },
  {
    id: '3',
    text: 'Penser à quelqu’un sans rien envoyer. Juste penser.',
    mood: 'tenderness',
    createdAt: '2025-02-27T14:00:00.000Z',
    boardDate: '2025-02-27',
    x: 120,
    y: 200,
    width: DEFAULT_FRAME_SIZE.width,
    height: DEFAULT_FRAME_SIZE.height,
    shape: 'rectangle',
    frameType: 'text',
    zIndex: 3,
  },
  {
    id: '4',
    text: 'Les vieilles chansons racontent encore des histoires.',
    mood: 'longing',
    createdAt: '2025-02-27T18:45:00.000Z',
    boardDate: '2025-02-27',
    x: 380,
    y: 80,
    width: DEFAULT_FRAME_SIZE.width,
    height: DEFAULT_FRAME_SIZE.height,
    shape: 'rectangle',
    frameType: 'text',
    zIndex: 4,
  },
  {
    id: 'img-note-2',
    text: 'Souvenir d’un voyage.',
    mood: 'longing',
    createdAt: '2025-02-27T12:00:00.000Z',
    boardDate: '2025-02-27',
    x: 100,
    y: 40,
    width: 220,
    height: 160,
    shape: 'rectangle',
    frameType: 'image',
    imageUrl: MOCK_IMAGES[1].url,
    zIndex: 5,
  },
  {
    id: '5',
    text: 'Fin de journée. La fenêtre ouverte, le bruit de la ville qui s’éteint.',
    mood: 'quiet',
    createdAt: '2025-02-26T20:00:00.000Z',
    boardDate: '2025-02-26',
    x: 60,
    y: 180,
    width: DEFAULT_FRAME_SIZE.width,
    height: DEFAULT_FRAME_SIZE.height,
    shape: 'rectangle',
    frameType: 'text',
    zIndex: 6,
  },
  {
    id: '6',
    text: 'Un rayon de soleil sur le bureau. C’est déjà beaucoup.',
    mood: 'serenity',
    createdAt: '2025-02-26T11:20:00.000Z',
    boardDate: '2025-02-26',
    x: 280,
    y: 40,
    width: DEFAULT_FRAME_SIZE.width,
    height: DEFAULT_FRAME_SIZE.height,
    shape: 'circle',
    frameType: 'text',
    zIndex: 7,
  },
  {
    id: 'img-note-3',
    text: '',
    mood: 'wonder',
    createdAt: '2025-02-26T15:00:00.000Z',
    boardDate: '2025-02-26',
    x: 320,
    y: 200,
    width: 180,
    height: 180,
    shape: 'heart',
    frameType: 'image',
    imageUrl: MOCK_IMAGES[2].url,
    zIndex: 8,
  },
];

/**
 * Mock données pour remplir la heatmap (couleurs par jour).
 * Uniquement les jours déjà passés (pas le futur).
 * Ces jours ne sont pas accessibles en démo — uniquement pour l’affichage des couleurs.
 */
function generateHeatmapMockPosts(year: number): Post[] {
  const moods: MoodId[] = ['serenity', 'wonder', 'tenderness', 'longing', 'quiet'];
  const todayStr = new Date().toISOString().slice(0, 10);
  const out: Post[] = [];
  let z = 100;
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (dateStr > todayStr) continue; // ne pas mock les jours à venir
      const count = 1 + Math.floor((day + month * 7) % 3); // 1 à 3 posts par jour, déterministe
      for (let i = 0; i < count; i++) {
        const mood = moods[(day + month + i) % moods.length];
        out.push({
          id: `heatmap-${dateStr}-${i}`,
          text: '',
          mood,
          createdAt: `${dateStr}T12:00:00.000Z`,
          boardDate: dateStr,
          x: 50 + i * 120,
          y: 50,
          width: DEFAULT_FRAME_SIZE.width,
          height: DEFAULT_FRAME_SIZE.height,
          shape: 'rectangle',
          frameType: 'text',
          zIndex: z++,
        });
      }
    }
  }
  return out;
}

const heatmapMockPosts = generateHeatmapMockPosts(new Date().getFullYear());

let postsStore: Post[] = [...initialPosts, ...heatmapMockPosts];
let postIdCounter = 0;

function nextPostId(): string {
  postIdCounter += 1;
  return `mock-${Date.now()}-${postIdCounter}`;
}

/**
 * Récupère les notes du board d’un jour donné
 */
export function getPostsByDate(boardDate: string): Promise<Post[]> {
  const list = postsStore.filter((p) => p.boardDate === boardDate);
  return Promise.resolve([...list]);
}

/**
 * Ajoute une note (khung avec shape, size, position)
 */
export function addPost(payload: CreatePostPayload): Promise<Post> {
  const x = payload.x ?? 60 + Math.random() * 200;
  const y = payload.y ?? 80 + Math.random() * 180;
  const maxZ = postsStore.length > 0 ? Math.max(...postsStore.map((p) => p.zIndex)) : -1;
  const post: Post = {
    id: nextPostId(),
    text: (payload.text ?? '').slice(0, 200),
    mood: payload.mood,
    createdAt: new Date().toISOString(),
    boardDate: payload.boardDate,
    x: Math.round(x),
    y: Math.round(y),
    width: payload.width ?? DEFAULT_FRAME_SIZE.width,
    height: payload.height ?? DEFAULT_FRAME_SIZE.height,
    shape: payload.shape ?? 'rectangle',
    frameType: payload.frameType ?? 'image',
    imageUrl: payload.imageUrl,
    zIndex: payload.zIndex ?? maxZ + 1,
  };
  postsStore = [post, ...postsStore];
  return Promise.resolve(post);
}

/**
 * Met à jour une note (position, size, imageUrl, etc.) — pour kéo thả, resize, chọn ảnh
 */
export function updatePost(id: string, updates: Partial<Omit<Post, 'id'>>): Promise<Post> {
  const index = postsStore.findIndex((p) => p.id === id);
  if (index === -1) return Promise.reject(new Error('Post not found'));
  const current = postsStore[index];
  const updated: Post = { ...current, ...updates };
  postsStore = [...postsStore.slice(0, index), updated, ...postsStore.slice(index + 1)];
  return Promise.resolve(updated);
}

/**
 * Calcule la heatmap du mois pour le calendrier
 * intensity = normalisé par le max de notes sur un jour du mois
 */
export function getMonthHeatmap(year: number, month: number): Promise<DayHeatmapEntry[]> {
  const end = new Date(year, month, 0);
  const maxDay = end.getDate();
  const byDay: Record<string, { count: number; moods: MoodId[] }> = {};

  for (let d = 1; d <= maxDay; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    byDay[dateStr] = { count: 0, moods: [] };
  }

  postsStore.forEach((p) => {
    if (!byDay[p.boardDate]) return;
    byDay[p.boardDate].count += 1;
    byDay[p.boardDate].moods.push(p.mood);
  });

  const maxCount = Math.max(1, ...Object.values(byDay).map((v) => v.count));
  const entries: DayHeatmapEntry[] = Object.entries(byDay).map(([date, data]) => {
    const dominantMood: MoodId | null =
      data.moods.length > 0
        ? ([...data.moods].sort(
            (a, b) =>
              data.moods.filter((m) => m === b).length - data.moods.filter((m) => m === a).length
          )[0] as MoodId)
        : null;
    return {
      date,
      intensity: data.count / maxCount,
      dominantMood,
      noteCount: data.count,
    };
  });

  return Promise.resolve(entries);
}

/**
 * Heatmap des 12 mois de l'année (pour vue principale)
 */
export async function getYearHeatmap(year: number): Promise<Record<number, DayHeatmapEntry[]>> {
  const out: Record<number, DayHeatmapEntry[]> = {};
  for (let month = 1; month <= 12; month++) {
    out[month] = await getMonthHeatmap(year, month);
  }
  return out;
}

/**
 * Réinitialise le store (démo / tests)
 */
export function resetMockPosts(): void {
  postsStore = [...initialPosts, ...heatmapMockPosts];
  postIdCounter = 0;
}

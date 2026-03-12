/**
 * Service mock pour le Shared Emotional Whiteboard
 * À partir du 1er mars : données « réelles » (realPosts). Avant : mock heatmap uniquement (couleurs).
 */

import type { Post, MoodId, CreatePostPayload, DayHeatmapEntry } from '../../types/posts';
import type { MoodOption } from '../../types/posts';
import { MOOD_IDS, MOOD_VISUALS } from '../../constants/moodVisuals';
import { DEFAULT_FRAME_SIZE } from '../../constants/frameShapes';

const year = new Date().getFullYear();
/** À partir de cette date on utilise les données « réelles » ; avant = mock heatmap seulement */
export const DATA_CUTOFF_DATE = `${year}-03-01`;

/** Jours accessibles (ouvrir le board) : du 1er mars à aujourd’hui */
export function getAccessibleDates(): string[] {
  const cutoff = new Date(DATA_CUTOFF_DATE);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out: string[] = [];
  for (let d = new Date(cutoff); d <= today; d.setDate(d.getDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

/** Pour composants legacy — labels depuis moodVisuals (1 couleur = 1 label). */
export const MOOD_OPTIONS: MoodOption[] = MOOD_IDS.map((id) => ({ id, label: MOOD_VISUALS[id].label }));

/** Exemples d’images pour le moodboard (l’utilisateur peut utiliser n’importe quelle URL) */
export const MOCK_IMAGES = [
  { id: 'img-1', url: 'https://picsum.photos/seed/mood1/300/200', label: 'Paysage calme' },
  { id: 'img-2', url: 'https://picsum.photos/seed/mood2/300/200', label: 'Nature' },
  { id: 'img-3', url: 'https://picsum.photos/seed/mood3/300/200', label: 'Lumière' },
  { id: 'img-4', url: 'https://picsum.photos/seed/mood4/300/200', label: 'Douceur' },
  { id: 'img-5', url: 'https://picsum.photos/seed/mood5/300/200', label: 'Sérénité' },
  { id: 'img-6', url: 'https://picsum.photos/seed/mood6/300/200', label: 'Évasion' },
] as const;

/** Données initiales : cadres avec forme et taille (glisser, redimensionner, clic pour choisir une image). */
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
      if (dateStr >= DATA_CUTOFF_DATE || dateStr > todayStr) continue; // avant 1er mars + pas futur
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

/**
 * Données « réelles » à partir du 1er mars. Jours déjà passés en mars : images mock pour la visualisation.
 */
function seedMarchRealPosts(): Post[] {
  const todayStr = new Date().toISOString().slice(0, 10);
  const out: Post[] = [];
  let z = 0;
  for (let day = 1; day <= 31; day++) {
    const dateStr = `${year}-03-${String(day).padStart(2, '0')}`;
    if (dateStr > todayStr) break;
    const moods: MoodId[] = ['serenity', 'wonder', 'tenderness', 'longing', 'quiet'];
    const mood1 = moods[day % moods.length];
    const mood2 = moods[(day + 1) % moods.length];
    const mood3 = moods[(day + 2) % moods.length];
    out.push({
      id: `real-mar-${day}-img1`,
      text: '',
      mood: mood1,
      createdAt: `${dateStr}T09:00:00.000Z`,
      boardDate: dateStr,
      x: 100,
      y: 80,
      width: 200,
      height: 180,
      shape: 'rectangle',
      frameType: 'image',
      imageUrl: MOCK_IMAGES[day % MOCK_IMAGES.length].url,
      zIndex: z++,
      createdBy: 'me',
    });
    out.push({
      id: `real-mar-${day}-img2`,
      text: '',
      mood: mood2,
      createdAt: `${dateStr}T10:00:00.000Z`,
      boardDate: dateStr,
      x: 340,
      y: 100,
      width: 180,
      height: 180,
      shape: 'circle',
      frameType: 'image',
      imageUrl: MOCK_IMAGES[(day + 1) % MOCK_IMAGES.length].url,
      zIndex: z++,
      createdBy: 'alice',
    });
    out.push({
      id: `real-mar-${day}-txt`,
      text: day === 1 ? 'Premier jour de mars.' : day === 2 ? 'Petit moment de calme.' : 'Une journée comme les autres.',
      mood: mood3,
      createdAt: `${dateStr}T11:00:00.000Z`,
      boardDate: dateStr,
      x: 120,
      y: 320,
      width: 220,
      height: 100,
      shape: 'rectangle',
      frameType: 'text',
      zIndex: z++,
      createdBy: 'bob',
    });
  }
  return out;
}

let realPosts: Post[] = seedMarchRealPosts();
let postIdCounter = 1000;

/** Humeur du jour par board (à partir du 1er mars). Persiste quand l’utilisateur change. */
const boardMoodsStore: Record<string, MoodId> = {};

function nextPostId(): string {
  postIdCounter += 1;
  return `mock-${Date.now()}-${postIdCounter}`;
}

/** Récupère l’humeur du jour pour un board (sauvegardée ou déduite du premier post). */
export function getBoardMood(boardDate: string): MoodId {
  if (boardDate < DATA_CUTOFF_DATE) return 'serenity';
  if (boardMoodsStore[boardDate]) return boardMoodsStore[boardDate];
  const first = realPosts.find((p) => p.boardDate === boardDate);
  return first?.mood ?? 'serenity';
}

/** Enregistre l’humeur du jour pour un board (changement par l’utilisateur). */
export function setBoardMood(boardDate: string, mood: MoodId): void {
  if (boardDate < DATA_CUTOFF_DATE) return;
  boardMoodsStore[boardDate] = mood;
}

/**
 * Récupère les notes du board d’un jour donné
 */
export function getPostsByDate(boardDate: string): Promise<Post[]> {
  if (boardDate < DATA_CUTOFF_DATE) return Promise.resolve([]);
  const list = realPosts.filter((p) => p.boardDate === boardDate);
  return Promise.resolve([...list]);
}

/**
 * Ajoute une note. Uniquement pour boardDate >= 1er mars (données réelles).
 */
export function addPost(payload: CreatePostPayload): Promise<Post> {
  if (payload.boardDate < DATA_CUTOFF_DATE) {
    return Promise.reject(new Error('Ajout possible uniquement à partir du 1er mars.'));
  }
  const x = payload.x ?? 60 + Math.random() * 200;
  const y = payload.y ?? 80 + Math.random() * 180;
  const maxZ = realPosts.length > 0 ? Math.max(...realPosts.map((p) => p.zIndex)) : -1;
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
    createdBy: 'me',
  };
  realPosts = [post, ...realPosts];
  return Promise.resolve(post);
}

/**
 * Met à jour une note (données réelles, à partir du 1er mars).
 */
export function updatePost(id: string, updates: Partial<Omit<Post, 'id'>>): Promise<Post> {
  const index = realPosts.findIndex((p) => p.id === id);
  if (index === -1) return Promise.reject(new Error('Post introuvable'));
  const current = realPosts[index];
  const updated: Post = { ...current, ...updates };
  realPosts = [...realPosts.slice(0, index), updated, ...realPosts.slice(index + 1)];
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

  const allForHeatmap: Post[] = [...heatmapMockPosts, ...initialPosts, ...realPosts];
  allForHeatmap.forEach((p) => {
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
  realPosts = seedMarchRealPosts();
  postIdCounter = 1000;
  Object.keys(boardMoodsStore).forEach((k) => delete boardMoodsStore[k]);
}

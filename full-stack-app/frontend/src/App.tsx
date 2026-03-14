/**
 * Point d'entrée : Shared Emotional Whiteboard
 * Vue principale = heatmap 12 mois + accès boards. Clic jour → board du jour.
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { MoodId } from './types/posts';
import type { CreatePostPayload } from './types/posts';
import { useAuth } from './hooks/useAuth';
import { useBoard } from './hooks/useBoard';
import { useYearHeatmap } from './hooks/useYearHeatmap';
import LoginPage from './components/LoginPage/LoginPage';
import HeatmapView from './components/HeatmapView/HeatmapView';
import DailyBoard from './components/DailyBoard/DailyBoard';
import './App.css';

/** Formate une date en 'YYYY-MM-DD' selon l'heure locale (pas UTC) */
function localDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Génère tous les jours de Jan 1 de l'année en cours à aujourd'hui (heure locale) */
function getAccessibleDates(): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today.getFullYear(), 0, 1);
  const dates: string[] = [];
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    dates.push(localDateStr(d));
  }
  return dates.reverse();
}

function App() {
  const { user, loading: authLoading, logout } = useAuth();

  // today mis à jour automatiquement à minuit (pas frozen au démarrage)
  const [today, setToday] = useState(() => new Date());
  useEffect(() => {
    const schedule = (): ReturnType<typeof setTimeout> => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const ms = midnight.getTime() - now.getTime();
      return setTimeout(() => { setToday(new Date()); schedule(); }, ms);
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  const accessibleDates = useMemo(() => getAccessibleDates(), [today]);
  const initialDate = useMemo(
    () => (accessibleDates.length > 0 ? accessibleDates[0] : null),
    [accessibleDates]
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate);
  const [boardExpanded, setBoardExpanded] = useState(false);

  const year = today.getFullYear();
  const isReadOnly = selectedDate !== null && initialDate !== null && selectedDate < initialDate;

  const { heatmapByMonth, loading: heatmapLoading, refresh: refreshHeatmap } = useYearHeatmap(year);
  const { posts, loading: boardLoading, boardMood, setBoardMood, createPost, updatePost, deletePost } = useBoard(selectedDate, user?.id);

  useEffect(() => {
    if (selectedDate === null) refreshHeatmap();
  }, [selectedDate, refreshHeatmap]);

  // Wrappers qui rafraîchissent le heatmap après chaque changement du board
  const handleMoodChange = useCallback((mood: MoodId) => {
    setBoardMood(mood);
    // Délai court pour laisser le PUT /api/board-moods se terminer avant de re-fetch
    setTimeout(refreshHeatmap, 400);
  }, [setBoardMood, refreshHeatmap]);

  const handleCreatePost = useCallback((payload: Omit<CreatePostPayload, 'boardDate'>) => {
    return createPost(payload).then((post) => {
      refreshHeatmap();
      return post;
    });
  }, [createPost, refreshHeatmap]);

  const handleDeletePost = useCallback((id: string) => {
    return deletePost(id).then(() => { refreshHeatmap(); });
  }, [deletePost, refreshHeatmap]);

  if (authLoading) {
    return <div className="app__loading-screen">Chargement…</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Mood Board</h1>
        <div className="app__header-user">
          {user.picture && (
            <img src={user.picture} alt={user.name} className="app__user-avatar" referrerPolicy="no-referrer" />
          )}
          <span className="app__user-name">{user.name}</span>
          <button
            type="button"
            className="app__logout"
            onClick={logout}
            aria-label="Se déconnecter"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {heatmapLoading && !boardExpanded && <p className="app__loading">Chargement…</p>}

      <div className={`app__main ${boardExpanded ? 'app__main--board-only' : ''}`}>
        {!boardExpanded && !heatmapLoading && (
          <aside className="app__heatmap">
            <HeatmapView
              year={year}
              heatmapByMonth={heatmapByMonth}
              accessibleDates={accessibleDates}
              onSelectDay={setSelectedDate}
            />
          </aside>
        )}
        <main className="app__board">
          {selectedDate == null ? (
            <div className="app__placeholder" aria-hidden />
          ) : (
            <>
              {boardLoading && <p className="app__loading">Chargement…</p>}
              {!boardLoading && (
                <DailyBoard
                  boardDate={selectedDate}
                  posts={posts}
                  dayMood={boardMood}
                  onDayMoodChange={handleMoodChange}
                  createPost={handleCreatePost}
                  updatePost={updatePost}
                  deletePost={handleDeletePost}
                  isFullScreen={boardExpanded}
                  onExpandFullScreen={() => setBoardExpanded(true)}
                  onCollapseFullScreen={() => setBoardExpanded(false)}
                  isReadOnly={isReadOnly}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

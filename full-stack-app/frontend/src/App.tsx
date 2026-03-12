/**
 * Point d'entrée : Shared Emotional Whiteboard
 * Vue principale = heatmap 12 mois + accès boards. Clic jour → board du jour.
 */

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useBoard } from './hooks/useBoard';
import { useYearHeatmap } from './hooks/useYearHeatmap';
import LoginPage from './components/LoginPage/LoginPage';
import HeatmapView from './components/HeatmapView/HeatmapView';
import DailyBoard from './components/DailyBoard/DailyBoard';
import './App.css';

/** Génère tous les jours de Jan 1 de l'année en cours à aujourd'hui */
function getAccessibleDates(): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today.getFullYear(), 0, 1);
  const dates: string[] = [];
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates.reverse();
}

function App() {
  const { user, loading: authLoading, logout } = useAuth();

  const now = useMemo(() => new Date(), []);
  const accessibleDates = useMemo(() => getAccessibleDates(), []);
  const initialDate = useMemo(
    () => (accessibleDates.length > 0 ? accessibleDates[0] : null),
    [accessibleDates]
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate);
  const [boardExpanded, setBoardExpanded] = useState(false);

  const year = now.getFullYear();
  const { heatmapByMonth, loading: heatmapLoading, refresh: refreshHeatmap } = useYearHeatmap(year);
  const { posts, loading: boardLoading, boardMood, setBoardMood, createPost, updatePost, deletePost } = useBoard(selectedDate, user?.id);

  useEffect(() => {
    if (selectedDate === null) refreshHeatmap();
  }, [selectedDate, refreshHeatmap]);

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
                  onDayMoodChange={setBoardMood}
                  createPost={createPost}
                  updatePost={updatePost}
                  deletePost={deletePost}
                  isFullScreen={boardExpanded}
                  onExpandFullScreen={() => setBoardExpanded(true)}
                  onCollapseFullScreen={() => setBoardExpanded(false)}
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

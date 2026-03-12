/**
 * Point d’entrée : Shared Emotional Whiteboard
 * Vue principale = heatmap 12 mois + accès boards (scroll). Clic jour → board du jour
 */

import { useState, useMemo, useEffect } from 'react';
import { useBoard } from './hooks/useBoard';
import { useYearHeatmap } from './hooks/useYearHeatmap';
import { getAccessibleDates } from './services/mock/posts';
import LoginPage from './components/LoginPage/LoginPage';
import HeatmapView from './components/HeatmapView/HeatmapView';
import DailyBoard from './components/DailyBoard/DailyBoard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
  const { posts, loading: boardLoading, boardMood, setBoardMood, createPost, updatePost, deletePost } = useBoard(selectedDate);

  useEffect(() => {
    if (selectedDate === null) refreshHeatmap();
  }, [selectedDate, refreshHeatmap]);

  if (!isLoggedIn) {
    return <LoginPage onSignInWithGoogle={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Mood Board</h1>
        <button
          type="button"
          className="app__logout"
          onClick={() => setIsLoggedIn(false)}
          aria-label="Se déconnecter"
        >
          Déconnexion
        </button>
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

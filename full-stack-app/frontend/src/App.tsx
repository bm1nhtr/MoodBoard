/**
 * Point d’entrée : Shared Emotional Whiteboard
 * Vue principale = heatmap 12 mois + accès boards (scroll). Clic jour → board du jour
 */

import { useState, useMemo, useEffect } from 'react';
import { useBoard } from './hooks/useBoard';
import { useYearHeatmap } from './hooks/useYearHeatmap';
import HeatmapView from './components/HeatmapView/HeatmapView';
import DailyBoard from './components/DailyBoard/DailyBoard';
import './App.css';

function App() {
  const now = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = now.getFullYear();
  const accessibleDates = useMemo(
    () => [`${year}-03-01`, `${year}-03-02`, `${year}-03-03`],
    [year]
  );

  const { heatmapByMonth, loading: heatmapLoading, refresh: refreshHeatmap } = useYearHeatmap(year);
  const { posts, loading: boardLoading, createPost, updatePost } = useBoard(selectedDate);

  useEffect(() => {
    if (selectedDate === null) refreshHeatmap();
  }, [selectedDate, refreshHeatmap]);

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Mood Board</h1>
        {selectedDate && (
          <button
            type="button"
            className="app__back"
            onClick={() => setSelectedDate(null)}
            aria-label="Retour à la vue d'ensemble"
          >
            ← Vue d'ensemble
          </button>
        )}
      </header>

      {selectedDate == null ? (
        <>
          {heatmapLoading && <p className="app__loading">Chargement…</p>}
          {!heatmapLoading && (
            <HeatmapView
              year={year}
              heatmapByMonth={heatmapByMonth}
              accessibleDates={accessibleDates}
              onSelectDay={setSelectedDate}
            />
          )}
        </>
      ) : (
        <>
          {boardLoading && <p className="app__loading">Chargement…</p>}
          {!boardLoading && (
            <DailyBoard
              boardDate={selectedDate}
              posts={posts}
              createPost={createPost}
              updatePost={updatePost}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;

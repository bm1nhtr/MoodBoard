/**
 * Composant racine de l'application.
 * Gère deux vues : heatmap annuelle (colonne gauche) et board quotidien (zone principale).
 * Cliquer sur un jour dans la heatmap charge le board correspondant.
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { MoodId, CreatePostPayload } from './types/posts';
import { useAuth } from './hooks/useAuth';
import { useBoard } from './hooks/useBoard';
import { useYearHeatmap } from './hooks/useYearHeatmap';
import LoginPage from './components/LoginPage/LoginPage';
import HeatmapView from './components/HeatmapView/HeatmapView';
import DailyBoard from './components/DailyBoard/DailyBoard';
import './App.css';

/** Formate une date en 'YYYY-MM-DD' selon l'heure locale (évite le décalage UTC) */
function localDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Génère la liste de tous les jours du 1er janvier de l'année courante jusqu'à aujourd'hui.
 * Ordre décroissant : aujourd'hui en premier.
 */
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

  // "today" se met à jour automatiquement à minuit pour recalculer les dates accessibles
  const [today, setToday] = useState(() => new Date());
  useEffect(() => {
    const scheduleNextMidnight = (): ReturnType<typeof setTimeout> => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const ms = midnight.getTime() - now.getTime();
      return setTimeout(() => { setToday(new Date()); scheduleNextMidnight(); }, ms);
    };
    const t = scheduleNextMidnight();
    return () => clearTimeout(t);
  }, []);

  // Liste des dates cliquables : du 1er janv. à aujourd'hui
  const accessibleDates = useMemo(() => getAccessibleDates(), [today]);

  // Date sélectionnée par défaut = aujourd'hui (premier élément de la liste)
  const initialDate = useMemo(
    () => (accessibleDates.length > 0 ? accessibleDates[0] : null),
    [accessibleDates]
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate);

  const year = today.getFullYear();

  // Un jour passé (avant aujourd'hui) est en lecture seule : consultation uniquement
  const isReadOnly = selectedDate !== null && initialDate !== null && selectedDate < initialDate;

  const { heatmapByMonth, loading: heatmapLoading, refresh: refreshHeatmap } = useYearHeatmap(year);
  const { posts, loading: boardLoading, boardMood, setBoardMood, createPost, updatePost, deletePost } = useBoard(selectedDate);

  // Rafraîchit la heatmap quand on revient à la vue sans date sélectionnée
  useEffect(() => {
    if (selectedDate === null) refreshHeatmap();
  }, [selectedDate, refreshHeatmap]);

  // Après un changement de mood, on attend la réponse API avant de rafraîchir la heatmap
  const handleMoodChange = useCallback((mood: MoodId) => {
    setBoardMood(mood).then(refreshHeatmap);
  }, [setBoardMood, refreshHeatmap]);

  // Après la création d'un cadre, on rafraîchit la heatmap pour mettre à jour les couleurs
  const handleCreatePost = useCallback((payload: Omit<CreatePostPayload, 'boardDate'>) => {
    return createPost(payload).then((post) => {
      refreshHeatmap();
      return post;
    });
  }, [createPost, refreshHeatmap]);

  // Après la suppression d'un cadre, on rafraîchit la heatmap
  const handleDeletePost = useCallback((id: string) => {
    return deletePost(id).then(refreshHeatmap);
  }, [deletePost, refreshHeatmap]);

  // Pendant le chargement de la session : écran d'attente
  if (authLoading) {
    return <div className="app__loading-screen">Chargement…</div>;
  }

  // Non connecté : afficher la page de login
  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app">
      {/* En-tête : logo, avatar, bouton déconnexion */}
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

      {heatmapLoading && <p className="app__loading">Chargement…</p>}

      <div className="app__main">
        {/* Colonne gauche : heatmap des 12 mois */}
        {!heatmapLoading && (
          <aside className="app__heatmap">
            <HeatmapView
              year={year}
              heatmapByMonth={heatmapByMonth}
              accessibleDates={accessibleDates}
              onSelectDay={setSelectedDate}
            />
          </aside>
        )}

        {/* Zone principale : board du jour sélectionné */}
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

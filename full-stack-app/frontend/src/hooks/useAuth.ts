/**
 * Hook d'authentification : vérifie la session active et expose les actions login/logout.
 * Appelle GET /api/auth/me au montage pour savoir si l'utilisateur est connecté.
 */

import { useState, useEffect, useCallback } from 'react';

/** Structure de l'utilisateur retourné par l'API /auth/me */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  /** URL de la photo de profil Google */
  picture: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /** Interroge le backend pour récupérer l'utilisateur connecté (session cookie). */
  const fetchMe = useCallback(() => {
    setLoading(true);
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Vérifie la session à l'initialisation
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  /** Envoie POST /api/auth/logout puis vide l'état local. */
  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  }, []);

  return { user, loading, logout, refetch: fetchMe };
}

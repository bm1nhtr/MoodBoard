import { useState, useEffect } from 'react';
import type { User } from '../types/users';
import { getUsers } from '../services/api/users';


export function useUsers() {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getUsers().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);
  return { data, loading };
}
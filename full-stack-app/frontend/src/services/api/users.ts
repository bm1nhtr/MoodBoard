import type { User } from '../../types/users';

/** Forme de la réponse JSON renvoyée par la route Express. */
interface GetUsersResponse {
  message: string;
  users: User[];
}

export async function getUsers(): Promise<User[]> {
  const res = await fetch('http://localhost:3000/api/users');

  if (!res.ok) throw new Error('Échec de la récupération des utilisateurs');

  const data: GetUsersResponse = await res.json();
  return data.users; 
}
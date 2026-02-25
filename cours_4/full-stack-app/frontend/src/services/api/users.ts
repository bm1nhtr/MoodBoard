import type { User } from '../../types/users';

// Define the shape of the JSON your Express route sends
interface GetUsersResponse {
  message: string;
  users: User[];
}

export async function getUsers(): Promise<User[]> {
  const res = await fetch('http://localhost:3000/api/users');
  
  if (!res.ok) throw new Error('Failed to fetch users');

  // 1. Parse the full object
  const data: GetUsersResponse = await res.json();
    
  // 2. Return ONLY the users array to your component
  return data.users; 
}
/**
 * Mock pour la démo collaborative : membres du groupe, humeurs par utilisateur.
 */

import type { MoodId, MockRoomMember } from '../../types/posts';

/** Membres du groupe (mock) : Moi + 2 autres avec humeur fixe pour la démo. */
export function getMockRoomMembers(myMood: MoodId): MockRoomMember[] {
  return [
    { id: 'me', name: 'Moi', isMe: true, mood: myMood },
    { id: 'alice', name: 'Alice', isMe: false, mood: 'serenity' },
    { id: 'bob', name: 'Bob', isMe: false, mood: 'longing' },
  ];
}

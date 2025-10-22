import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';

interface AppState {
  // User state
  currentUser: User | null;
  currentRole: UserRole;

  // Actions
  setCurrentUser: (user: User | null) => void;
  setCurrentRole: (role: UserRole) => void;
}

/**
 * Global Application State Store
 *
 * Uses Zustand for simple, performant state management.
 * State is persisted to localStorage.
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      currentUser: null,
      currentRole: 'FAN',

      // Actions
      setCurrentUser: (user) => set({ currentUser: user }),
      setCurrentRole: (role) => set({ currentRole: role }),
    }),
    {
      name: 'sonnetix-app-storage',
    }
  )
);

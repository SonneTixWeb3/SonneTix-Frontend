import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';

interface AppState {
  // User state
  currentUser: User | null;
  currentRole: UserRole;
  currentUserId: string | null;

  // Actions
  setCurrentUser: (user: User | null) => void;
  setCurrentRole: (role: UserRole) => void;
  setCurrentUserId: (userId: string | null) => void;

  // Helper to initialize mock user based on role
  initializeMockUser: (role: UserRole) => void;
}

/**
 * Mock User IDs for Demo
 * Maps roles to predefined mock user IDs in mockUsers data
 */
const MOCK_USER_IDS: Record<UserRole, string> = {
  ORGANIZER: 'USR-001', // John Doe - Event Organizer
  INVESTOR: 'USR-002',  // Jane Smith - Investor
  FAN: 'USR-003',       // Alice Johnson - Fan
  SCANNER: 'USR-004',   // Bob Wilson - Scanner
};

/**
 * Global Application State Store
 *
 * Uses Zustand for simple, performant state management.
 * State is persisted to localStorage.
 */
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      currentRole: 'FAN',
      currentUserId: MOCK_USER_IDS.FAN, // Default to fan user

      // Actions
      setCurrentUser: (user) => set({
        currentUser: user,
        currentUserId: user?.userId || null,
      }),

      setCurrentRole: (role) => {
        set({ currentRole: role });
        // Auto-initialize mock user when role changes
        get().initializeMockUser(role);
      },

      setCurrentUserId: (userId) => set({ currentUserId: userId }),

      // Initialize mock user based on role (for demo purposes)
      initializeMockUser: (role: UserRole) => {
        const mockUserId = MOCK_USER_IDS[role];
        set({ currentUserId: mockUserId });
      },
    }),
    {
      name: 'sonnetix-app-storage',
    }
  )
);

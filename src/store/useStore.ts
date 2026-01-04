import { create } from 'zustand';
import { format } from 'date-fns';

export interface FoodItem {
  name: string;
  calories: number;
  timestamp?: string; // Added timestamp
}

export interface DailyLog {
  date: string;
  totalCalories: number;
  entries: FoodItem[];
}

export interface UserPreferences {
  dailyLimit: number;
  weight: number;
  height: number;
  age: number;
  activityLevel: string;
}

interface AppState {
  streak: {
      current: number;
      lastLogDate: string | null;
  };
  todayLog: DailyLog;
  dailyLimit: number; // Current effective limit
  
  setDailyLimit: (limit: number) => void;
  addFoodEntry: (entry: FoodItem) => void;
  setTodayLog: (log: DailyLog) => void; // New Action
  resetDailyLog: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  
  // For Onboarding
  userPreferences: UserPreferences | null;
  setUserPreferences: (prefs: Partial<UserPreferences>) => void;
  syncStreak: (streak: number, lastLogDate: string) => void;
}

const INITIAL_LOG: DailyLog = {
  date: format(new Date(), 'yyyy-MM-dd'),
  totalCalories: 0,
  entries: []
};

export const useStore = create<AppState>((set) => ({
  streak: {
      current: 0,
      lastLogDate: null
  },
  dailyLimit: 2000,
  todayLog: INITIAL_LOG,
  userPreferences: null,

  setDailyLimit: (limit) => set({ dailyLimit: limit }),
  
  setUserPreferences: (prefs) => set((state) => ({
      userPreferences: { ...state.userPreferences, ...prefs } as UserPreferences,
      dailyLimit: prefs.dailyLimit ?? state.dailyLimit // Use nullish coalescing to keep existing limit if not provided
  })),

  // Add entry optimistically or from DB
  addFoodEntry: (entry) => set((state) => {
    const newTotal = state.todayLog.totalCalories + entry.calories;
    return {
      todayLog: {
        ...state.todayLog,
        totalCalories: newTotal,
        entries: [...state.todayLog.entries, entry]
      }
    };
  }),

  setTodayLog: (log) => set({ todayLog: log }), // New Action impl

  resetDailyLog: () => set({ todayLog: INITIAL_LOG }),
  
  incrementStreak: () => set((state) => ({ 
      streak: { 
          ...state.streak,
          current: state.streak.current + 1 
      } 
  })),
  
  syncStreak: (streak, lastLogDate) => set({ 
      streak: { current: streak, lastLogDate } 
  }),

  resetStreak: () => set({ streak: { current: 0, lastLogDate: null } }),
}));

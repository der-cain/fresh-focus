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
  dailyLimit: number; // Current effective limit
  currentStreak: number;
  todayLog: DailyLog;
  
  setDailyLimit: (limit: number) => void;
  addFoodEntry: (entry: FoodItem) => void;
  setTodayLog: (log: DailyLog) => void; // New Action
  resetDailyLog: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  
  // For Onboarding
  userPreferences: UserPreferences | null;
  setUserPreferences: (prefs: UserPreferences) => void;
}

const INITIAL_LOG: DailyLog = {
  date: format(new Date(), 'yyyy-MM-dd'),
  totalCalories: 0,
  entries: []
};

export const useStore = create<AppState>((set) => ({
  dailyLimit: 2000,
  currentStreak: 0,
  todayLog: INITIAL_LOG,
  userPreferences: null,

  setDailyLimit: (limit) => set({ dailyLimit: limit }),
  
  setUserPreferences: (prefs) => set({ 
    userPreferences: prefs,
    dailyLimit: prefs.dailyLimit 
  }),

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
  
  incrementStreak: () => set((state) => ({ currentStreak: state.currentStreak + 1 })),
  
  resetStreak: () => set({ currentStreak: 0 }),
}));

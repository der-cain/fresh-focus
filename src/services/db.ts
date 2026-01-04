import { db } from '../lib/firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import type { DailyLog, FoodItem } from '../store/useStore';

const USERS_COLLECTION = 'users';
const LOGS_COLLECTION = 'daily_logs';

export const FirestoreService = {
  // Save user preferences (onboarding)
  async saveUserPreferences(userId: string, prefs: any) {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(userRef, { 
      uid: userId,
      ...prefs,
      createdAt: new Date().toISOString()
    }, { merge: true });
  },

  // Get or Create Daily Log
  async getDailyLog(userId: string, date: string): Promise<DailyLog | null> {
    const logId = `${userId}_${date}`;
    const logRef = doc(db, LOGS_COLLECTION, logId);
    const docSnap = await getDoc(logRef);

    if (docSnap.exists()) {
      return docSnap.data() as DailyLog;
    }
    return null;
  },

  // Add Food Entry
  async addFoodEntry(userId: string, date: string, entry: FoodItem) {
    const logId = `${userId}_${date}`;
    const logRef = doc(db, LOGS_COLLECTION, logId);
    
    // Check if doc exists to determine if we set or update
    const docSnap = await getDoc(logRef);
    
    if (!docSnap.exists()) {
      // Create new log for today
      await setDoc(logRef, {
        userId,
        date,
        totalCalories: entry.calories,
        entries: [entry]
      });
    } else {
      // Update existing
      const currentData = docSnap.data();
      const newTotal = currentData.totalCalories + entry.calories;
      
      await updateDoc(logRef, {
        totalCalories: newTotal,
        entries: arrayUnion(entry)
      });
    }
  },
  
  // Create empty log if needed (e.g. for streak check on new day)
  async ensureDailyLog(userId: string, date: string) {
     const logId = `${userId}_${date}`;
     const logRef = doc(db, LOGS_COLLECTION, logId);
     const docSnap = await getDoc(logRef);
     
     if (!docSnap.exists()) {
         const initialLog = {
             userId,
             date,
             totalCalories: 0,
             entries: []
         };
         await setDoc(logRef, initialLog);
         return initialLog;
     }
     return docSnap.data() as DailyLog;
  },

  // Streak Persistence
  async updateUserStreak(userId: string, streak: number, lastLogDate: string) {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      'streak.current': streak,
      'streak.lastLogDate': lastLogDate
    });
  },

  async getUserProfile(userId: string) {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
  }
};

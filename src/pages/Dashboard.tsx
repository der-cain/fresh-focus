import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import type { DailyLog } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { FirestoreService } from '../services/db';
import { format } from 'date-fns';
import { ProgressBar } from '../components/ProgressBar';
import { MealList } from '../components/MealList';
import { AddItemDrawer } from '../components/AddItemDrawer';
import { Flame, Plus, LogOut } from 'lucide-react';
import { StreakCheckModal } from '../components/StreakCheckModal';
import { StreakService } from '../services/streak';
import type { StreakResult } from '../services/streak';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { todayLog, dailyLimit, streak, setTodayLog, syncStreak } = useStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const [streakResult, setStreakResult] = useState<StreakResult | null>(null);
  
  // Use a ref to prevent double-firing on dev strict mode
  const checkedRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    
    const initData = async () => {
      try {
       // 1. Get Today's Log
       let log: DailyLog | null = null;
       const isDemo = (user as any).providerId === 'demo';

       if (isDemo) {
           // For demo, we just use local state or an empty log if not found in memory? 
           // Since we can't persist to DB, we can't really "get" the log unless we use localStorage or store.
           // For now, let's create a fresh log for demo user on every reload (or rely on store state if preserved).
           // Actually, best to just return a fresh log.
           log = { date: dateStr, totalCalories: 0, entries: [] };
       } else {
           log = await FirestoreService.getDailyLog(user.uid, dateStr);
           if (!log) {
               log = await FirestoreService.ensureDailyLog(user.uid, dateStr);
           }
       }
       setTodayLog(log as DailyLog);

       // 2. Check Streak (Only once per session/mount)
       if (!checkedRef.current) {
          checkedRef.current = true;
          
          let lastLog = null;
          let current = 0;

          if (isDemo) {
              // Demo user: Always start fresh or simulate specific state?
              // To verifying the "Reset" modal, we want it to act like a user with NO history (or old history).
              // Let's assume defaults (null/0).
          } else {
              const profile = await FirestoreService.getUserProfile(user.uid);
              lastLog = profile?.streak?.lastLogDate || null;
              current = profile?.streak?.current || 0;
          }

          console.log('[Dashboard] Steak Data:', { lastLog, current });
          const result = StreakService.calculateStreak(lastLog, current);
          console.log('[Dashboard] Calc Result:', result);
          
          if (result.status !== 'same_day' || !lastLog) {
              setStreakResult(result);
              setStreakModalOpen(true);
              
              // Only persist for real users
              if (!isDemo) {
                if (result.status === 'lost') {
                    await FirestoreService.updateUserStreak(user.uid, 0, dateStr);
                } else if (result.status === 'kept') {
                    await FirestoreService.updateUserStreak(user.uid, result.streak, dateStr);
                }
              }
              // Always sync local
              syncStreak(result.streak === 0 ? 0 : result.streak, dateStr);
          } else {
              syncStreak(current, lastLog || dateStr);
          }
       }
      } catch (err) {
          console.error("[Dashboard] Error initializing:", err);
      }
    };
    
    initData();
  }, [user, setTodayLog, syncStreak]);

  return (
    <div className="min-h-screen bg-oat-200 pb-20 relative page-fade-in">
        {/* Header */}
        <header className="bg-oat-200/90 backdrop-blur sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm text-sm font-bold text-orange-500">
                    <Flame className="w-4 h-4 fill-orange-500" />
                    <span>{streak.current} Day Streak</span>
                </div>
            </div>
            <button onClick={logout} className="p-2 hover:bg-oat-300 rounded-full transition-colors">
                <LogOut className="w-5 h-5 text-loam-600" />
            </button>
        </header>

        {/* Main Content */}
        <main className="px-6 pt-6 max-w-md mx-auto">
            <div className="mb-8">
                <ProgressBar current={todayLog.totalCalories} max={dailyLimit} />
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-bold text-loam-800">Today's Meals</h3>
            </div>
            
            <MealList entries={todayLog.entries} />
        </main>

        {/* FAB */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
            <button 
                onClick={() => setDrawerOpen(true)}
                className="bg-loam-800 hover:bg-loam-900 text-white p-4 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95 flex items-center justify-center animate-pulse-subtle"
            >
                <Plus className="w-8 h-8" />
            </button>
        </div>

        <AddItemDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
      />

      {streakResult && (
        <StreakCheckModal 
            isOpen={streakModalOpen}
            onClose={() => setStreakModalOpen(false)}
            result={streakResult}
        />
      )}
    </div>
  );
}

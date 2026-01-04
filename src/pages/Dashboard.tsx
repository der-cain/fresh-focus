import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { FirestoreService } from '../services/db';
import { format } from 'date-fns';
import { ProgressBar } from '../components/ProgressBar';
import { MealList } from '../components/MealList';
import { AddItemDrawer } from '../components/AddItemDrawer';
import { LogOut, Flame, Plus } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { todayLog, dailyLimit, currentStreak } = useStore(); // TODO: We need a setTodayLog in store
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
        if (!user) return;
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        
        // 1. Get Daily Log
        const log = await FirestoreService.ensureDailyLog(user.uid, todayStr);
        if (log) {
            // Need to sync store. For now, since addFoodEntry adds incrementally, 
            // we might want a 'setEntireLog' action. 
            // For MVP simplicity let's just assume we reload or fetch fresh.
            // Actually, we need to update the store with fetched data.
            // Let's add 'setTodayLog' to store in next step or now. 
            // For now, I will assume the store is fresh or persisted incorrectly from previous session.
            // Ideally we fetch and SET the store state.
             useStore.setState({ todayLog: log as any }); // Type assertion for MVP simplicity
        }
        
        // 2. Get User Prefs (for Daily Limit) if needed
        // For MVP assuming default or previously set. 
        // Real app would fetch user profile here.
    };
    loadData();
  }, [user]);

  return (
    <div className="min-h-screen bg-oat-200 pb-20 relative">
        {/* Header */}
        <header className="bg-oat-200/90 backdrop-blur sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm text-sm font-bold text-orange-500">
                    <Flame className="w-4 h-4 fill-orange-500" />
                    <span>{currentStreak} Day Streak</span>
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
                className="bg-loam-800 hover:bg-loam-900 text-white p-4 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
            >
                <Plus className="w-8 h-8" />
            </button>
        </div>

        <AddItemDrawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}

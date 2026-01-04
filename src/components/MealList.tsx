import { useRef, useEffect } from 'react';
import type { FoodItem } from '../store/useStore';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { FirestoreService } from '../services/db';
import { format } from 'date-fns';
import { MealItem } from './MealItem';

interface MealListProps {
  entries: FoodItem[];
}

export const MealList = ({ entries }: MealListProps) => {
  const { user } = useAuth();
  const { removeFoodEntry } = useStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when entries update
    if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [entries]);

  const handleDelete = async (entry: FoodItem) => {
    if (!user || !entry.timestamp) return;
    
    // Optimistic UI update
    removeFoodEntry(entry.timestamp);
    
    // Persist if not demo user
    const isDemo = (user as any).providerId === 'demo';
    if (!isDemo) {
        await FirestoreService.deleteFoodEntry(user.uid, format(new Date(), 'yyyy-MM-dd'), entry);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-10 opacity-50">
        <p className="text-loam-600">Your plate is empty today.</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {entries.map((entry, idx) => (
        <MealItem 
            key={entry.timestamp || idx} 
            entry={entry} 
            index={idx}
            onDelete={handleDelete}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

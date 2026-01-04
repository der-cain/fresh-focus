import { useRef, useEffect } from 'react';
import type { FoodItem } from '../store/useStore';
import { Card } from './Card';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

interface MealListProps {
  entries: FoodItem[];
}

export const MealList = ({ entries }: MealListProps) => {
    
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when entries update
    if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="text-center py-10 opacity-50">
        <p className="text-loam-600">Your plate is empty today.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-24"> {/* Padding for FAB */}
      {entries.map((entry, idx) => (
        <Card 
            key={idx} 
            className="flex justify-between items-center py-4 px-5 animate-stagger-fade-in"
            style={{ animationDelay: `${idx * 0.05}s` }}
        >
           <div className="flex items-center gap-3">
              <div className="bg-matcha-100 p-2 rounded-full">
                 <div className="w-2 h-2 bg-matcha-500 rounded-full"></div>
              </div>
              <div>
                 <h4 className="font-bold text-loam-800">{entry.name}</h4>
                 <div className="flex items-center gap-1 text-xs text-loam-500 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{entry.timestamp ? format(new Date(entry.timestamp), 'HH:mm') : 'Just now'}</span>
                 </div>
              </div>
           </div>
           <div className="font-mono font-bold text-loam-700">
              {entry.calories}
           </div>
        </Card>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

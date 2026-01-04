import { useState } from 'react';
import { Card } from './Card';
import { Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import type { FoodItem } from '../store/useStore';

interface MealItemProps {
  entry: FoodItem;
  onDelete: (entry: FoodItem) => void;
  index: number;
}

export const MealItem = ({ entry, onDelete, index }: MealItemProps) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swiped, setSwiped] = useState(false);
  
  // Required for swipe threshold
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    if (isLeftSwipe) {
      setSwiped(true);
    } else if (distance < -minSwipeDistance) {
      setSwiped(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl mb-3">
      {/* Background Action (Delete) */}
      <div 
        className={cn(
            "absolute inset-0 bg-persimmon-500 flex items-center justify-end px-6 transition-opacity",
            swiped ? "opacity-100" : "opacity-0"
        )}
      >
        <button 
            onClick={() => onDelete(entry)}
            className="text-white flex flex-col items-center gap-1"
        >
            <Trash2 className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">Delete</span>
        </button>
      </div>

      {/* Main Card */}
      <Card 
        className={cn(
            "flex justify-between items-center py-4 px-5 transition-transform duration-300 ease-out animate-stagger-fade-in relative z-10 select-none",
            swiped ? "-translate-x-24" : "translate-x-0"
        )}
        style={{ animationDelay: `${index * 0.05}s` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => swiped && setSwiped(false)}
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
    </div>
  );
};

import { Flame, X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../lib/utils';
import type { StreakResult } from '../services/streak';

interface StreakCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: StreakResult;
}

export const StreakCheckModal = ({ isOpen, onClose, result }: StreakCheckModalProps) => {
  if (!isOpen) return null;

  const isPositive = result.status === 'kept' || result.status === 'extended' || result.status === 'same_day';


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className={cn(
        "relative w-full max-w-sm rounded-3xl p-8 pt-12 shadow-2xl text-center transform transition-all duration-500 animate-in zoom-in-95",
        isPositive ? "bg-gradient-to-br from-white to-matcha-50" : "bg-white"
      )}>
        
        {/* Icon */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <div className={cn(
                 "p-6 rounded-full shadow-xl border-4 border-white flex items-center justify-center",
                 isPositive ? "bg-persimmon-400" : "bg-loam-100"
             )}>
                {isPositive ? (
                    <Flame className="w-10 h-10 text-white fill-white animate-pulse" />
                ) : (
                    <X className="w-10 h-10 text-loam-400" />
                )}
             </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-loam-800 mb-2">
            {isPositive ? "Streak Ignited!" : "Streak Reset"}
        </h2>
        
        <p className="text-loam-600 mb-6 font-medium">
            {result.message}
        </p>
        
        <div className="flex justify-center items-center gap-2 mb-8">
            <div className="text-5xl font-black text-loam-800 font-mono tracking-tighter">
                {result.streak}
            </div>
            <div className="text-sm font-bold text-loam-500 uppercase tracking-widest -rotate-90 origin-center">
                DAYS
            </div>
        </div>

        <Button onClick={onClose} className="w-full">
            {isPositive ? "Awesome!" : "Shoulder to the Wheel"}
        </Button>
      </div>
    </div>
  );
};

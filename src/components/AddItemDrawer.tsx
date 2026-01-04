import React, { useState } from 'react';
import { X, Search, Camera } from 'lucide-react'; // Camera for future
import { Button } from './Button';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { FirestoreService } from '../services/db';
import { format } from 'date-fns';

interface AddItemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddItemDrawer = ({ isOpen, onClose }: AddItemDrawerProps) => {
  const [query, setQuery] = useState('');
  const [calories, setCalories] = useState('');
  const { user } = useAuth();
  const addFoodEntry = useStore(state => state.addFoodEntry);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || !calories || !user) return;

    setLoading(true);
    const entry = {
      name: query,
      calories: parseInt(calories),
      timestamp: new Date().toISOString()
    };

    try {
        // Optimistic update
        addFoodEntry(entry);
        
        // Persist
        await FirestoreService.addFoodEntry(user.uid, format(new Date(), 'yyyy-MM-dd'), entry);
        
        // Reset and close
        setQuery('');
        setCalories('');
        onClose();
    } catch (err) {
        console.error("Failed to add entry", err);
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={cn(
        "bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 transform transition-transform duration-300 ease-out",
        "animate-in slide-in-from-bottom"
      )}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-loam-800">Add to your plate</h3>
          <button onClick={onClose} className="p-2 hover:bg-oat-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-loam-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-loam-400" />
             <input
                type="text"
                placeholder="What did you eat?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full pl-12 pr-4 py-4 bg-oat-50 rounded-xl border-2 border-transparent focus:border-matcha-400 outline-none text-lg text-loam-800 placeholder:text-loam-400 transition-all"
             />
          </div>

          <div className="flex gap-4">
             <div className="flex-1">
                <input
                    type="number"
                    placeholder="Calories"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full px-4 py-4 bg-oat-50 rounded-xl border-2 border-transparent focus:border-matcha-400 outline-none text-lg text-loam-800 placeholder:text-loam-400 font-mono transition-all"
                />
             </div>
             <Button type="submit" disabled={!query || !calories || loading} className="flex-1">
                {loading ? 'Adding...' : 'Add Meal'}
             </Button>
          </div>
          
          <div className="pt-4 flex justify-center">
             <button type="button" className="text-sm font-bold text-matcha-600 flex items-center gap-2 px-4 py-2 rounded-full hover:bg-matcha-50 transition-colors">
                <Camera className="w-4 h-4" /> Scan Meal (Coming Soon)
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { X, Search, Camera, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../lib/utils';
import type { FoodItem } from '../store/useStore';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { FirestoreService } from '../services/db';
import { format } from 'date-fns';
import { AIService } from '../services/ai';
import { AIAnalysisModal } from './AIAnalysisModal';

interface AddItemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddItemDrawer = ({ isOpen, onClose }: AddItemDrawerProps) => {
  const [query, setQuery] = useState('');
  const [calories, setCalories] = useState('');
  const [showAIModal, setShowAIModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{ items: FoodItem[]; total_estimated: number } | null>(null);
  
  const { user } = useAuth();
  const addFoodEntry = useStore(state => state.addFoodEntry);
  const [loading, setLoading] = useState(false);

  // Manual Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || !calories || !user) return;
    
    await saveEntry({
        name: query,
        calories: parseInt(calories),
        timestamp: new Date().toISOString()
    });
  };

  const saveEntry = async (entry: FoodItem) => {
    setLoading(true);
    try {
        if (!user) return;
        
        // Optimistic update (Store)
        addFoodEntry(entry);
        
        // Persist (Firestore) - Only if real user
        // We check if the user is our mock demo user by checking providerId
        // In AuthContext we set providerId: 'demo' for the demo user.
        const isDemo = (user as any).providerId === 'demo';
        
        if (!isDemo) {
             await FirestoreService.addFoodEntry(user.uid, format(new Date(), 'yyyy-MM-dd'), entry);
        }
        
        // Reset and close
        setQuery('');
        setCalories('');
        setShowAIModal(false);
        onClose();
    } catch (err) {
        console.error("Failed to add entry", err);
    } finally {
        setLoading(false);
    }
  };

  // AI Flows
  const handleAIAnalyze = async () => {
    if (!query) return;
    
    setShowAIModal(true);
    setIsAnalyzing(true);
    setAiResult(null);

    try {
        const result = await AIService.analyzeText(query);
        setAiResult(result);
    } catch (err) {
        console.error(err);
        // Handle error visually in real app
    } finally {
        setIsAnalyzing(false);
    }
  };
  
  const handleConfirmAI = async (items: FoodItem[]) => {
      // Save each item
      for (const item of items) {
          await saveEntry({ ...item, timestamp: new Date().toISOString() });
      }
  };

  const handleScanClick = () => {
    // Mock Scan Flow
    setShowAIModal(true);
    setIsAnalyzing(true);
    
    // Simulate file upload delay and processing
    setTimeout(async () => {
         const result = await AIService.analyzeImage(new File([], "mock.jpg"));
         setAiResult(result);
         setIsAnalyzing(false);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <>
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

        <div className="space-y-4">
          <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-loam-400" />
             <input
                type="text"
                placeholder="e.g. 'Avocado toast with egg'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full pl-12 pr-12 py-4 bg-oat-50 rounded-xl border-2 border-transparent focus:border-matcha-400 outline-none text-lg text-loam-800 placeholder:text-loam-400 transition-all font-sans"
             />
             {query.length > 2 && (
                 <button 
                    onClick={handleAIAnalyze}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-matcha-100 hover:bg-matcha-200 text-matcha-700 rounded-lg transition-colors"
                    title="Ask AI"
                 >
                    <Sparkles className="w-5 h-5" />
                 </button>
             )}
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
             <Button onClick={handleSubmit} disabled={!query || !calories || loading} className="flex-1">
                {loading ? 'Adding...' : 'Add Meal'}
             </Button>
          </div>
          
          <div className="pt-4 flex justify-center border-t border-oat-100 mt-4">
             <button 
                onClick={handleScanClick}
                className="text-sm font-bold text-matcha-700 flex items-center gap-2 px-6 py-3 rounded-full bg-matcha-50 hover:bg-matcha-100 transition-colors shadow-sm"
             >
                <Camera className="w-5 h-5" /> Scan Meal with AI
             </button>
          </div>
        </div>
      </div>
    </div>
    
    <AIAnalysisModal 
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        isAnalyzing={isAnalyzing}
        analysisResult={aiResult}
        onConfirm={handleConfirmAI}
    />
    </>
  );
};

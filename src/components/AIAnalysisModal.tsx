import { useState, useEffect } from 'react';
import type { FoodItem } from '../store/useStore';
import { Button } from './Button';
import { Card } from './Card';
import { Check, X, Sparkles } from 'lucide-react';

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAnalyzing: boolean;
  analysisResult: { items: FoodItem[]; total_estimated: number } | null;
  onConfirm: (items: FoodItem[]) => void;
}

export const AIAnalysisModal = ({ 
  isOpen, 
  onClose, 
  isAnalyzing, 
  analysisResult, 
  onConfirm 
}: AIAnalysisModalProps) => {
  const [items, setItems] = useState<FoodItem[]>([]);

  useEffect(() => {
    if (analysisResult) {
      setItems(analysisResult.items);
    }
  }, [analysisResult]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* State: Analyzing */}
        {isAnalyzing && (
          <div className="py-12 flex flex-col items-center justify-center text-center p-6 space-y-4">
             <div className="relative">
                <div className="absolute inset-0 bg-matcha-300 blur-xl opacity-30 animate-pulse"></div>
                <Sparkles className="w-12 h-12 text-matcha-500 animate-bounce relative z-10" />
             </div>
             <h3 className="text-xl font-bold text-loam-800">Reviewing your plate...</h3>
             <p className="text-loam-500 px-4">Our AI is identifying ingredients and estimating portion sizes.</p>
          </div>
        )}

        {/* State: Result Review */}
        {!isAnalyzing && analysisResult && (
          <div className="flex flex-col max-h-[80vh]">
             <div className="bg-matcha-50 p-6 text-center border-b border-matcha-100">
                <div className="inline-flex items-center justify-center bg-white p-2 rounded-full mb-2 shadow-sm">
                    <Sparkles className="w-5 h-5 text-matcha-500" />
                </div>
                <h3 className="text-lg font-bold text-loam-800">Here's what I found</h3>
                <p className="text-sm text-loam-600">Total Estimate: <span className="font-mono font-bold">{analysisResult.total_estimated}</span> cal</p>
             </div>

             <div className="p-4 space-y-3 overflow-y-auto">
                {items.map((item, idx) => (
                    <Card key={idx} variant="flat" className="flex justify-between items-center py-3 px-4">
                        <div className="flex items-center gap-3">
                             <span className="font-bold text-loam-800 text-sm">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <input 
                                type="number" 
                                className="w-16 bg-white rounded-md border border-oat-200 text-right px-1 font-mono text-sm"
                                value={item.calories}
                                onChange={(e) => {
                                    const newCal = parseInt(e.target.value) || 0;
                                    const newItems = [...items];
                                    newItems[idx].calories = newCal;
                                    setItems(newItems);
                                }}
                             />
                             <span className="text-xs text-loam-400">cal</span>
                             <button 
                                onClick={() => setItems(items.filter((_, i) => i !== idx))}
                                className="text-persimmon-400 hover:text-persimmon-600"
                             >
                                <X className="w-4 h-4" />
                             </button>
                        </div>
                    </Card>
                ))}

                <button 
                    onClick={() => setItems([...items, { name: "New Item", calories: 100 }])}
                    className="w-full py-2 text-sm font-bold text-matcha-600 border border-dashed border-matcha-300 rounded-xl hover:bg-matcha-50"
                >
                    + Add Missing Item
                </button>
             </div>

             <div className="p-4 border-t border-oat-100 bg-oat-50/50 flex gap-3">
                 <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
                 <Button onClick={() => onConfirm(items)} className="flex-1 flex gap-2 items-center">
                    <Check className="w-4 h-4" /> Save All
                 </Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

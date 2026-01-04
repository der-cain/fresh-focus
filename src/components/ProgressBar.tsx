import { cn } from '../lib/utils';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  className?: string; // Additional classes for the container
}

export const ProgressBar = ({ current, max, label, className }: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  const isOverLimit = current > max;
  
  // Determine color based on usage
  let colorClass = "bg-matcha-400"; // Safe zone
  if (percentage > 80) colorClass = "bg-yellow-400"; // Warning
  if (isOverLimit) colorClass = "bg-persimmon-400"; // Danger

  return (
    <div className={cn("relative w-full", className)}>
      <div className="flex justify-between items-end mb-2 px-1">
        <span className="text-sm font-bold text-loam-600">{label || "Daily Balance"}</span>
        <div className="text-right">
             <span className={cn("text-2xl font-mono font-bold", isOverLimit ? "text-persimmon-600" : "text-loam-800")}>
                {Math.round(max - current)}
             </span>
             <span className="text-xs text-loam-500 font-bold block">cal left</span>
        </div>
      </div>
      
      {/* The Tank Container */}
      <div className="h-14 bg-oat-50 rounded-2xl border-4 border-white shadow-inner overflow-hidden relative">
        {/* The Liquid */}
        <div 
            className={cn("h-full transition-all duration-1000 ease-out relative", colorClass)}
            style={{ width: `${percentage}%` }}
        >
            {/* Gloss/Reflections for liquid effect */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white opacity-20 rounded-t-lg"></div>
        </div>
        
        {/* Markers */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white opacity-30 border-l border-dashed"></div>
        
        {/* Text overlay if bar is full enough or empty enough? Maybe just keep outside to be clean */}
      </div>

       <div className="flex justify-between mt-1 px-1 text-xs text-loam-400 font-medium font-mono">
            <span>0</span>
            <span>{max}</span>
       </div>
    </div>
  );
};

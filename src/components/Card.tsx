import React from 'react';
import { cn } from '../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-3xl p-5 transition-all text-loam-900 border border-oat-100",
          variant === 'default' 
            ? "bg-white shadow-md hover:shadow-lg hover:scale-[1.01] hover:border-matcha-200 active:scale-[0.99]" 
            : "bg-oat-50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

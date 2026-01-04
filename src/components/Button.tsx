import React from 'react';
import { cn } from '../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={loading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95",
          {
            'bg-matcha-500 text-white hover:bg-matcha-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-matcha-400': variant === 'primary',
            'bg-sage-100 text-loam-800 hover:bg-sage-200 border-2 border-transparent': variant === 'secondary',
            'bg-persimmon-50 text-persimmon-600 hover:bg-persimmon-100 border-2 border-transparent': variant === 'danger',
            'bg-transparent text-loam-600 hover:bg-oat-100': variant === 'ghost',
            
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-3 text-base': size === 'md',
            'px-6 py-4 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

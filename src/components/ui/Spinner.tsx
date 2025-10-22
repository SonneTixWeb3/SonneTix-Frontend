import React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
}

/**
 * Modern Loading Spinner
 *
 * @example
 * ```tsx
 * <Spinner size="lg" text="Loading..." />
 * ```
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', text, ...props }, ref) => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    };

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center gap-3', className)}
        {...props}
      >
        <div className={cn('spinner', sizes[size])} />
        {text && <p className="text-sm text-gray-600">{text}</p>}
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
}

/**
 * Full-screen loading overlay
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, text = 'Loading...' }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
      <div className="card p-8">
        <Spinner size="lg" text={text} />
      </div>
    </div>
  );
};

LoadingOverlay.displayName = 'LoadingOverlay';

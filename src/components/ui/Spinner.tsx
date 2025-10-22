import React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
}

/**
 * Cartoon-styled Loading Spinner
 *
 * @example
 * ```tsx
 * <Spinner size="lg" text="Loading..." />
 * ```
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', text, ...props }, ref) => {
    const sizes = {
      sm: 'w-6 h-6 border-2',
      md: 'w-10 h-10 border-3',
      lg: 'w-16 h-16 border-4',
      xl: 'w-24 h-24 border-[6px]',
    };

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center gap-3', className)}
        {...props}
      >
        <div className={cn('spinner-cartoon', sizes[size])} />
        {text && <p className="font-hand text-paper-600">{text}</p>}
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
      <div className="paper-card p-8">
        <Spinner size="lg" text={text} />
      </div>
    </div>
  );
};

LoadingOverlay.displayName = 'LoadingOverlay';

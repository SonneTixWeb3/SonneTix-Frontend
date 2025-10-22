import React from 'react';
import { cn } from '@/lib/utils';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Cartoon-styled Separator/Divider
 *
 * @example
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" className="h-20" />
 * ```
 */
export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'divider-sketch',
          orientation === 'vertical' && 'w-[3px] h-full my-0 mx-6',
          className
        )}
        role="separator"
        aria-orientation={orientation}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';

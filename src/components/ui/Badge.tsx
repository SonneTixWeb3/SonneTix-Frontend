import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}

/**
 * Cartoon-styled Badge Component
 *
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * <Badge variant="danger">Cancelled</Badge>
 * ```
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-paper-200 text-ink',
      success: 'bg-green-100 text-green-800 border-green-800',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-800',
      danger: 'bg-red-100 text-red-800 border-red-800',
      info: 'bg-blue-100 text-blue-800 border-blue-800',
    };

    return (
      <span
        ref={ref}
        className={cn('badge-cartoon', variants[variant], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

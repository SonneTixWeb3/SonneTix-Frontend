import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}

/**
 * Modern Badge Component
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
      default: 'badge-secondary',
      primary: 'badge-primary',
      secondary: 'badge-secondary',
      success: 'badge-success',
      warning: 'badge-warning',
      danger: 'badge-danger',
      info: 'badge-info',
    };

    return (
      <span
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

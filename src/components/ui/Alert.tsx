import React from 'react';
import { cn } from '@/lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  children: React.ReactNode;
}

/**
 * Cartoon-styled Alert Component
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Success!">
 *   Your transaction was completed successfully.
 * </Alert>
 * ```
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', title, children, ...props }, ref) => {
    const variants = {
      default: 'bg-paper-100 border-ink',
      success: 'bg-green-50 border-green-800',
      warning: 'bg-yellow-50 border-yellow-800',
      danger: 'bg-red-50 border-red-800',
      info: 'bg-blue-50 border-blue-800',
    };

    const icons = {
      default: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      danger: '❌',
      info: '💡',
    };

    return (
      <div
        ref={ref}
        className={cn('alert-cartoon', variants[variant], className)}
        role="alert"
        {...props}
      >
        <div className="flex-shrink-0 text-2xl">
          {icons[variant]}
        </div>
        <div className="flex-1">
          {title && (
            <h4 className="font-comic font-bold mb-1">{title}</h4>
          )}
          <div className="font-hand text-sm">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

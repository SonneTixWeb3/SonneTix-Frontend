import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

/**
 * Modern Button Component
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    children,
    ...props
  }, ref) => {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      success: 'btn-success',
      warning: 'btn-warning',
      danger: 'btn-danger',
    };

    const sizes = {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="spinner w-4 h-4"></span>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

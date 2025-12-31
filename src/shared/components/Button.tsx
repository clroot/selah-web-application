'use client';

import { forwardRef } from 'react';

import { cn } from '@/shared/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'w-full rounded-2xl font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          // Size variants
          size === 'sm' && 'px-4 py-2 text-sm',
          size === 'md' && 'px-6 py-4 text-base',
          size === 'lg' && 'px-8 py-5 text-lg',
          // Variant styles
          variant === 'primary' && [
            'bg-deep-brown text-cream',
            'hover:bg-deep-brown/90',
            'focus:ring-deep-brown',
            isDisabled && 'bg-sand text-soft-brown cursor-not-allowed',
          ],
          variant === 'secondary' && [
            'border border-sand bg-transparent text-deep-brown',
            'hover:border-soft-brown hover:bg-cream',
            'focus:ring-sand',
            isDisabled && 'opacity-50 cursor-not-allowed',
          ],
          variant === 'danger' && [
            'bg-red-500 text-white',
            'hover:bg-red-600',
            'focus:ring-red-500',
            isDisabled && 'opacity-50 cursor-not-allowed',
          ],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            로딩 중...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

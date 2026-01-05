import { type ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-2.5 py-1 text-sm': size === 'md',
          'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200': variant === 'default',
          'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200': variant === 'primary',
          'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200': variant === 'success',
          'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200': variant === 'warning',
          'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200': variant === 'danger',
        }
      )}
    >
      {children}
    </span>
  );
}
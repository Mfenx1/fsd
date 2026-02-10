import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';
import { cn } from '$utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'rounded-lg border cursor-pointer font-semibold disabled:opacity-60 disabled:cursor-not-allowed';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white border-0 hover:enabled:bg-blue-700',
  secondary:
    'bg-gray-100 text-gray-900 border-0 hover:enabled:bg-gray-200',
  outline:
    'bg-transparent text-gray-700 border border-gray-300 hover:enabled:bg-gray-50',
  ghost:
    'bg-transparent text-gray-700 border-0 hover:enabled:bg-gray-100',
  danger:
    'bg-red-500 text-white border-0 hover:enabled:bg-red-600',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-3 px-5 text-sm',
  lg: 'py-3 px-4 text-base',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth,
      className,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(base, variantStyles[variant], sizeStyles[size], fullWidth && `
        w-full
      `, className)}
      {...props}
    >
      {children}
    </button>
  )
);

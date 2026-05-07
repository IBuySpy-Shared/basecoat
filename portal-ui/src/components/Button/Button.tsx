import React from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Button Component
 *
 * Accessible button component with multiple variants and sizes.
 * Supports keyboard navigation, focus management, and screen reader support.
 *
 * @example
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="danger" disabled>Delete</Button>
 * <Button fullWidth isLoading>Processing...</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isDisabled = false,
      fullWidth = false,
      icon,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isButtonDisabled = isDisabled || isLoading;

    return (
      <button
        ref={ref}
        className={`${styles.button} ${styles[variant]} ${styles[size]} ${
          fullWidth ? styles.fullWidth : ''
        } ${isButtonDisabled ? styles.disabled : ''} ${className || ''}`}
        disabled={isButtonDisabled}
        aria-busy={isLoading}
        aria-disabled={isButtonDisabled}
        {...props}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.content}>
          {isLoading ? 'Loading...' : children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

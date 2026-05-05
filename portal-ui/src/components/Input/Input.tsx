import React from 'react';
import styles from './Input.module.css';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: InputType;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  isFocused?: boolean;
  icon?: React.ReactNode;
}

/**
 * Input Component
 *
 * Accessible form input with label support, validation states,
 * and helper/error text. Includes WCAG 2.1 AA compliance.
 *
 * @example
 * <Input label="Email" type="email" placeholder="user@example.com" />
 * <Input label="Password" type="password" isInvalid errorMessage="Password is too short" />
 * <Input label="Search" type="search" helperText="Search by name or ID" />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      helperText,
      errorMessage,
      isRequired = false,
      isInvalid = false,
      icon,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className={`${styles.container} ${className || ''}`}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {isRequired && <span className={styles.required}>*</span>}
          </label>
        )}

        <div className={styles.inputWrapper}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`${styles.input} ${isInvalid ? styles.invalid : ''} ${
              icon ? styles.withIcon : ''
            }`}
            aria-invalid={isInvalid}
            aria-required={isRequired}
            aria-describedby={
              errorMessage ? errorId : helperText ? helperId : undefined
            }
            {...props}
          />
        </div>

        {errorMessage && (
          <div id={errorId} className={styles.error} role="alert">
            {errorMessage}
          </div>
        )}

        {helperText && !errorMessage && (
          <div id={helperId} className={styles.helper}>
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input Component', () => {
  it('renders input with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders placeholder text', () => {
    render(<Input placeholder="Enter text..." />);
    expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument();
  });

  it('handles text input', async () => {
    render(<Input />);
    const input = screen.getByRole('textbox');

    await userEvent.type(input, 'test value');
    expect(input).toHaveValue('test value');
  });

  it('displays helper text', () => {
    render(<Input label="Password" helperText="Must be 8+ characters" />);
    expect(screen.getByText('Must be 8+ characters')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(
      <Input
        label="Email"
        isInvalid
        errorMessage="Invalid email address"
      />
    );
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(<Input label="Name" isRequired />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('handles different input types', () => {
    const { rerender } = render(<Input type="email" />);
    let input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.type).toBe('email');

    rerender(<Input type="password" placeholder="Password" />);
    input = screen.getByPlaceholderText('Password') as HTMLInputElement;
    expect(input.type).toBe('password');

    rerender(<Input type="number" placeholder="Number" />);
    input = screen.getByPlaceholderText('Number') as HTMLInputElement;
    expect(input.type).toBe('number');
  });

  it('handles disabled state', () => {
    render(<Input label="Disabled" disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('sets aria-invalid for invalid state', () => {
    render(
      <Input
        label="Email"
        isInvalid
        errorMessage="Invalid email"
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-required for required state', () => {
    render(<Input label="Email" isRequired />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('associates label with input', () => {
    render(<Input label="Email" />);
    const label = screen.getByText(/email/i);
    const input = screen.getByRole('textbox');
    expect(label).toHaveAttribute('for');
    expect(input).toHaveAttribute('id', label.getAttribute('for'));
  });

  it('links error message with aria-describedby', () => {
    render(
      <Input
        label="Email"
        isInvalid
        errorMessage="Invalid format"
      />
    );
    const input = screen.getByRole('textbox');
    const errorId = input.getAttribute('aria-describedby');
    expect(errorId).toBeTruthy();
    expect(screen.getByText('Invalid format')).toHaveAttribute('id', errorId);
  });

  it('supports focus', () => {
    render(<Input label="Focused" />);
    const input = screen.getByRole('textbox');
    input.focus();
    expect(input).toHaveFocus();
  });

  it('calls onChange handler', async () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');

    await userEvent.type(input, 'test');
    expect(handleChange).toHaveBeenCalled();
  });
});

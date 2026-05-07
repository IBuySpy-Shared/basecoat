import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });

    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('renders primary variant by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/primary/);
  });

  it('renders secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/secondary/);
  });

  it('renders danger variant', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/danger/);
  });

  it('renders different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole('button');
    expect(button.className).toMatch(/sm/);

    rerender(<Button size="md">Medium</Button>);
    button = screen.getByRole('button');
    expect(button.className).toMatch(/md/);

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button');
    expect(button.className).toMatch(/lg/);
  });

  it('handles disabled state', () => {
    render(<Button isDisabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows loading state', () => {
    render(<Button isLoading>Save</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with full width', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/fullWidth/);
  });

  it('supports keyboard navigation', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    const button = screen.getByRole('button');

    button.focus();
    expect(button).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders icon when provided', () => {
    render(<Button icon={<span data-testid="icon">★</span>}>Icon Button</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('has correct ARIA attributes', () => {
    render(<Button>Accessible Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'false');
  });
});

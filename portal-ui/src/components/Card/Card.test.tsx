import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
  it('renders children content', () => {
    render(<Card>Test content</Card>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders header when provided', () => {
    render(<Card header="Card Header">Content</Card>);
    expect(screen.getByText('Card Header')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(<Card footer="Card Footer">Content</Card>);
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });

  it('renders with elevation levels', () => {
    const { rerender } = render(<Card elevation="none">None</Card>);
    let card = screen.getByRole('article');
    expect(card.className).toMatch(/none/);

    rerender(<Card elevation="subtle">Subtle</Card>);
    card = screen.getByRole('article');
    expect(card.className).toMatch(/subtle/);

    rerender(<Card elevation="medium">Medium</Card>);
    card = screen.getByRole('article');
    expect(card.className).toMatch(/medium/);

    rerender(<Card elevation="large">Large</Card>);
    card = screen.getByRole('article');
    expect(card.className).toMatch(/large/);
  });

  it('applies interactive styles when interactive prop is true', () => {
    render(<Card interactive>Interactive Card</Card>);
    const card = screen.getByRole('article');
    expect(card.className).toMatch(/interactive/);
  });

  it('has article semantic role', () => {
    render(<Card>Content</Card>);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('supports sub-components (Header, Body, Footer)', () => {
    render(
      <Card>
        <Card.Header>Title</Card.Header>
        <Card.Body>Body content</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    const { container } = render(
      <Card className="custom-class">Content</Card>
    );
    const card = container.querySelector('[role="article"]');
    expect(card).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Card ref={ref}>
        Referenced Card
      </Card>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.textContent).toContain('Referenced Card');
  });
});

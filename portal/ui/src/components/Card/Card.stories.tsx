import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    elevation: {
      control: 'select',
      options: ['none', 'subtle', 'medium', 'large'],
    },
    interactive: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: 'This is a basic card with content.',
  },
};

export const WithHeader: Story = {
  args: {
    header: 'Card Title',
    children: 'This card has a header section.',
  },
};

export const WithFooter: Story = {
  args: {
    header: 'User Information',
    children: 'Email: user@example.com\nPhone: (555) 123-4567',
    footer: 'Last updated: Today',
  },
};

export const WithButtons: Story = {
  args: {
    header: 'Confirmation Dialog',
    children: 'Are you sure you want to proceed?',
    footer: (
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </div>
    ),
  },
};

export const Elevated: Story = {
  args: {
    elevation: 'large',
    header: 'Elevated Card',
    children: 'This card has a large shadow elevation.',
  },
};

export const Interactive: Story = {
  args: {
    interactive: true,
    header: 'Click me!',
    children: 'This card is interactive and responds to clicks.',
    elevation: 'medium',
  },
};

export const Compliance: Story = {
  args: {
    header: '✓ Compliant',
    children:
      'Audit status: PASSED\nLast audit: May 5, 2024\nNext audit: June 5, 2024',
    footer: 'Status: Active',
    elevation: 'medium',
  },
};

export const AllElevations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Card elevation="none">Elevation: None</Card>
      <Card elevation="subtle">Elevation: Subtle</Card>
      <Card elevation="medium">Elevation: Medium</Card>
      <Card elevation="large">Elevation: Large</Card>
    </div>
  ),
} as unknown as Story;

export const ContentShowcase: Story = {
  render: () => (
    <Card
      header="Portal Dashboard"
      elevation="medium"
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button size="sm" variant="secondary">
            View More
          </Button>
        </div>
      }
    >
      <div style={{ lineHeight: '1.6' }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Welcome to Basecoat Portal</h3>
        <p style={{ margin: '0' }}>
          This is a component showcase featuring the accessibility-first Card
          component designed for the Basecoat governance platform.
        </p>
      </div>
    </Card>
  ),
} as unknown as Story;

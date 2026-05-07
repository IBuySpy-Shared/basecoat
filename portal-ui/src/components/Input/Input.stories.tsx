import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search'],
    },
    isInvalid: {
      control: 'boolean',
    },
    isRequired: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
    type: 'text',
  },
};

export const Email: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'user@example.com',
    type: 'email',
    isRequired: true,
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password',
    isRequired: true,
  },
};

export const WithHelper: Story = {
  args: {
    label: 'Username',
    placeholder: 'Choose a unique username',
    helperText: 'Username must be 3-20 characters',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'user@example.com',
    type: 'email',
    isInvalid: true,
    errorMessage: 'Please enter a valid email address',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Account ID',
    placeholder: 'ACC-12345',
    disabled: true,
    value: 'ACC-12345',
  },
};

export const Required: Story = {
  args: {
    label: 'Company Name',
    placeholder: 'Enter company name',
    isRequired: true,
  },
};

export const Number: Story = {
  args: {
    label: 'Quantity',
    placeholder: '0',
    type: 'number',
    min: 0,
    max: 100,
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Input label="Default" placeholder="Type here..." />
      <Input
        label="With Helper"
        placeholder="Type here..."
        helperText="This is a helper message"
      />
      <Input
        label="Invalid"
        placeholder="Type here..."
        isInvalid
        errorMessage="This field is invalid"
      />
      <Input label="Disabled" placeholder="Disabled" disabled />
      <Input label="Required" placeholder="Type here..." isRequired />
    </div>
  ),
} as unknown as Story;

import type { Meta, StoryObj } from '@storybook/react'

import { Input } from './Input'

const meta = {
  title: 'Gumball Club/Base components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const WithTokens: Story = {
  args: {
    value: 0,
    children: 'GC Tokens',
    tokenBalance: '100',
  },
}

export const WithoutTokens: Story = {
  args: {
    value: 0,
    children: 'GC Tokens',
  },
}

export const Disabled: Story = {
  args: {
    value: 0,
    children: 'GC Tokens',
    disabled: true,
    tokenBalance: '100',
  },
}

export const Error: Story = {
  args: {
    value: 200,
    children: 'GC Tokens',
    disabled: false,
    tokenBalance: '100',
    error: 'Not enough GC Tokens in account',
  },
}

export const Hint: Story = {
  args: {
    value: 200,
    children: 'GC Tokens',
    disabled: false,
    hint: 'Includes 50% GC Member Card discount',
  },
}

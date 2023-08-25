import type { Meta, StoryObj } from '@storybook/react'

import { Text } from './Text'

const meta = {
  title: 'Gumball Club/Base components/Text',
  component: Text,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Title: Story = {
  args: {
    children: `Welcome, Matt!`,
    variant: 'title',
  },
}

export const Subtitle: Story = {
  args: {
    children: `Get some Gumball Club Tokens, and use them to buy Gumballs or Candies!`,
    variant: 'subtitle',
  },
}

export const Header: Story = {
  args: {
    children: `Gumball Club Token Dispenser`,
    variant: 'header',
  },
}

export const Paragraph: Story = {
  args: {
    children: `Use GC Tokens to buy bags of candies! How many you get in each bag depends on the market price of sugar.`,
    variant: 'paragraph',
  },
}

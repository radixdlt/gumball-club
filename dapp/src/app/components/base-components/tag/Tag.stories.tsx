import type { Meta, StoryObj } from '@storybook/react'

import { Tag } from './Tag'

const meta = {
  title: 'Gumball Club/Base components/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Blue: Story = {
  args: {
    children: '2 GC = 1 Candy Bag',
    color: 'blue',
  },
}

export const Pink: Story = {
  args: {
    children: 'Market Price: 0.2 GC/candy',
    color: 'pink',
    icon: 'market',
  },
}

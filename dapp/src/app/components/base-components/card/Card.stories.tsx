import type { Meta, StoryObj } from '@storybook/react'

import { Card } from './Card'
import { Text } from '../text'

const meta = {
  title: 'Gumball Club/Base components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: <Text variant="header">Gumball Club Token Dispenser</Text>,
  },
}

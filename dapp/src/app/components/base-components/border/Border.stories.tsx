import type { Meta, StoryObj } from '@storybook/react'

import { Border } from './Border'

const meta = {
  title: 'Gumball Club/Base components/Border',
  component: Border,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Border>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 325 }}>
      <Border {...args} />
    </div>
  ),
}

import type { Meta, StoryObj } from '@storybook/react'

import { Footer } from './Footer'

const meta = {
  title: 'Gumball Club/Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 'calc(100vw - 50px)', padding: 25 }}>
      <Footer {...args} />
    </div>
  ),
}

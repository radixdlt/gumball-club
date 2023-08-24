import type { Meta, StoryObj } from '@storybook/react'

import { Alert } from './Alert'
import { Button } from '../button'

const meta = {
  title: 'Gumball Club/Base components/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  render: (args) => (
    <div style={{ width: 864 }}>
      <Alert {...args} />
    </div>
  ),

  args: {
    variant: 'info',
    title: 'Uh oh!',
    onClose: () => {},
    text: `You don’t have any XRD tokens in any of the accounts you shared. XRD
  tokens are required to pay the transaction fee for all transactions on the
  Radix Network.`,
    button: <Button icon="external-link">Get some XRD</Button>,
  },
}

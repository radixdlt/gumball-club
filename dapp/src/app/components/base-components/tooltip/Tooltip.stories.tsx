import type { Meta, StoryObj } from "@storybook/react"

import { Tooltip } from "./Tooltip"

const meta = {
  title: "Gumball Club/Base components/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: `You have a transaction waiting! Open your 
  Radix Wallet mobile app to review and approve.`,
  },
  render: (args) => (
    <div style={{ width: 417 }}>
      <Tooltip {...args} />
    </div>
  ),
}

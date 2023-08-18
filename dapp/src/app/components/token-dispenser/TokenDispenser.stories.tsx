import type { Meta, StoryObj } from "@storybook/react"

import { TokenDispenser } from "./TokenDispenser"

const meta = {
  title: "Gumball Club/Machines/TokenDispenser",
  component: TokenDispenser,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TokenDispenser>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    hasXrd: true,
    accounts: [
      {
        label: "Main",
        address:
          "account_tdx_21_12x4zx09f8962a9wesfqvxaue0qn6m39r3cpysrjd6dtqppzhrkjrsr",
        appearanceId: 0,
      },
      {
        label: "Saving",
        address:
          "account_tdx_21_12xdjp5dq7haph4c75mst99mc26gkm8mys70v6qlyz0fz86f9ucy0ru",
        appearanceId: 4,
      },
    ],
  },
  render: (args) => (
    <div style={{ width: 1094 }}>
      <TokenDispenser {...args} />
    </div>
  ),
}

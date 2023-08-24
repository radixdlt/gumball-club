import type { Meta, StoryObj } from "@storybook/react"

import { GumballMachine } from "./GumballMachine"

const meta = {
  title: "Gumball Club/Machines/GumballMachine",
  component: GumballMachine,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GumballMachine>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    accounts: [
      {
        label: "Main",
        address:
          "account_tdx_21_12x4zx09f8962a9wesfqvxaue0qn6m39r3cpysrjd6dtqppzhrkjrsr",
        appearanceId: 0,
        fungibleTokens: {},
        nonFungibleTokens: {},
      },
      {
        label: "Saving",
        address:
          "account_tdx_21_12xdjp5dq7haph4c75mst99mc26gkm8mys70v6qlyz0fz86f9ucy0ru",
        appearanceId: 4,
        fungibleTokens: {},
        nonFungibleTokens: {},
      },
    ],
  },
  render: (args) => (
    <div style={{ width: 547 }}>
      <GumballMachine {...args} />
    </div>
  ),
}

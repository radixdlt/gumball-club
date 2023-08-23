import type { Meta, StoryObj } from "@storybook/react"

import { CandyBagMachine } from "./CandyBagMachine"

const meta = {
  title: "Gumball Club/Machines/CandyBagMachine",
  component: CandyBagMachine,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CandyBagMachine>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    price: 2,
    accounts: [
      {
        label: "Main",
        address:
          "account_tdx_21_12x4zx09f8962a9wesfqvxaue0qn6m39r3cpysrjd6dtqppzhrkjrsr",
        appearanceId: 0,
        fungibleTokens: {},
      },
      {
        label: "Saving",
        address:
          "account_tdx_21_12xdjp5dq7haph4c75mst99mc26gkm8mys70v6qlyz0fz86f9ucy0ru",
        appearanceId: 4,
        fungibleTokens: {},
      },
    ],
  },
  render: (args) => (
    <div style={{ width: 547 }}>
      <CandyBagMachine {...args} />
    </div>
  ),
}

import type { Meta, StoryObj } from "@storybook/react"
import { RadixDappToolkit } from "@radixdlt/radix-dapp-toolkit"

import { Header } from "./Header"
import { RadixProvider } from "@/app/radix/RadixProvider"

const rdt = RadixDappToolkit({
  networkId: 34,
  dAppDefinitionAddress:
    "account_tdx_22_12xejltztnaqmzzr8elu4ac7rhkwq30my85gh0ftv0prtmx2zn599l7",
})

const meta = {
  title: "Gumball Club/Layout/Header",
  component: Header,
  parameters: {
    layout: "top",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  render: () => (
    <RadixProvider value={rdt}>
      <div style={{ width: "100vw", padding: 25 }}>
        <Header />
      </div>
    </RadixProvider>
  ),
  args: {},
}

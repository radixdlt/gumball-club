import { Card } from "../../base-components/card"
import { Tag } from "../../base-components/tag"
import Image from "next/image"
import { MachineOptions } from "../components/machine-options/MachineOptions"
import { MachineHeader } from "../components/machine-header/MachineHeader"
import { WalletDataStateAccount } from "@radixdlt/radix-dapp-toolkit"
import { AccountWithFungibleTokens } from "@/app/hooks/useAccounts"
import { config } from "@/app/config"

export const GumballMachine = ({
  accounts,
  onSubmit,
}: {
  accounts: AccountWithFungibleTokens[]
  onSubmit: (value: {
    selectedAccount: string
    inputTokenValue: number
  }) => void
}) => {
  return (
    <Card>
      <MachineHeader
        header="Gumball Machine"
        subtitle="Use GC Tokens to buy Gumballs!"
        tags={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              alignItems: "flex-end",
              alignSelf: "start",
              marginTop: "0.5rem",
            }}
          >
            <Tag color="blue">2 GC = 1 Gumball </Tag>
          </div>
        }
      />
      <MachineOptions
        price={2}
        image={
          <Image
            src="/assets/gumball-machine.png"
            alt="me"
            width="190"
            height="305"
          />
        }
        accounts={accounts}
        inputTokenName="GC Tokens"
        outputTokenName="Gumballs"
        onSubmit={onSubmit}
      ></MachineOptions>
    </Card>
  )
}

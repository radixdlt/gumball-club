import { Card } from "../../base-components/card"
import { Tag } from "../../base-components/tag"
import Image from "next/image"
import { MachineOptions } from "../components/machine-options/MachineOptions"
import { MachineHeader } from "../components/machine-header/MachineHeader"
import { Account } from "@radixdlt/radix-dapp-toolkit"
import { AccountWithFungibleTokens } from "@/app/hooks/useAccounts"

export const CandyBagMachine = ({
  accounts,
  onSubmit,
  price,
}: {
  accounts: AccountWithFungibleTokens[]
  price: number
  onSubmit: (value: {
    selectedAccount: string
    inputTokenValue: number
  }) => void
}) => {
  return (
    <Card>
      <MachineHeader
        header="Candy Bag Machine"
        subtitle="Use GC Tokens to buy bags of candies! How many you get in each bag depends on the market price of sugar."
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
            <Tag color="blue">2 GC = 1 Candy bag </Tag>
            <Tag color="pink" icon="market">
              Market Price: 0.2 GC/candy
            </Tag>
          </div>
        }
      />
      <MachineOptions
        price={price}
        image={
          <Image
            src="/assets/candy-machine.png"
            alt="me"
            width="176"
            height="282"
          />
        }
        accounts={accounts}
        inputTokenName="GC Tokens"
        outputTokenName="Candy Bags"
        onSubmit={onSubmit}
      ></MachineOptions>
    </Card>
  )
}

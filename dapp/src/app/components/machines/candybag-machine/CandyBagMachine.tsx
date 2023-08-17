import { Card } from "../../base-components/card"
import { Tag } from "../../base-components/tag"
import Image from "next/image"
import { Account } from "@/app/types"
import { MachineOptions } from "../components/machine-options/MachineOptions"
import { MachineHeader } from "../components/machine-header/MachineHeader"

export const CandyBagMachine = ({
  accounts,
  onSubmit,
  price,
}: {
  accounts: Account[]
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
            width="185"
            height="274"
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

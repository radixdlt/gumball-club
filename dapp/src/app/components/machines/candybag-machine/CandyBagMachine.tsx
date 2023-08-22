import { Card } from "../../base-components/card"
import { Tag } from "../../base-components/tag"
import Image from "next/image"
import { MachineOptions } from "../components/machine-options/MachineOptions"
import { MachineHeader } from "../components/machine-header/MachineHeader"
import { AccountWithFungibleTokens } from "@/app/hooks/useAccounts"
import { useSugarMarketPrice } from "./useSugarMarketPrice"
import { useEffect, useState } from "react"

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
    outputTokenValue: number
  }) => void
}) => {
  const getPrice = useSugarMarketPrice()
  const [candyPrice, setState] = useState(0)

  useEffect(() => {
    let timeoutRef: any

    const handleGetPrice = () => {
      timeoutRef = setTimeout(async () => {
        try {
          setState(await getPrice())
          handleGetPrice()
        } catch (error) {
          handleGetPrice()
        }
      }, 10_000)
    }

    getPrice().then(setState)
    handleGetPrice()

    return () => {
      if (timeoutRef) clearTimeout(timeoutRef)
    }
  }, [setState, getPrice])

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
            {/* <Tag color="blue">2 GC = 1 Candy bag </Tag> */}
            <Tag color="pink" icon="market">
              Market Price: {candyPrice} GC/candy
            </Tag>
          </div>
        }
      />
      <MachineOptions
        price={candyPrice}
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
        outputTokenName="Candy"
        onSubmit={onSubmit}
      ></MachineOptions>
    </Card>
  )
}

import { Card } from "../../base-components/card"
import { Tag } from "../../base-components/tag"
import Image from "next/image"
import { MachineOptions } from "../components/machine-options/MachineOptions"
import { MachineHeader } from "../components/machine-header/MachineHeader"
import styles from "./MembershipMachine.module.css"
import { AccountWithFungibleTokens } from "@/app/hooks/useAccounts"

export const MembershipMachine = ({
  accounts,
  onSubmit,
}: {
  accounts: AccountWithFungibleTokens[]
  onSubmit: (value: {
    selectedAccount: string
    inputTokenValue: number
    outputTokenValue: number
  }) => void
}) => {
  return (
    <Card>
      <MachineHeader
        header="GC Member Card Machine"
        subtitle="Purchase a member card to automatically get a 50% discount on the sweet machines!"
        tags={<Tag color="blue">5 GC = 1 Member Card</Tag>}
        textClass={styles.text}
      />
      <MachineOptions
        price={5}
        defaultInputTokenValue={5}
        disabled
        image={
          <Image
            src="/assets/membership-machine.png"
            alt="me"
            width="172"
            height="308"
          />
        }
        accounts={accounts}
        inputTokenName="GC Tokens"
        outputTokenName="Member Card"
        onSubmit={onSubmit}
      ></MachineOptions>
    </Card>
  )
}

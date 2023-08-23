import { AccountWithFungibleTokens } from "@/app/hooks/useAccounts"
import { GumballMachineModal } from "../../machines/gumball-machine/GumballMachineModal"
import { MembershipMachineModal } from "../../machines/membership-machine/MembershipMachineModal"
import { TokenDispenserModal } from "../../token-dispenser/TokenDispenserModal"
import { CandyMachineModal } from "../../machines/candybag-machine/CandyMachineModal"

export const HomeModule = ({
  show,
  account,
  outputTokenValue,
  onDismiss,
}: {
  show?: "tokenDispenser" | "gumball" | "candy" | "member"
  account?: AccountWithFungibleTokens
  outputTokenValue?: number
  onDismiss: () => void
}) => {
  return (
    <>
      <TokenDispenserModal
        show={show === "tokenDispenser"}
        account={account}
        onDismiss={onDismiss}
      />

      <GumballMachineModal
        show={show === "gumball"}
        outputTokenValue={outputTokenValue}
        account={account}
        onDismiss={onDismiss}
      />

      <CandyMachineModal
        show={show === "candy"}
        outputTokenValue={outputTokenValue}
        onDismiss={onDismiss}
        account={account}
      />

      <MembershipMachineModal
        show={show === "member"}
        account={account}
        outputTokenValue={outputTokenValue}
        onDismiss={onDismiss}
      />
    </>
  )
}

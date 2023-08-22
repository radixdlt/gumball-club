import { AccountWithFungibleTokens } from "@/app/hooks/useAccounts"
import { Button } from "../../base-components/button"
import { Modal } from "../../base-components/modal/Modal"
import { Text } from "../../base-components/text/Text"
import Image from "next/image"

export const GumballMachineModal = ({
  onDismiss,
  show,
  account,
  outputTokenValue,
}: {
  show?: boolean
  account?: AccountWithFungibleTokens
  outputTokenValue?: number
  onDismiss: () => void
}) => (
  <Modal show={!!show}>
    <>
      <Image
        width="146"
        height="146"
        alt="gc token icon"
        src="/assets/gumball-token.png"
        className="mb-1"
      />
      <Text variant="modal-header" className="mb-1">
        You Bought {outputTokenValue} Gumballs!
      </Text>
      <Text variant="modal-text" className="mb-1">
        No need to take our word for it - you can take a look yourself in “
        {account?.label}” in your Radix Wallet to see them.
      </Text>

      <Button onClick={onDismiss}>Okay</Button>
    </>
  </Modal>
)

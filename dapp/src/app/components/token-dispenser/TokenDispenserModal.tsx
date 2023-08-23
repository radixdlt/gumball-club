import { AccountWithTokens } from "@/app/hooks/useAccounts"
import { Button } from "../base-components/button"
import { Modal } from "../base-components/modal/Modal"
import { Text } from "../base-components/text/Text"
import Image from "next/image"

export const TokenDispenserModal = ({
  onDismiss,
  show,
  account,
}: {
  show?: boolean
  account?: AccountWithTokens
  onDismiss: () => void
}) => (
  <Modal show={!!show}>
    <>
      <Image
        width="200"
        height="200"
        alt="gc token icon"
        src="/assets/gc-token.png"
        className="mb-1"
      />
      <Text variant="modal-header" className="mb-1">
        You Received 20 Gumball Club Tokens!
      </Text>
      <Text variant="modal-text" className="mb-1">
        No need to take our word for it - you can take a look yourself in “
        {account?.label}” in your Radix Wallet to see them.
      </Text>
      <Text variant="modal-text" className="mb-1">
        Now use GC Tokens to buy Gumballs or Candies!
      </Text>
      <Button onClick={onDismiss}>Okay</Button>
    </>
  </Modal>
)

import { AccountWithFungibleTokens } from "@/app/hooks/useAccounts"
import { Button } from "../../base-components/button"
import { Modal } from "../../base-components/modal/Modal"
import { Text } from "../../base-components/text/Text"
import Image from "next/image"

export const MembershipMachineModal = ({
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
        width="256"
        height="256"
        alt="candy bag"
        src="/assets/member-card.png"
        className="mb-1"
      />
      <Text variant="modal-header" className="mb-1">
        You bought a GC Member Card!
      </Text>
      <Text variant="modal-text" className="mb-1">
        This gives you a 50% discount when making a purchase at the Gumball and
        Candy machines.
      </Text>
      <Text variant="modal-text" className="mb-1">
        The GC Member Card is an NFT - take a look in your Radix Wallet in the
        NFT section of “{account?.label}”.
      </Text>

      <Button onClick={onDismiss}>Okay</Button>
    </>
  </Modal>
)

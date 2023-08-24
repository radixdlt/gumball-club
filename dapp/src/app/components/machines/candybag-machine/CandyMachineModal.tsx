import { AccountWithTokens } from '@/app/hooks/useAccounts'
import { Button } from '../../base-components/button'
import { Modal } from '../../base-components/modal/Modal'
import { Text } from '../../base-components/text/Text'
import Image from 'next/image'

export const CandyMachineModal = ({
  onDismiss,
  show,
  account,
  outputTokenValue,
}: {
  show?: boolean
  account?: AccountWithTokens
  outputTokenValue?: number
  onDismiss: () => void
}) => (
  <Modal show={!!show}>
    <>
      <Image
        width="256"
        height="256"
        alt="candy bag"
        src="/assets/candy-bag.png"
        className="mb-1"
      />
      <Text variant="modal-header" className="mb-1">
        You Bought {outputTokenValue} Candy!
      </Text>
      <Text variant="modal-text" className="mb-1">
        No need to take our word for it - you can take a look yourself in “
        {account?.label}” in your Radix Wallet to see them.
      </Text>

      <Button onClick={onDismiss}>Okay</Button>
    </>
  </Modal>
)

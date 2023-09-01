import { AccountWithTokens } from '@/app/hooks/useAccounts'
import { Button } from '../../base-components/button'
import { Modal } from '../../base-components/modal/Modal'
import { Text } from '../../base-components/text/Text'
import Image from 'next/image'
import MemberCard from '@/../public/assets/member-card.png'

export const MembershipMachineRevealModal = ({
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
        src={MemberCard}
        className="mb-1"
      />
      <Text variant="modal-header" className="mb-1">
        Member Card Machine Unlocked!
      </Text>
      <Text variant="modal-text" className="mb-1">
        {`Looks like you're a fan of sweets!`}
      </Text>
      <Text variant="modal-text" className="mb-1">
        {`Well, if you'd like a better deal, head over to the Member Card Machine
        where you can use your GC Tokens to buy a discount card that you can
        present for cheaper Gumballs and Candies!`}
      </Text>

      <Button onClick={onDismiss}>Okay</Button>
    </>
  </Modal>
)

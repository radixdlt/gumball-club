import { Alert } from '../base-components/alert/Alert'
import { Button } from '../base-components/button'
import styles from './Header.module.css'

export const InsufficientXrdAlert = ({
  onClose,
  onGetXrd,
  show,
}: {
  onClose: () => void
  onGetXrd: () => void
  show?: boolean
}) => {
  if (!show) return null
  return (
    <Alert
      className={styles.alert}
      variant="info"
      title="Uh oh!"
      text={
        <>
          <span>
            Gumball club requires about 5 XRD to use each machine once. To find
            out where to purchase XRD,
          </span>{' '}
          <a
            target="_blank"
            href="https://www.radixdlt.com/token"
            style={{ textDecoration: 'underline', fontWeight: 'bold' }}
          >
            see here
          </a>
          .{' '}
          <span>
            To celebrate the Radix Babylon Upgrade, you can claim 5 XRD to try
            the network by following the steps here while until the promotion
            ends.
          </span>
        </>
      }
      onClose={onClose}
      button={
        <Button icon="external-link" onClick={onGetXrd}>
          Get some XRD
        </Button>
      }
    />
  )
}

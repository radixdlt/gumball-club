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
      text="You don’t have any XRD tokens in any of the accounts you shared. XRD tokens are required to pay the transaction fee for all transactions on the Radix Network."
      onClose={onClose}
      button={
        <Button icon="external-link" onClick={onGetXrd}>
          Get some XRD
        </Button>
      }
    />
  )
}

import { Persona, PersonaDataName } from '@radixdlt/radix-dapp-toolkit'
import { Text } from '../text'
import styles from './Hero.module.css'

export const Hero = ({
  personaDataName,
  persona,
}: {
  personaDataName?: PersonaDataName
  persona?: Persona
}) => {
  const { nickname, givenNames, familyName } = personaDataName || {}
  const alias = nickname || givenNames || familyName || persona?.label
  return (
    <div className={styles.hero}>
      <Text variant="title">
        {alias ? `Welcome, ${alias}!` : 'Welcome to the Gumball Club'}
      </Text>
      <Text variant="subtitle">
        {alias
          ? 'A toy Web3 dApp on the Radix Network where the transactions with the Radix Wallet are real, but the tokens have no value'
          : 'A playground to experience Web3 using the Radix Wallet'}
      </Text>
    </div>
  )
}

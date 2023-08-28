import { useEffect, useState } from 'react'
import { useDappToolkit } from './useDappToolkit'
import { PersonaDataName } from '@radixdlt/radix-dapp-toolkit'

export const usePersonaData = () => {
  const dAppToolkit = useDappToolkit()

  const [state, setState] = useState<{
    fullName?: PersonaDataName
    emailAddresses?: string[]
    phoneNumbers?: string[]
  }>({})

  useEffect(() => {
    const subscription = dAppToolkit.walletApi.walletData$.subscribe(
      (walletData) => {
        const entires = walletData.personaData.reduce<{
          fullName?: PersonaDataName
          emailAddresses?: string[]
          phoneNumbers?: string[]
        }>((acc, item) => ({ ...acc, [item.entry]: item.fields }), {})

        setState(entires)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [dAppToolkit, setState])

  return state
}

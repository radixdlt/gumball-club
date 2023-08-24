import { useEffect, useState } from 'react'
import { useDappToolkit } from './useDappToolkit'
import { Persona } from '@radixdlt/radix-dapp-toolkit'

export const usePersona = () => {
  const dAppToolkit = useDappToolkit()
  const [state, setState] = useState<{
    persona?: Persona
    hasLoaded: boolean
  }>({ hasLoaded: false })

  useEffect(() => {
    const subscription = dAppToolkit.walletApi.walletData$.subscribe(
      (state) => {
        setState({ persona: state.persona, hasLoaded: true })
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [dAppToolkit])

  return state
}

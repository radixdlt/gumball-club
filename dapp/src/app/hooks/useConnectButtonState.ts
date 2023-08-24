import { useEffect, useState } from 'react'
import { useDappToolkit } from './useDappToolkit'

export const useConnectButtonState = () => {
  const dAppToolkit = useDappToolkit()
  const [state, setState] = useState<
    'pending' | 'success' | 'error' | 'default'
  >('default')

  useEffect(() => {
    const subscription = dAppToolkit.buttonApi.status$.subscribe((state) => {
      setState(state)
    })

    return () => {
      subscription.unsubscribe()
    }
  })

  return state
}

import { useCallback } from 'react'
import { useDappToolkit } from './useDappToolkit'

export const useSendTransaction = () => {
  const dAppToolkit = useDappToolkit()

  const sendTransaction = (transactionManifest: string) =>
    dAppToolkit.walletApi.sendTransaction({
      transactionManifest,
      version: 1,
    })

  return useCallback(sendTransaction, [dAppToolkit])
}

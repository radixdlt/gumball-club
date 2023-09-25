import { useCallback } from 'react'
import { useDappToolkit } from './useDappToolkit'

export const useSendTransaction = () => {
  const dAppToolkit = useDappToolkit()

  const sendTransaction = (transactionManifest: string, message?: string) =>
    dAppToolkit.walletApi.sendTransaction({
      transactionManifest,
      version: 1,
      message,
    })

  return useCallback(sendTransaction, [dAppToolkit])
}

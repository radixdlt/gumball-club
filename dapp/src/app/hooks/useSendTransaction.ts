import { useCallback } from "react"
import { useDappToolkit } from "./useDappToolkit"

export const useSendTransaction = () => {
  const dAppToolkit = useDappToolkit()

  return useCallback(
    (transactionManifest: string) =>
      dAppToolkit.walletApi.sendTransaction({
        transactionManifest,
        version: 1,
      }),
    [dAppToolkit]
  )
}

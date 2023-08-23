import { useCallback } from "react"
import { TransactionManifests } from "../radix/transaction-manifests"
import { config } from "../config"
import { useSendTransaction } from "./useSendTransaction copy"

export const useSendTransactionManifest = () => {
  const transactionManifests = TransactionManifests(config.addresses)
  const sendTransaction = useSendTransaction()

  return useCallback(
    () => ({
      dispenseGcTokens: (accountAddress: string) =>
        sendTransaction(transactionManifests.dispenseGcTokens(accountAddress)),
      buyGumball: (accountAddress: string, gcTokenValue: number) =>
        sendTransaction(
          transactionManifests.buyGumball(accountAddress, gcTokenValue)
        ),
      buyCandy: (accountAddress: string, gcTokenValue: number) =>
        sendTransaction(
          transactionManifests.buyCandy(accountAddress, gcTokenValue)
        ),
    }),
    [sendTransaction, transactionManifests]
  )
}

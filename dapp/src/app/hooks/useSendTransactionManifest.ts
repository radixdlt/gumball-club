import { useCallback } from 'react'
import { TransactionManifests } from '../radix/transaction-manifests'
import { config } from '../config'
import { useSendTransaction } from './useSendTransaction'
import { NonFungibleResource } from '../transformers/addTokens'

export const useSendTransactionManifest = () => {
  const transactionManifests = TransactionManifests(config.addresses)
  const sendTransaction = useSendTransaction()

  return useCallback(
    () => ({
      dispenseGcTokens: (accountAddress: string) =>
        sendTransaction(transactionManifests.dispenseGcTokens(accountAddress)),
      buyGumball: (input: {
        accountAddress: string
        memberCard?: NonFungibleResource
        inputTokenValue: number
        outputTokenValue: number
      }) => sendTransaction(transactionManifests.buyGumball(input)),
      buyCandy: (input: {
        accountAddress: string
        memberCard?: NonFungibleResource
        inputTokenValue: number
      }) => sendTransaction(transactionManifests.buyCandy(input)),

      buyMemberCard: (input: {
        accountAddress: string
        inputTokenValue: number
      }) => sendTransaction(transactionManifests.buyMemberCard(input)),
    }),
    [sendTransaction, transactionManifests]
  )
}

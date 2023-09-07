import { useCallback } from 'react'
import { TransactionManifests } from '../radix/transaction-manifests'
import { config } from '../config'
import { useSendTransaction } from './useSendTransaction'
import { NonFungibleResource } from '../transformers/addTokens'
import { useGetCommittedDetails } from './useGetCommittedDetails'

export const useSendTransactionManifest = () => {
  const transactionManifests = TransactionManifests(config.addresses)
  const sendTransaction = useSendTransaction()
  const getCommittedDetails = useGetCommittedDetails()

  return useCallback(
    () => ({
      dispenseGcTokens: (accountAddress: string) =>
        sendTransaction(transactionManifests.dispenseGcTokens(accountAddress)),
      buyGumball: (input: {
        accountAddress: string
        memberCard?: NonFungibleResource
        inputTokenValue: number
        outputTokenValue: number
        change?: number
      }) => sendTransaction(transactionManifests.buyGumball(input)),
      buyCandy: (input: {
        accountAddress: string
        memberCard?: NonFungibleResource
        inputTokenValue: number
      }) =>
        sendTransaction(transactionManifests.buyCandy(input)).andThen(
          ({ transactionIntentHash }) =>
            getCommittedDetails(transactionIntentHash)
        ),

      buyMemberCard: (input: {
        accountAddress: string
        inputTokenValue: number
      }) => sendTransaction(transactionManifests.buyMemberCard(input)),
    }),
    [sendTransaction, getCommittedDetails, transactionManifests]
  )
}

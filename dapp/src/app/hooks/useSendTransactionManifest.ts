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
        sendTransaction(
          transactionManifests.dispenseGcTokens(accountAddress),
          'Have some GC tokens on the house!'
        ),
      buyGumball: (input: {
        accountAddress: string
        memberCard?: NonFungibleResource
        inputTokenValue: number
        outputTokenValue: number
        change?: number
      }) =>
        sendTransaction(
          transactionManifests.buyGumball(input),
          input.memberCard ? '50% member discount applied!' : undefined
        ),
      buyCandy: (input: {
        accountAddress: string
        memberCard?: NonFungibleResource
        inputTokenValue: number
      }) =>
        sendTransaction(
          transactionManifests.buyCandy(input),
          input.memberCard ? '50% member discount applied!' : undefined
        ).andThen(({ transactionIntentHash }) =>
          getCommittedDetails(transactionIntentHash)
        ),

      buyMemberCard: (input: {
        accountAddress: string
        inputTokenValue: number
      }) =>
        sendTransaction(
          transactionManifests.buyMemberCard(input),
          'Welcome to Gumball Club membership! Future GC purchases will automatically “present” this badge to access a 50% discount!'
        ),
    }),
    [sendTransaction, getCommittedDetails, transactionManifests]
  )
}

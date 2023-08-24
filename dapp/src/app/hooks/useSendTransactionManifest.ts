import { useCallback } from 'react'
import { TransactionManifests } from '../radix/transaction-manifests'
import { config } from '../config'
import { useSendTransaction } from './useSendTransaction copy'
import { NonFungibleResource } from '../transformers/addTokens'

export const useSendTransactionManifest = () => {
  const transactionManifests = TransactionManifests(config.addresses)
  const sendTransaction = useSendTransaction()

  return useCallback(
    () => ({
      dispenseGcTokens: (accountAddress: string) =>
        sendTransaction(transactionManifests.dispenseGcTokens(accountAddress)),
      buyGumball: (
        accountAddress: string,
        gcTokenValue: number,
        memberCard?: NonFungibleResource,
      ) =>
        sendTransaction(
          transactionManifests.buyGumball(
            accountAddress,
            gcTokenValue,
            memberCard,
          ),
        ),
      buyCandy: (
        accountAddress: string,
        gcTokenValue: number,
        memberCard?: NonFungibleResource,
      ) =>
        sendTransaction(
          transactionManifests.buyCandy(
            accountAddress,
            gcTokenValue,
            memberCard,
          ),
        ),

      buyMemberCard: (accountAddress: string, gcTokenValue: number) =>
        sendTransaction(
          transactionManifests.buyMemberCard(accountAddress, gcTokenValue),
        ),
    }),
    [sendTransaction, transactionManifests],
  )
}

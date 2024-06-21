import { useCallback } from 'react'
import { useDappToolkit } from './useDappToolkit'
import { ResultAsync } from 'neverthrow'
import { useGateway } from './useGateway'

export const useGetCommittedDetails = () => {
  const gateway = useGateway()

  const getCommittedDetails = (txId: string) =>
    ResultAsync.fromPromise(
      gateway.transaction.getCommittedDetails(txId).then((res) => ({
        epoch: res.transaction.epoch,
        round: res.transaction.round,
        status: res.transaction.transaction_status,
        date: res.transaction.confirmed_at,
        fee: res.transaction.fee_paid,
        message: (res.transaction.message as any)?.content?.value,
        encodedManifest: res.transaction.raw_hex,
        receipt: res.transaction.receipt,
        events: res.transaction.receipt?.events as {
          name: 'DepositEvent'
          data: {
            fields: (
              | {
                  kind: 'Reference'
                  type_name: 'ResourceAddress'
                  value: string
                }
              | { kind: 'Decimal'; type_name: ''; value: string }
            )[]
          }
        }[],
        affectedEntities: res.transaction.affected_global_entities || [],
        createdEntities:
          ((res.transaction.receipt?.state_updates as any)
            ?.new_global_entities as any[]) || [],
        stateVersion: res.transaction.state_version,
      })),
      (error: any): Error => error
    )

  return useCallback(getCommittedDetails, [gateway])
}

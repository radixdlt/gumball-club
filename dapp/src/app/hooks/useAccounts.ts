import { useCallback, useEffect, useState } from 'react'
import { useDappToolkit } from './useDappToolkit'
import { Account } from '@radixdlt/radix-dapp-toolkit'
import { switchMap, map } from 'rxjs'
import {
  FungibleResource,
  NonFungibleResource,
  transformFungibleTokens,
  transformNonFungibleTokens,
} from '../transformers/addTokens'
import { useGateway } from './useGateway'
import { State } from '@radixdlt/babylon-gateway-api-sdk'

export type AccountWithTokens = Account &
  Account & { fungibleTokens: Record<string, FungibleResource> } & {
    nonFungibleTokens: Record<string, NonFungibleResource[]>
  }

const useWithTokens = (stateApi: State) => {
  return useCallback(
    (accounts: Account[]) =>
      stateApi
        .getEntityDetailsVaultAggregated(
          accounts.map((account) => account.address)
        )
        .then((data) =>
          Promise.all(
            data.map((item) =>
              transformFungibleTokens(item?.fungible_resources)
                .then((fungibleTokens) => ({
                  ...accounts.find(
                    (account) => account.address === item.address
                  )!,
                  fungibleTokens,
                }))
                .then((values) =>
                  transformNonFungibleTokens(item?.non_fungible_resources).then(
                    (nonFungibleTokens) => ({
                      ...values,
                      nonFungibleTokens,
                    })
                  )
                )
            )
          )
        ),
    [stateApi]
  )
}

export const useAccounts = () => {
  const dAppToolkit = useDappToolkit()
  const gateway = useGateway()
  const [state, setState] = useState<{
    accounts: AccountWithTokens[]
    status: 'pending' | 'success' | 'error'
    hasLoaded: boolean
  }>({ accounts: [], status: 'pending', hasLoaded: false })

  const withTokens = useWithTokens(gateway.state)

  useEffect(() => {
    const subscription = dAppToolkit.walletApi.walletData$
      .pipe(
        map((walletData) => walletData.accounts),
        switchMap((accounts) => {
          setState((prev) => ({ ...prev, status: 'pending' }))
          return withTokens(accounts)
            .then((accounts: any[]) => {
              setState({
                accounts,
                status: 'success',
                hasLoaded: true,
              })
            })
            .catch(() => {
              setState({ accounts: [], status: 'error', hasLoaded: true })
            })
        })
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [dAppToolkit, withTokens, setState])

  return {
    state,
    refresh: useCallback(() => {
      setState((prev) => ({ ...prev, status: 'pending' }))
      return withTokens(state.accounts)
        .then((accounts: any) => {
          setState({ accounts, status: 'success', hasLoaded: true })
        })
        .catch(() => {
          setState({ accounts: [], status: 'error', hasLoaded: true })
        })
    }, [state.accounts, withTokens]),
  }
}

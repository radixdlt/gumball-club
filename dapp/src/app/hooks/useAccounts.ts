import { useCallback, useEffect, useState } from 'react'
import { useDappToolkit } from './useDappToolkit'
import { Account, State } from '@radixdlt/radix-dapp-toolkit'
import { switchMap, map } from 'rxjs'
import {
  FungibleResource,
  NonFungibleResource,
  transformFungibleTokens,
  transformNonFungibleTokens,
} from '../transformers/addTokens'

export type AccountWithTokens = Account &
  Account & { fungibleTokens: Record<string, FungibleResource> } & {
    nonFungibleTokens: Record<string, NonFungibleResource[]>
  }

const useWithTokens = (stateApi: State) => {
  return useCallback(
    (accounts: Account[]) =>
      stateApi
        .getEntityDetailsVaultAggregated(
          accounts.map((account) => account.address),
        )
        .then((data) =>
          Promise.all(
            data.map((item, index) =>
              transformFungibleTokens(item.fungible_resources, stateApi)
                .then((fungibleTokens) => ({
                  ...accounts[index],
                  fungibleTokens,
                }))
                .then((values) =>
                  transformNonFungibleTokens(
                    item.non_fungible_resources,
                    accounts[index].address,
                    stateApi,
                  ).then((nonFungibleTokens) => ({
                    ...values,
                    nonFungibleTokens,
                  })),
                ),
            ),
          ),
        ),
    [stateApi],
  )
}

export const useAccounts = () => {
  const dAppToolkit = useDappToolkit()
  const [state, setState] = useState<{
    accounts: AccountWithTokens[]
    status: 'pending' | 'success' | 'error'
    hasLoaded: boolean
  }>({ accounts: [], status: 'pending', hasLoaded: false })

  const withTokens = useWithTokens(dAppToolkit.gatewayApi.state)

  useEffect(() => {
    const subscription = dAppToolkit.walletApi.walletData$
      .pipe(
        map((walletData) => walletData.accounts),
        switchMap((accounts) => {
          setState((prev) => ({ ...prev, status: 'pending' }))
          return withTokens(accounts)
            .then((accounts: any) => {
              setState({ accounts, status: 'success', hasLoaded: true })
            })
            .catch(() => {
              setState({ accounts: [], status: 'error', hasLoaded: true })
            })
        }),
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [dAppToolkit, withTokens])

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

import { useCallback, useEffect, useState } from "react"
import { useDappToolkit } from "./useDappToolkit"
import { Account } from "@radixdlt/radix-dapp-toolkit"
import { switchMap, map } from "rxjs"
import {
  FungibleResource,
  transformFungibleTokens,
} from "../transformers/transformFungibleTokens"

export type AccountWithFungibleTokens = Account &
  Account & { fungibleTokens: Record<string, FungibleResource> }

export const useAccounts = () => {
  const dAppToolkit = useDappToolkit()
  const [state, setState] = useState<{
    accounts: AccountWithFungibleTokens[]
    status: "pending" | "success" | "error"
    hasLoaded: boolean
  }>({ accounts: [], status: "pending", hasLoaded: false })

  const includeFungibleTokens = (accounts: Account[]) => {
    setState((prev) => ({ ...prev, accounts: [], status: "pending" }))
    return (
      dAppToolkit.gatewayApi.state
        .getEntityDetailsVaultAggregated(
          accounts.map((account) => account.address)
        )
        // TODO: remove any when gateway api types are exported correctly
        .then((data: any[]) =>
          Promise.all(
            data.map((item, index) =>
              transformFungibleTokens(
                item.fungible_resources,
                dAppToolkit.gatewayApi.state
              ).then((fungibleTokens) => ({
                ...accounts[index],
                fungibleTokens,
              }))
            )
          )
        )
        .then((accounts: any) => {
          setState({ accounts, status: "success", hasLoaded: true })
        })
        .catch(() => {
          setState({ accounts: [], status: "error", hasLoaded: true })
        })
    )
  }

  useEffect(() => {
    const subscription = dAppToolkit.walletApi.walletData$
      .pipe(
        map((walletData) => walletData.accounts),
        switchMap(includeFungibleTokens)
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    state,
    refresh: useCallback(
      () => includeFungibleTokens(state.accounts),
      [state.accounts]
    ),
  }
}

import { FungibleResourcesVaultCollection } from '@radixdlt/babylon-gateway-api-sdk'
import { NonFungibleResourcesVaultCollection } from '@radixdlt/radix-dapp-toolkit'
import { BigNumber } from 'bignumber.js'

export type FungibleResource = {
  type: 'fungible'
  value: string
  address: string
}

export const transformFungibleTokens = async (
  fungibles: FungibleResourcesVaultCollection
): Promise<Record<string, FungibleResource>> => {
  if (fungibles.items.length === 0) {
    return {}
  }

  return fungibles.items.reduce<Record<string, FungibleResource>>(
    (acc, item) => {
      return {
        ...acc,
        [item.resource_address]: {
          type: 'fungible',
          address: item.resource_address,
          value:
            item.vaults?.items
              .reduce((prev, next) => prev.plus(next.amount), new BigNumber(0))
              .toString() || '0',
        },
      }
    },
    {}
  )
}

export type NonFungibleResource = {
  type: 'non-fungible'
  id: string
  address: string
}

export const transformNonFungibleTokens = async (
  nonFungibles: NonFungibleResourcesVaultCollection
) => {
  if (nonFungibles.items.length === 0) {
    return []
  }

  const transformedNonFungibles: NonFungibleResource[] = []

  for (const nonFungible of nonFungibles.items) {
    for (const singleNftData of nonFungible.vaults.items) {
      for (const id of singleNftData.items || []) {
        transformedNonFungibles.push({
          type: 'non-fungible',
          id: id,
          address: nonFungible.resource_address,
        })
      }
    }
  }

  return transformedNonFungibles.reduce<Record<string, NonFungibleResource[]>>(
    (acc, curr) => {
      const resourceManager = acc[curr.address] || []
      resourceManager.push(curr)
      return { ...acc, [curr.address]: resourceManager }
    },
    {}
  )
}

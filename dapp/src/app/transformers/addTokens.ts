import {
  EntityMetadataCollection,
  FungibleResourcesVaultCollection,
  State,
  StateEntityDetailsResponseFungibleResourceDetails,
} from '@radixdlt/babylon-gateway-api-sdk'
import {
  NonFungibleResourcesCollectionItemVaultAggregated,
  NonFungibleResourcesVaultCollection,
  StateNonFungibleDetailsResponseItem,
} from '@radixdlt/radix-dapp-toolkit'
import { BigNumber } from 'bignumber.js'

export type FungibleResource = {
  type: 'fungible'
  address: string
  name?: string
  symbol?: string
  iconUrl?: string
  description?: string
  tags?: string[]
  totalSupply: string
  explicitMetadata?: EntityMetadataCollection
  value: string
}

const getStringMetadata =
  (key: string) => (metadata?: EntityMetadataCollection) =>
    (metadata?.items.find((item) => item.key === key)?.value?.typed as any)
      ?.value || ''

export const transformFungibleTokens = async (
  fungibles: FungibleResourcesVaultCollection,
  stateApi: State,
): Promise<Record<string, FungibleResource>> => {
  if (fungibles.items.length === 0) {
    return {}
  }

  const fungibleEntities = await stateApi.getEntityDetailsVaultAggregated(
    fungibles.items.map(({ resource_address }) => resource_address),
  )

  return fungibleEntities.reduce<Record<string, FungibleResource>>(
    (acc, entity) => {
      const vaults = fungibles.items.find(
        ({ resource_address }) => resource_address === entity.address,
      )?.vaults

      return {
        ...acc,
        [entity.address]: {
          type: 'fungible',
          value:
            vaults?.items
              .reduce((prev, next) => prev.plus(next.amount), new BigNumber(0))
              .toString() || '0',
          address: entity.address,
          name: getStringMetadata('name')(entity.metadata),
          symbol: getStringMetadata('symbol')(entity.metadata),
          iconUrl: getStringMetadata('icon_url')(entity.metadata),
          description: getStringMetadata('description')(entity.metadata),
          totalSupply: (
            entity.details as StateEntityDetailsResponseFungibleResourceDetails
          ).total_supply,
          explicitMetadata: entity.explicit_metadata,
        },
      }
    },
    {},
  )
}

export type NonFungibleResource = {
  type: 'non-fungible'
  id: string
  address: string
  name?: string
  symbol?: string
  iconUrl?: string
  description?: string
  tags?: string[]
  totalSupply: string
  explicitMetadata?: EntityMetadataCollection
}

export const transformNonFungibleTokens = async (
  nonFungibles: NonFungibleResourcesVaultCollection,
  accountAddress: string,
  stateApi: State,
) => {
  if (nonFungibles.items.length === 0) {
    return []
  }

  const transformedNonFungibles: NonFungibleResource[] = []

  const nonFungibleEntities = await stateApi.getEntityDetailsVaultAggregated(
    nonFungibles.items.map(({ resource_address }) => resource_address),
  )

  const getEntityNonFungibleIDs = (
    accountAddress: string,
    nftAddress: string,
    vaultAddress: string,
  ) =>
    stateApi.innerClient.entityNonFungibleIdsPage({
      stateEntityNonFungibleIdsPageRequest: {
        address: accountAddress,
        vault_address: vaultAddress,
        resource_address: nftAddress,
      },
    })

  const getNonFungibleData = (
    address: string,
    ids: string[],
  ): Promise<StateNonFungibleDetailsResponseItem[]> =>
    stateApi.getNonFungibleData(address, ids)

  const getNonFungibleIds = async (
    accountAddress: string,
    nonFungibleResource: NonFungibleResourcesCollectionItemVaultAggregated,
  ) => {
    const ids: string[] = []

    for (const vault of nonFungibleResource.vaults.items) {
      const entityIds = await getEntityNonFungibleIDs(
        accountAddress,
        nonFungibleResource.resource_address,
        vault.vault_address,
      )

      ids.push(...entityIds.items)
    }

    return ids
  }

  for (const nonFungible of nonFungibles.items) {
    const ids = await getNonFungibleIds(accountAddress, nonFungible)
    const entity = nonFungibleEntities.find(
      ({ address }) => address === nonFungible.resource_address,
    )!

    const nftData = await getNonFungibleData(nonFungible.resource_address, ids)

    for (const singleNftData of nftData) {
      transformedNonFungibles.push({
        type: 'non-fungible',
        id: singleNftData.non_fungible_id,
        address: `${entity.address}`,
        name: getStringMetadata('name')(entity.metadata),
        totalSupply: (
          entity.details as StateEntityDetailsResponseFungibleResourceDetails
        ).total_supply,
        explicitMetadata: entity.explicit_metadata,
      })
    }
  }

  return transformedNonFungibles.reduce<Record<string, NonFungibleResource[]>>(
    (acc, curr) => {
      const resourceManager = acc[curr.address] || []
      resourceManager.push(curr)
      return { ...acc, [curr.address]: resourceManager }
    },
    {},
  )
}

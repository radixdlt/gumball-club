// @ts-nocheck TODO: Remove when gateway api types are exported correctly
import {
  EntityMetadataCollection,
  FungibleResourcesVaultCollection,
  State,
  StateEntityDetailsResponseFungibleResourceDetails,
} from "@radixdlt/babylon-gateway-api-sdk"
import { BigNumber } from "bignumber.js"

export type FungibleResource = {
  type: "fungible"
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
      ?.value || ""

export const transformFungibleTokens = async (
  fungibles: FungibleResourcesVaultCollection,
  stateApi: State
): Promise<Record<string, FungibleResource>> => {
  if (fungibles.items.length === 0) {
    return {}
  }

  const fungibleEntities = await stateApi.getEntityDetailsVaultAggregated(
    fungibles.items.map(({ resource_address }) => resource_address)
  )

  return fungibleEntities.reduce<Record<string, FungibleResource>>(
    (acc, entity) => {
      const vaults = fungibles.items.find(
        ({ resource_address }) => resource_address === entity.address
      )?.vaults

      return {
        ...acc,
        [entity.address]: {
          type: "fungible",
          value:
            vaults?.items
              .reduce((prev, next) => prev.plus(next.amount), new BigNumber(0))
              .toString() || "0",
          address: entity.address,
          name: getStringMetadata("name")(entity.metadata),
          symbol: getStringMetadata("symbol")(entity.metadata),
          iconUrl: getStringMetadata("icon_url")(entity.metadata),
          description: getStringMetadata("description")(entity.metadata),
          totalSupply: (
            entity.details as StateEntityDetailsResponseFungibleResourceDetails
          ).total_supply,
          explicitMetadata: entity.explicit_metadata,
        },
      }
    },
    {}
  )
}

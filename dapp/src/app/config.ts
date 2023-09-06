import { RadixNetworkConfig } from '@radixdlt/radix-dapp-toolkit'

if (!process.env.NEXT_PUBLIC_NETWORK) throw new Error('NETWORK env var not set')
if (!process.env.NEXT_PUBLIC_DAPP_DEFINITION_ADDRESS)
  throw new Error('DAPP_DEFINITION_ADDRESS env var not set')

const network =
  RadixNetworkConfig[
    process.env.NEXT_PUBLIC_NETWORK as keyof typeof RadixNetworkConfig
  ]!

if (!network) throw new Error('Invalid network')

export type ResourceAddresses = typeof config.addresses

const dAppDefinitionAddress = process.env.NEXT_PUBLIC_DAPP_DEFINITION_ADDRESS

export const config = {
  network,
  dAppDefinitionAddress,
  addresses: {
    ownerNftResourceAddress:
      'resource_tdx_22_1nt8p5ul0z59dr8d2zlwpmha636urpt3rteqqptrdu5v7nr4r0ad6fn',
    ownerNftId: '#1#',
    sugarOraclePackage:
      'package_tdx_22_1phpxmnmsy0smsfr45rchus24ve9qks3wk443eljk3kty7x0265j6uc',
    sugarOracleComponent:
      'component_tdx_22_1cqkfzuxf9vdf5uacjdtqvgtcp6pwsn3pphrgh2ndk7kdujsredc6xx',
    gumballClubPackage:
      'package_tdx_22_1p4yckqa9r96mtvnwng4zgh44qs2rl0anzs008q7g49sjellmss833k',
    gumballClubComponent:
      'component_tdx_22_1cpk4qsey3stg98w82tshegphqls82fasrlqw0kaxjgdcwyfykuydka',
    gumballMachineComponent:
      'component_tdx_22_1czzcngdndhrlsg8a7dahrjk3f6k87gykudgwpanxcsqxem75swf80g',
    candyMachineComponent:
      'component_tdx_22_1cpmjz2etrhhtsx9pep9t93nnqzvkgzwp7n8ut8ujkenamh0ln34xda',
    gumballClubTokensResource:
      'resource_tdx_22_1thf2myxtgfpd0na3m9zqzjmx8p27aysrgsup7tuhav53q3heqhfgev',
    gumballClubMemberCardResource:
      'resource_tdx_22_1ntsrh2vd37ha3u9valkaq246wcjupt4u25am99l56r5vplalmygudw',
    gumballResource:
      'resource_tdx_22_1t54x444prmagsafx6wtnlvfkadqfewnyy28nfaqusdc47l8uahrpjx',
    candyTokenResource:
      'resource_tdx_22_1t40j50t5evj6nhknlwvyv9wn95884df7yf0hwzah0jxw6627882xwa',
  },
}

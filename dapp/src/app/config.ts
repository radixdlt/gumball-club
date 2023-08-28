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
    sugarOraclePackage:
      'package_tdx_22_1phyr3jdse2emxeuxa4md6ajcqgkure5e8ljpc42xpcfdheh5s7ef57',
    sugarOracleComponent:
      'component_tdx_22_1czrxv0u7963hz32q059a5ug5ffvmgna8dvv2mr4t9xrsf80dsdre54',
    gumballClubPackage:
      'package_tdx_22_1phxh5ml99kcu5q7qdagfkysgh5puutyys8s73q9lkpaa8v9zv3fda7',
    gumballClubComponent:
      'component_tdx_22_1czz04v9wacxyrymrjjklf792y38080qwgf807yu7lhcf4gw7vxapqg',
    gumballMachineComponent:
      'component_tdx_22_1cqqmxua230ghx5dppn2jhsl0h2aewdknaukmy2g47szztrdj3q9p63',
    candyMachineComponent:
      'component_tdx_22_1cp05agcmhskzglqe4hrf2k9u5yg2ukydr8zasp9d4cgczkd5qe70mq',
    gumballClubTokensResource:
      'resource_tdx_22_1t4a0lqqv0kyf0gm9y4qclfqfgguqfn5n4pvszjj25surzscjlyp0s5',
    gumballClubMemberCardResource:
      'resource_tdx_22_1nge4mk9xq5k8j0mle20kx0lk4q5x0hlmhy02u2wkd8jafqkm0wajnj',
    gumballResource:
      'resource_tdx_22_1t5h8hm4ymclt7gxdqggrgwh3y5dap3xcrdqm55fp9x4n8e5tju5eyu',
    candyTokenResource:
      'resource_tdx_22_1t5gp9965ege3tlkp2lehk0jx4azzlzu3n4g0dry2mm07hferh6jaah',
  },
}

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
      'package_tdx_22_1p5cnytswfqytmna32rnpy9hq7wkeky0007wmhkgvx89jlkfg6yzj9p',
    gumballClubComponent:
      'component_tdx_22_1cqmwvdhry0tsth325r47d58d0d4aap0m79wt6fl6flehn4yr05d5hv',
    gumballMachineComponent:
      'component_tdx_22_1cp6yzct4yxp9gpn7vvf5a99mkfwn7l74vthxdawcfd9mtnrmzd0pm6',
    candyMachineComponent:
      'component_tdx_22_1crjcyncwpgq2x9kdcyxm7frnx5zj4gy0zm2ln0p4tj9c0ulhsltra0',
    gumballClubTokensResource:
      'resource_tdx_22_1t4egu7yxw0j7kanyzxjvgv0sw7jed0stpq8fr8lwvgcnp7zzjyynvk',
    gumballClubMemberCardResource:
      'resource_tdx_22_1t4egu7yxw0j7kanyzxjvgv0sw7jed0stpq8fr8lwvgcnp7zzjyynvk',
    gumballResource:
      'resource_tdx_22_1th3ekrvnvavs5m4d4gc73kk0xydq25p5w4c2zzhpcnjnhvywl03uza',
    candyTokenResource:
      'resource_tdx_22_1tkf4hwpykjzrpz587y4yj24r3vwtqpr2zr7y7xn5purn3z22rwp2v5',
  },
}

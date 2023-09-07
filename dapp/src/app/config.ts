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
      'package_tdx_22_1pkptwd6uzfy83edewxrrzt4g3769mcav2923lgwg2dya58kl4qtl84',
    gumballClubComponent:
      'component_tdx_22_1cqrfgkf373h82dpp2pn7hyttxm6uh22r0mjcksrd4fyd3sgdy2cehe',
    gumballMachineComponent:
      'component_tdx_22_1cz64vh4gv53u3ng28090966cr2xdg5dncg4tw6tyr3zgj6eln9ymz2',
    candyMachineComponent:
      'component_tdx_22_1cprneh7gjzcq66fycpu3swcwr5xwq2ut0x73c7q3a8x378yfta040r',
    gumballClubTokensResource:
      'resource_tdx_22_1tkmkme53wd9szzjxqruh4zt0ge7wetenrcyegrznhpd6slya4jp9tx',
    gumballClubMemberCardResource:
      'resource_tdx_22_1ntlss5xurn4pxv6ndare56zatplc9w407vk9rydyylg9a58fwhznc6',
    gumballResource:
      'resource_tdx_22_1tk8vfdnx45acuwjhz4saz6v44g2xhre4f3wtdqxfkvzxsq94jxyhj5',
    candyTokenResource:
      'resource_tdx_22_1thy5rakgltclf3a2adtpp8aawhn0xa7dwmhn2c7dzm5tt2cxtxzr7f',
  },
}

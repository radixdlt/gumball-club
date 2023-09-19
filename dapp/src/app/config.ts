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
    sugarOraclePackageAddress:
      'package_tdx_e_1pknq7sn5agctwrjhclw6a3r9ux65lngdy5s4j8k5penyt3pgp50k8f',
    sugarOracleComponent:
      'component_tdx_e_1cpc7u49ehzd5hwwmr565es390rk8m43kvu93l4xjnrl4z99rww60ps',
    gumballClubPackage:
      'package_tdx_e_1phc3m9q6kkq0erkqe49e3yg8dgahkj74us566flz3xymju7l4rdm08',
    gumballClubComponent:
      'component_tdx_e_1cqen6r8f8te6rn40gxd9tmkj4tjvjzul9e0em45tq6ktsvlm7wh4h8',
    gumballMachineComponent:
      'component_tdx_e_1cp7ln9edumktnpqwyfggm5hsv70pgzuuhvzq5u38qp5p4q29j868fj',
    candyMachineComponent:
      'component_tdx_e_1cz7llkf275z0gn60vcrfm25sce9v9hx09wyna2hgxl8ydk5sp985ck',
    gumballClubTokensResource:
      'resource_tdx_e_1t49apephn08g8wqrs647nxshlm3e9t76maw5agqydjd0d40559lzlv',
    gumballClubMemberCardResource:
      'resource_tdx_e_1ngdu84pz6yat2jsqwqukvdhru30u93zmuynkmhnmk2ygxjnf4z3kh2',
    gumballResource:
      'resource_tdx_e_1thtnrhchf7eaapr37tupsmxg44qm7hs5wv69efsvkwss57nmvx7hmx',
    candyTokenResource:
      'resource_tdx_e_1t45e0q75zln8jk5z3vyxp88hrugj5p7alr8spspv2r79lv0px6rpdg',
  },
}

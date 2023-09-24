import { RadixNetworkConfig } from '@radixdlt/radix-dapp-toolkit'

if (!process.env.NEXT_PUBLIC_NETWORK) throw new Error('NETWORK env var not set')

const network =
  RadixNetworkConfig[
    process.env.NEXT_PUBLIC_NETWORK as keyof typeof RadixNetworkConfig
  ]!

if (!network) throw new Error('Invalid network')

export type ResourceAddresses = typeof config.addresses

type Addresses = {
  sugarOraclePackageAddress: string
  sugarOracleComponent: string
  gumballClubPackage: string
  gumballClubComponent: string
  gumballMachineComponent: string
  candyMachineComponent: string
  gumballClubTokensResource: string
  gumballClubMemberCardResource: string
  gumballResource: string
  candyTokenResource: string
}

const gumballNetworkConfig = {
  Zabanet: {
    dAppDefinitionAddress:
      'account_tdx_e_12x0026vf4yfrk7vzpedf4w8xzmww8g8w6vsmxthf6ex59p6n0slstr',
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
  },
  Mainnet: {
    dAppDefinitionAddress:
      'account_rdx12xuhw6v30chdkhcu7qznz9vu926vxefr4h4tdvc0mdckg9rq4afx9t',
    addresses: {
      sugarOraclePackageAddress: '',
      sugarOracleComponent: '',
      gumballClubPackage: '',
      gumballClubComponent: '',
      gumballMachineComponent: '',
      candyMachineComponent: '',
      gumballClubTokensResource: '',
      gumballClubMemberCardResource: '',
      gumballResource: '',
      candyTokenResource: '',
    },
  },
  Stokenet: {
    dAppDefinitionAddress:
      'account_tdx_2_129nx5lgkk3fz9gqf3clppeljkezeyyymqqejzp97tpk0r8els7hg3j',
    addresses: {
      sugarOraclePackageAddress:
        'package_tdx_2_1p56309c37y65tvtav6a33dq3hyrmp6r360gmac0ka2346tfpnnunfh',
      sugarOracleComponent:
        'component_tdx_2_1cz3cc6hth2lwsm6zv0jp5gevv8a5axg36at7hyq4d29wace3s5xk2c',
      gumballClubPackage:
        'package_tdx_2_1php3yzpqqmx6t0v37um4ndzkqzg4vup0hvju0r47x35z5a5x9nwmvl',
      gumballClubComponent:
        'component_tdx_2_1cqr6gp7rfzh7w0jzyxlqrxay8ps2j2wjla53sd5v8k8xyx46p8tw87',
      gumballMachineComponent:
        'component_tdx_2_1cqzp37r67r68pkp9t76q45zq73umfujdlsjrppklgz2lf2pspdz35y',
      candyMachineComponent:
        'component_tdx_2_1czqy5kv828jg682u8u4yknhfust56m53a7zgn5cqw0rzecuf0pw4at',
      gumballClubTokensResource:
        'resource_tdx_2_1thnc475y545ptz9j7ldlll5gnfgf0d357qtyaku2r903068ga9l9lv',
      gumballClubMemberCardResource:
        'resource_tdx_2_1nfd6vmsjhq8akz39gufvkg87zzxm74ps6mham0h46qy639gas2guhz',
      gumballResource:
        'resource_tdx_2_1t5t6wqkw747fv7ssm5qgpgdxryf27a6z5d04mwwu2rhayvjrxm3x3v',
      candyTokenResource:
        'resource_tdx_2_1thfkm7durcyxgjajy5e2rggldckqecdpa67lj9ek5h6ymckkpv36zu',
    } satisfies Addresses,
  },
}[network.networkName]

if (!gumballNetworkConfig)
  throw new Error(
    `Could not find addresses for network: ${network.networkName}`
  )

export const config = {
  network,
  ...gumballNetworkConfig,
}

console.log(JSON.stringify(config, null, 2))

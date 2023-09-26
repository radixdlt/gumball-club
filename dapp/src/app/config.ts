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
        'package_tdx_2_1p4jtcqcwxmvzdp83uvr57pekt6fam4rruwxj5fms5pvzzmr3ra65fc',
      sugarOracleComponent:
        'component_tdx_2_1crr5k3lnjq5ndtmexknwgd58tn473r7enf3rst43puklvlm5uff6u7',
      gumballClubPackage:
        'package_tdx_2_1phjykvhkpyap6fg5433a0akam0lc8vgzd4cnf5slhm0y6p0m0kw4c9',
      gumballClubComponent:
        'component_tdx_2_1czgve6uw9tnvc4udc3nx6gnhxqjn488yhttpkr3kjhx7f7jzpd8c7t',
      gumballMachineComponent:
        'component_tdx_2_1cpagaqy73p9a7v4cx23ayn5cgfcqxet90sclvluk6mca2rzw38hfd5',
      candyMachineComponent:
        'component_tdx_2_1cze3ujjsymjsetxrgaerhjp7x0zjc4c7wcduwk0g3ytxk9yln0cqvj',
      gumballClubTokensResource:
        'resource_tdx_2_1t4pre2zseqavzsktmhtffkfc8kwqmydj6ejtft0chevyvwrjmmwftq',
      gumballClubMemberCardResource:
        'resource_tdx_2_1ntps5asnsjrajuef209kdjd779r84dnd473ltxtlga838rp6ez2zk6',
      gumballResource:
        'resource_tdx_2_1t4e3rx59pfumryng7r6ezm2tsu72lhtl4whj6wjryrquwnhm2yrtwf',
      candyTokenResource:
        'resource_tdx_2_1thfegpdrkld3hdf5vlldwz8vhpvtmkkr78u6evguqwstvdv0k6zryd',
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

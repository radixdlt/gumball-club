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
      sugarOraclePackageAddress:
        'package_rdx1pk5scajc6xaz9xdlhpunj5vula9wt9mjara8a7ck7lrpm770698ygs',
      sugarOracleComponent:
        'component_rdx1cp4t3mcnjrpa4aetgvfzd8dc9ax5h5sjm5ezndrj8twf03nmlvdngy',
      gumballClubPackage:
        'package_rdx1p589ehmmvqa2dnw0jaky3kesjdjvln94hzunsqse8k52083hfcjh63',
      gumballMachineComponent:
        'component_rdx1cq4ugccz6pg89w83ujanqlycw566kd9c9vxxuc9r45p7vues2649t4',
      gumballClubComponent:
        'component_rdx1crduuu8q77xkngf88puhumrpqgqk5sy9fvfz6wwjzs3lvx05z3582h',
      candyMachineComponent:
        'component_rdx1czu8pr7zwlmjg2pp9ftq3yg2pqz9d3al5tj004uflwrwzgq060708u',
      gumballClubMemberCardResource:
        'resource_rdx1nfyg2f68jw7hfdlg5hzvd8ylsa7e0kjl68t5t62v3ttamtejc9wlxa',
      candyTokenResource:
        'resource_rdx1t4dy69k6s0gv040xa64cyadyefwtett62ng6xfdnljyydnml7t6g3j',
      gumballResource:
        'resource_rdx1t5tsyyh82jxjrg7lrat7y5f7mcuxcch6d3jkc75l8et3n2n6h32kvd',
      gumballClubTokensResource:
        'resource_rdx1thlnv2lydu7np9w8guguqslkydv000d7ydn7uq0sestql96hrfml0v',
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

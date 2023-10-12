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
        'package_tdx_2_1p4lftg7zjtmvyw5dwv3fg9cxyumlrya03p5uecqdge9thje4nm5qtk',
      sugarOracleComponent:
        'component_tdx_2_1cptzmfxvdwdy90euq98rldtsghk7pj549kukzfgl6xmlthmaw8262m',
      gumballClubPackage:
        'package_tdx_2_1pkaw4m82c89hy0gk4dwqtqlln6md8anr2ysnrvegxar53mr6nvn5ay',
      gumballClubComponent:
        'component_tdx_2_1czg6rq9vms7t402fedtpzkjah25hh7snyu3ysgxk3pwlz4d3tugm7j',
      gumballMachineComponent:
        'component_tdx_2_1cq64nku32ypaytze8nys60y2zjvsmquxxe02v6ksh4exqkkqpxgrqq',
      candyMachineComponent:
        'component_tdx_2_1crje3en7zsrna9t5vyywn3z3t9ht34l9udxjcpjvdhpcw9v6vlzru8',
      gumballClubTokensResource:
        'resource_tdx_2_1thqcgjw37fjgycpvqr52nx4jcsdeuq75mf2nywme07kzsuds9a4psp',
      gumballClubMemberCardResource:
        'resource_tdx_2_1ng88qk08hrgmad30rzdxpyx779yuta4cwcjc3gstk60jhachsv94g9',
      gumballResource:
        'resource_tdx_2_1t4kep9ldg9t0cszj78z6fcr2zvfxfq7muetq7pyvhdtctwxum90scq',
      candyTokenResource:
        'resource_tdx_2_1tk30vj4ene95e3vhymtf2p35fzl29rv4us36capu2rz0vretw9gzr3',
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

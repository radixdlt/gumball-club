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
        'package_tdx_2_1phzetyhgy4e59kgw0h4zqv9t290x9dyu8qq6m7g62h0qa9w3qq9q2t',
      sugarOracleComponent:
        'component_tdx_2_1crwz8ut32jugfp8nuzjrurt5pv7f3q4jrppqd37e48qdx3xguq3nuh',
      gumballClubPackage:
        'package_tdx_2_1p4p2ggdexj478wqcznk248mw4mgcxnagkpdk2urepgma8ht85r03fw',
      gumballClubComponent:
        'component_tdx_2_1cpd3cgy9kaxvxlptkkgxkm3qvfyqkrsl03kyz532p7e2gk0ygs4xrd',
      gumballMachineComponent:
        'component_tdx_2_1cprwxfvtfa5j3rrzgklfp23pal7llvruxcdmkw0zdr3sk4as230var',
      candyMachineComponent:
        'component_tdx_2_1cr4pa9ex9xhwzfjzclv8vjnfylw93wvhkwcwc0xlahpkel0krxqedw',
      gumballClubTokensResource:
        'resource_tdx_2_1t5dapa24l4xvwqtqe2jrdphtn7ga46gw67wr9fwn4gp532myfjqpck',
      gumballClubMemberCardResource:
        'resource_tdx_2_1nfmxggm4plrrmc9ft9qn79g7uehqlhjaszv02dnuk85s0h9xnh3xue',
      gumballResource:
        'resource_tdx_2_1tkd957yt3rwqze7elmzlphfjnmfyzkf9l5rau5ccsx9h2vs9nq3tzp',
      candyTokenResource:
        'resource_tdx_2_1thcmn5q5ww3fm0mx55zs9cj0n36qc0jtx956q7vh9ycxk3vh8553qc',
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

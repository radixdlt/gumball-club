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
      'package_tdx_e_1p4uctghdnrj9lg2t8jsz2zqg93ruv6l65rdn722fdu780q8hkcqrgp',
    sugarOracleComponent:
      'component_tdx_e_1cqh2vmmz9d5g4lg2fe4zd3cjqyt4l49wrk4efpevrrc0cn3gelwghd',
    gumballClubPackage:
      'package_tdx_e_1p4736u00d9jdw52v9h8ger9ylkva4w43508elfc97dg2funpa3j64y',
    gumballClubComponent:
      'component_tdx_e_1cqn4yn0exm3xwlt22u89rg3rl52xjqg2tkyd2ge6qw4t2ve9fcxkcy',
    gumballMachineComponent:
      'component_tdx_e_1cryje9hzjj8wxdg0p7kev3da094q9xzxjr7lspjl3uddv87v7kacfn',
    candyMachineComponent:
      'component_tdx_e_1cphatvktw870crtdmjq36xqrhagx5w984gzdj2l63rluhk7cf3zx3d',
    gumballClubTokensResource:
      'resource_tdx_e_1t4u6p6s7l23mggag2hqz6cxqeza4vzmzx4negylfjcl9hxpk7tjxac',
    gumballClubMemberCardResource:
      'resource_tdx_e_1nfm2eyt7c5xzzqj6uplrwwskknm28remt6jfcpg0dmrjpmzvzyx89g',
    gumballResource:
      'resource_tdx_e_1t40qd3pex7a99savn6krw8vlfymcz0k9e2xh5mhl86ztklr862pum7',
    candyTokenResource:
      'resource_tdx_e_1tkmq34m97d3wfmlcgenp5ftz7f8sukldmzermgvpd30z57esfrjdg4',
  },
}

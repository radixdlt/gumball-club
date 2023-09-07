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
      'resource_tdx_e_1ntd98ysjjkztskaxcctmqf2ja23c9fx3x4syxv5rsp98mlcmxgcx9y',
    ownerNftId: '#1#',
    sugarOraclePackage:
      'package_tdx_e_1p4uctghdnrj9lg2t8jsz2zqg93ruv6l65rdn722fdu780q8hkcqrgp',
    sugarOracleComponent:
      'component_tdx_e_1cqh2vmmz9d5g4lg2fe4zd3cjqyt4l49wrk4efpevrrc0cn3gelwghd',
    gumballClubPackage:
      'package_tdx_e_1p5jnrp4a3d8r4gue8fds20vmzdfzvcd7m2qz6rdyphky5qm24hmtlr',
    gumballClubComponent:
      'component_tdx_e_1cqwewayh8g5ema484typ7ayuq4clrsxjlptf3j2p54jpzplnjv5nv5',
    gumballMachineComponent:
      'component_tdx_e_1crna224gxvp4sgja96t8nyztxp388j82rq96j25x4c0qzcwx5wh00v',
    candyMachineComponent:
      'component_tdx_e_1cq5h42uaknunxz82ylnh5nje9le3dn0tmds2ptm7eqxttdug6tpk88',
    gumballClubTokensResource:
      'resource_tdx_e_1tkyrtwrx8smdw6vc8pr4pyjjlxmaz6uuzwwrya8swgtq7lrq8apudc',
    gumballClubMemberCardResource:
      'resource_tdx_e_1nfftq8sv52sq6hr0u4spq5agyxudtmndzk6uzas4p84rx8k86puu2s',
    gumballResource:
      'resource_tdx_e_1tk9szja5jqzrvwyhayvg30393v3zavdkwm0gkq5pak676wlph25lcz',
    candyTokenResource:
      'resource_tdx_e_1t5xm932hch9vqwq55mxv7n2xaepcpcyhcqrz08ea5exga72028vxfr',
  },
}

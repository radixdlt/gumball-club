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
      'resource_tdx_e_1ntr7s7cn68d9zcj6kw4flqw5nqgw29w9ws2n7u3uand6wsf35t2a9p',
    ownerNftId: '#1#',
    sugarOraclePackage:
      'package_tdx_e_1phqfccrg7wl2vvsqv5agw8zfamexfuzrcrve6s8j33gqd2f8s64jv9',
    sugarOracleComponent:
      'component_tdx_e_1cqcmmjpaj0ql6eenmjud5px5tfju68wnyxpyhv4gkhhd6wmfly7xk5',
    gumballClubPackage:
      'package_tdx_e_1p58l8t49gzf67rt9kqhl5qrxvp26680j2kdpkcdxclz6afmdpn4uwr',
    gumballClubComponent:
      'component_tdx_e_1crzvfaasuqcqf0rgwqqhjv642ankz6az43cvpussar5wdzc84dwvtt',
    gumballMachineComponent:
      'component_tdx_e_1cpw88ndtv2kp60tsd2tkfmffzd2g75tm7ln3k394v4h6kp36sf9hgm',
    candyMachineComponent:
      'component_tdx_e_1cpzuy74umt5tqc72j5y6av8u5w8vvc0dz6v2ps4m4xvr3c5r023av9',
    gumballClubTokensResource:
      'resource_tdx_e_1t4wjsrgz9t3hkd0kq889ckdpqzkhpeqsps4q46p3l3ptuwgc5sx9qv',
    gumballClubMemberCardResource:
      'resource_tdx_e_1n2wfjn5gwkyfaln2w6gp9sz7k7wpmjfm09z3zpkx6a6hurtng8dlfu',
    gumballResource:
      'resource_tdx_e_1t5jj6l0gts2ml8m27wzymrexfed3d70cx37munajgsyx327a75x65m',
    candyTokenResource:
      'resource_tdx_e_1thqxupu7p0pl56xvfp3uhuawraqhm4fnevypqdmtp7q4wxlqwrxaud',
  },
}

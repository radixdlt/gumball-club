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
      'package_tdx_e_1phkdmj3l52uedvd87f6hpugz0yky3ky0e7qllqpajyey2hywzxpnng',
    sugarOracleComponent:
      'component_tdx_e_1cr6nll8qsmzml28u52r37e0welrardrfd356h7s68053z6mrgl6xew',
    gumballClubPackage:
      'package_tdx_e_1p4cecwpk2qmmr4rf5qrtpdgpfavcthlh68yfln8tzg6syq930j5jut',
    gumballClubComponent:
      'component_tdx_e_1cz9ttfqlq0c2s4yel07sp2ma028jmnjdhte0f7s82gtzr3ghagfzfa',
    gumballMachineComponent:
      'component_tdx_e_1cpjt5upsa0mmldktll4u8gv40mk964lq5nkfcpgsj2xhcq4rn22qqs',
    candyMachineComponent:
      'component_tdx_e_1cze0a0hd499nx4ygrtp2w89nvnrvt08x9a5h2vgnh7et364c46ckpw',
    gumballClubTokensResource:
      'resource_tdx_e_1tht8tdfywzrjx6dva4gdfr92ngxgndadavh0c30uxfqc5slkgkckws',
    gumballClubMemberCardResource:
      'resource_tdx_e_1nf33wdde57tzk5uwwzzfce82atexd59r4pj3x2fskymekhlk7tl26v',
    gumballResource:
      'resource_tdx_e_1t4vfa6vx2phulymsu49qm7uqr3qj5ng6j7m9tc2hvlq00we5qqc302',
    candyTokenResource:
      'resource_tdx_e_1t46dwp38cln3qw43ctzsvhe0eldu2ffr3q4p5j9c3d5er96q96t3aa',
  },
}

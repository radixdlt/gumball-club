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
      'package_tdx_e_1phy0kqg0ne55vfn2nzy70vdtvxc0uec6x90pmejz0qxqs7x9l35n2v',
    gumballClubComponent:
      'component_tdx_e_1cqvlkppqxxatnwhk2prt864n9zq2u40xpwf2rdcm7jlcg3v98njmuq',
    gumballMachineComponent:
      'component_tdx_e_1cq4en0lp9qkaj7u65jeftx77rmqmnhr0pw9a6ywngf8he0q8cmyekm',
    candyMachineComponent:
      'component_tdx_e_1czdndltgxm46sdfkgxe4age8a7txqy5zerrf08hnyktx35xuwaumrn',
    gumballClubTokensResource:
      'resource_tdx_e_1t4qt745x3xkpaerncelgrk3nwmpnsr9kpxpyt93h8mez4wuys39386',
    gumballClubMemberCardResource:
      'resource_tdx_e_1ng7mat8vafrrrxj8prdyu9k0934mf0s6elapg5932q3e303ruzmy0e',
    gumballResource:
      'resource_tdx_e_1thm34j4udestlh3fjmupny7jsf853ryk2yxuswllvefzemcqh6fdmp',
    candyTokenResource:
      'resource_tdx_e_1tktaxsrc7zt7hvkkxnfxc2g9l44thzxfz3q4wpy6twsuyct0ypwesu',
  },
}

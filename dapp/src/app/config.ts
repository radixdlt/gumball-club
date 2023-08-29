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
      'package_tdx_21_1p4e6uhw6qt09s083ufv4508lpplclqps8rf2yz5952r6zmxjm3hqks',
    sugarOracleComponent:
      'component_tdx_21_1cz3pg8x5us0d743lp2q305y88ny7z7zps6lztamdrl4kw6frs45num',
    gumballClubPackage:
      'package_tdx_21_1p4d5d7wmj2y88rg5avhxymd407rnpr3j59d2ftnajc48f5p650ncga',
    ownerNft:
      'resource_tdx_21_1ntazz6arzqfqw4359arvamuynesaz44wcal6krd635kvd2jgc6v9dv:#1#',
    gumballClubComponent:
      'component_tdx_21_1cr5d2thk76rd8zrsvg067kn856vdssgu7jgkpjw5n7sadu8u50a2s0',
    gumballMachineComponent:
      'component_tdx_21_1cpxtfszl4x73cltntlgr7jr7lsf340uf4jmhmtvlexegkclpmneefd',
    candyMachineComponent:
      'component_tdx_21_1crqd24ryv37u4tq3gmyscmj6j5krk0aedt6n7dvntgten09ckm5lp4',
    gumballClubTokensResource:
      'resource_tdx_21_1thd9jsajjhs2px5pw59yla0j83mxwutxqtagzhrrjf782ea267ls4c',
    gumballClubMemberCardResource:
      'resource_tdx_21_1ngqtqhtyy7kjzalft9eukr33hsh3rd4lyvg4g84z2fl48ksy0re2dl',
    gumballResource:
      'resource_tdx_21_1t5ea5uzg64jvg42hl40nn58223c4fgjhtye974xrnxd7nsywzetqt4',
    candyTokenResource:
      'resource_tdx_21_1th6qdxvqdvxzr22wn4pt07dszcam6ecwjyxmrdunuvmqrnxdp8tj4d',
  },
}

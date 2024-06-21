import { createContext } from 'react'
import { RadixDappToolkit } from '@radixdlt/radix-dapp-toolkit'
import { GatewayApiClient } from '@radixdlt/babylon-gateway-api-sdk'

export type Gateway = ReturnType<(typeof GatewayApiClient)['initialize']>
export type DappToolkit = ReturnType<typeof RadixDappToolkit>

export const DappToolkitContext = createContext<DappToolkit | null>(null)
export const GatewayContext = createContext<Gateway | null>(null)

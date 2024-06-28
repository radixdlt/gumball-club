import { createContext } from 'react'
import { GatewayApiClient } from '@radixdlt/babylon-gateway-api-sdk'

export const GatewayContext = createContext<GatewayApiClient | null>(null)

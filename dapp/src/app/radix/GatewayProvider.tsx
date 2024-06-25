import { GatewayApiClient } from '@radixdlt/babylon-gateway-api-sdk'
import React, { ReactNode } from 'react'
import { GatewayContext } from './gateway-context'

export const GatewayProvider = ({
  value,
  children,
}: {
  value: GatewayApiClient
  children: ReactNode
}) => (
  <GatewayContext.Provider value={value}>{children}</GatewayContext.Provider>
)

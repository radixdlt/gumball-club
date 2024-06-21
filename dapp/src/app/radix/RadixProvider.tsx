import React, { ReactNode } from 'react'
import {
  DappToolkitContext,
  GatewayContext,
  DappToolkit,
  Gateway,
} from './radix-context'

export const RadixProvider = ({
  dAppToolkit,
  gateway,
  children,
}: {
  dAppToolkit: DappToolkit
  gateway: Gateway
  children: ReactNode
}) => {
  return (
    <GatewayContext.Provider value={gateway}>
      <DappToolkitContext.Provider value={dAppToolkit}>
        {children}
      </DappToolkitContext.Provider>
    </GatewayContext.Provider>
  )
}

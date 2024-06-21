'use client'

import {
  DataRequestBuilder,
  RadixDappToolkit,
  Logger,
} from '@radixdlt/radix-dapp-toolkit'
import { Home } from './components/home/Home'
import { RadixProvider } from './radix/RadixProvider'
import { useEffect, useState } from 'react'
import { config } from './config'
import { GatewayApiClient } from '@radixdlt/babylon-gateway-api-sdk'

export default function Page() {
  const [state, setState] = useState<
    { dAppToolkit: RadixDappToolkit; gateway: GatewayApiClient } | undefined
  >()

  // Initialize Radix Dapp Toolkit in the client
  useEffect(() => {
    const dAppToolkit = RadixDappToolkit({
      networkId: config.network.networkId,
      dAppDefinitionAddress: config.dAppDefinitionAddress,
      logger: Logger(2),
    })

    dAppToolkit.walletApi.setRequestData(
      DataRequestBuilder.accounts().atLeast(1)
    )

    const gateway = GatewayApiClient.initialize(
      dAppToolkit.gatewayApi.clientConfig
    )

    setState({ dAppToolkit, gateway })

    return () => {
      dAppToolkit.destroy()
    }
  }, [])

  if (!state) return null

  return (
    <RadixProvider dAppToolkit={state.dAppToolkit} gateway={state.gateway}>
      <Home />
    </RadixProvider>
  )
}

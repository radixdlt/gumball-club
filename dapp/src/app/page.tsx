'use client'

import {
  DataRequestBuilder,
  Logger,
  RadixDappToolkit,
} from '@radixdlt/radix-dapp-toolkit'
import { Home } from './components/home/Home'
import { RadixProvider } from './radix/RadixProvider'
import { useEffect, useState } from 'react'
import { config } from './config'
import { GatewayApiClient } from '@radixdlt/babylon-gateway-api-sdk'
import { GatewayProvider } from './radix/GatewayProvider'

export default function Page() {
  const [state, setState] = useState<RadixDappToolkit | undefined>()
  const [gateway, setGateway] = useState<GatewayApiClient | undefined>()

  // Initialize Radix Dapp Toolkit in the client
  useEffect(() => {
    const radixDappToolkit = RadixDappToolkit({
      networkId: config.network.networkId,
      dAppDefinitionAddress: config.dAppDefinitionAddress,
      logger: Logger(2),
    })

    const gatewayApi = GatewayApiClient.initialize({
      networkId: config.network.networkId,
      applicationName: 'Radix Gumball Club',
      applicationDappDefinitionAddress: config.dAppDefinitionAddress,
    })

    setGateway(gatewayApi)

    radixDappToolkit.walletApi.setRequestData(
      DataRequestBuilder.accounts().atLeast(1)
    )

    setState(radixDappToolkit)

    return () => {
      radixDappToolkit.destroy()
    }
  }, [])

  if (!state) return null
  if (!gateway) return null

  return (
    <GatewayProvider value={gateway}>
      <RadixProvider value={state}>
        <Home />
      </RadixProvider>
    </GatewayProvider>
  )
}

"use client"

import {
  DataRequestBuilder,
  RadixDappToolkit,
  createLogger,
} from "@radixdlt/radix-dapp-toolkit"
import { Home } from "./components/home/Home"
import { RadixProvider } from "./radix/RadixProvider"
import { useEffect, useState } from "react"

export default function Page() {
  const [state, setState] = useState<RadixDappToolkit | undefined>()

  // Initialize Radix Dapp Toolkit in the client
  useEffect(() => {
    const radixDappToolkit = RadixDappToolkit({
      networkId: Number.parseInt(process.env.NEXT_PUBLIC_NETWORK_ID || ""),
      dAppDefinitionAddress:
        process.env.NEXT_PUBLIC_DAPP_DEFINITION_ADDRESS || "",
      logger: createLogger(2),
    })

    radixDappToolkit.walletApi.setRequestData(
      DataRequestBuilder.accounts().atLeast(1),
      DataRequestBuilder.personaData().fullName()
    )

    setState(radixDappToolkit)
  }, [])

  if (!state) return null

  return (
    <RadixProvider value={state}>
      <Home />
    </RadixProvider>
  )
}

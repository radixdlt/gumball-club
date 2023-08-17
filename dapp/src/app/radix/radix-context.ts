import { createContext } from "react"
import { RadixDappToolkit } from "@radixdlt/radix-dapp-toolkit"

export type Radix = ReturnType<typeof RadixDappToolkit>

export const RadixContext = createContext<Radix | null>(null)

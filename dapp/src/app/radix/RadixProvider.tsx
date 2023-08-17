import React, { ReactNode } from "react"
import { RadixContext, Radix } from "./radix-context"

export const RadixProvider = ({
  value,
  children,
}: {
  value: Radix
  children: ReactNode
}) => <RadixContext.Provider value={value}>{children}</RadixContext.Provider>

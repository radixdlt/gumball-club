import { useContext } from "react"
import { RadixContext } from "../radix/radix-context"

export const useDappToolkit = () => useContext(RadixContext)!

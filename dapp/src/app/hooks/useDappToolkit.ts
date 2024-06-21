import { useContext } from 'react'
import { DappToolkitContext } from '../radix/radix-context'

export const useDappToolkit = () => useContext(DappToolkitContext)!

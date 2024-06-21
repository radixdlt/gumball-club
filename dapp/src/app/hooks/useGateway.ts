import { useContext } from 'react'
import { GatewayContext } from '../radix/radix-context'

export const useGateway = () => useContext(GatewayContext)!

import { useContext } from 'react'
import { GatewayContext } from '../radix/gateway-context'

export const useGateway = () => useContext(GatewayContext)!

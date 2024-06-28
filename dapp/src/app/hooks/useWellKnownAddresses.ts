import { useEffect, useState } from 'react'
import { useFetch } from './useFetch'
import { useGateway } from './useGateway'

export const useWellKnownAddresses = () => {
  const gatewayApi = useGateway()
  const [state, setState] = useState<{ xrd: string } | undefined>()
  const { fetch } = useFetch()

  useEffect(() => {
    fetch(
      gatewayApi.status.getNetworkConfiguration().then((response) => {
        setState(response.well_known_addresses)
      })
    )
  }, [gatewayApi, fetch])

  return state
}

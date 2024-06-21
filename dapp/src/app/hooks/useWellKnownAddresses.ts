import { useEffect, useState } from 'react'
import { useFetch } from './useFetch'
import { useGateway } from './useGateway'

export const useWellKnownAddresses = () => {
  const gateway = useGateway()
  const [state, setState] = useState<{ xrd: string } | undefined>()
  const { fetch } = useFetch()

  useEffect(() => {
    fetch(
      gateway.status.getNetworkConfiguration().then((response) => {
        setState(response.well_known_addresses)
      })
    )
  }, [gateway, fetch])

  return state
}

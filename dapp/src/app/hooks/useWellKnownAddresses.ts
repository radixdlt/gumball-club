import { useEffect, useState } from "react"
import { useDappToolkit } from "./useDappToolkit"
import { useFetch } from "./useFetch"

export const useWellKnownAddresses = () => {
  const dAppToolkit = useDappToolkit()
  const [state, setState] = useState<{ xrd: string } | undefined>()
  const fetchHook = useFetch()

  useEffect(() => {
    fetchHook.fetch(
      dAppToolkit.gatewayApi.status
        .getNetworkConfiguration()
        .then((response) => {
          setState(response.well_known_addresses)
        })
    )
  }, [dAppToolkit])

  return state
}

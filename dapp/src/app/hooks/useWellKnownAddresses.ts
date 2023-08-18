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
        // TODO: remove any when gateway api types are exported correctly
        .then((response: any) => {
          setState(response.well_known_addresses)
        })
    )
  }, [dAppToolkit])

  return state
}

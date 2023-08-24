import { useCallback, useState } from 'react'
import { parseJson } from '../helpers/parse-json'

export const useFetch = <T = any>() => {
  const [state, setState] = useState<
    Partial<{
      data: T
      loading: boolean
      error: boolean
      errorMessage: string
    }>
  >({})
  return {
    fetch: useCallback(async (unresolvedPromise: Promise<T>) => {
      try {
        setState({ loading: true })
        return unresolvedPromise.then((data) => {
          setState({ data })
          return data
        })
      } catch (error: any) {
        setState({
          error: true,
          errorMessage: parseJson(error.message),
        })
      }
    }, []),
    state,
  }
}

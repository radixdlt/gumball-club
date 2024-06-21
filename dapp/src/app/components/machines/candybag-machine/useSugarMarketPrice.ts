import { config } from '@/app/config'
import { useGateway } from '@/app/hooks/useGateway'
import { useCallback, useEffect, useState } from 'react'

export const useSugarMarketPrice = () => {
  const gateway = useGateway()
  const [startingTime, setStartingTime] = useState('0')

  useEffect(() => {
    gateway.state.innerClient
      .stateEntityDetails({
        stateEntityDetailsRequest: {
          addresses: [config.addresses.sugarOracleComponent],
        },
      })
      .then((response): string => {
        const sugarOracleStartingTime =
          (
            response.items[0].details as {
              state: { fields: { value: string }[] }
            }
          ).state.fields[0].value || '0'
        return sugarOracleStartingTime
      })
      .then(setStartingTime)
  }, [setStartingTime, gateway])

  return useCallback(async () => {
    const getRoundedDate = (minutes: number, d = new Date()) => {
      let ms = 1000 * 60 * minutes // convert minutes to ms
      let roundedDate = new Date(Math.floor(d.getTime() / ms) * ms)

      return roundedDate.getTime() / 1000
    }

    const calculateCandyPrice = (startValue: string) => {
      const current_time_in_seconds = getRoundedDate(1)
      const time = current_time_in_seconds - parseInt(startValue)

      const half_period = 1800

      const normalized_time = time % (2 * half_period)

      const max_value = 20
      const epsilon = 10

      let price = 0

      if (normalized_time < half_period)
        price = (normalized_time / half_period) * max_value
      else
        price =
          max_value -
          ((normalized_time - half_period) / half_period) * max_value

      if (price < epsilon) {
        price += epsilon
      }

      return Math.floor(price * 100) / 100
    }

    return calculateCandyPrice(startingTime)
  }, [startingTime])
}

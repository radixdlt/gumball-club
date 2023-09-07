import { Card } from '../../base-components/card'
import { Tag } from '../../base-components/tag'
import Image from 'next/image'
import {
  MachineOptions,
  MachineOptionsProps,
} from '../components/machine-options/MachineOptions'
import { MachineHeader } from '../components/machine-header/MachineHeader'
import { AccountWithTokens } from '@/app/hooks/useAccounts'
import { useSugarMarketPrice } from './useSugarMarketPrice'
import { useEffect, useState } from 'react'
import { hasMemberCard as hasMemberCardFn } from '@/app/helpers/hasMemberCard'
import CandyMachineImage from '../../../../../public/assets/candy-machine.png'

export const CandyBagMachine = ({
  accounts,
  onSubmit,
  disableSendButton,
}: {
  accounts: AccountWithTokens[]
  price: number
  disableSendButton?: boolean
  onSubmit: MachineOptionsProps['onSubmit']
}) => {
  const getPrice = useSugarMarketPrice()
  const [candyPrice, setState] = useState(0)
  const hasMemberCard = hasMemberCardFn(accounts)

  useEffect(() => {
    let timeoutRef: any

    const handleGetPrice = () => {
      timeoutRef = setTimeout(async () => {
        try {
          setState(await getPrice())
          handleGetPrice()
        } catch (error) {
          handleGetPrice()
        }
      }, 10_000)
    }

    getPrice().then(setState)
    handleGetPrice()

    return () => {
      if (timeoutRef) clearTimeout(timeoutRef)
    }
  }, [setState, getPrice])

  return (
    <Card>
      <MachineHeader
        header="Candy Machine"
        subtitle="Use GC Tokens to buy candies! How many you get depends on the market price of sugar."
        tags={
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              alignItems: 'flex-end',
              alignSelf: 'start',
              marginTop: '0.5rem',
            }}
          >
            <Tag color="pink" icon="market">
              Market price estimate: {candyPrice} candies/GC
            </Tag>
            {hasMemberCard && (
              <Tag color="green">50% off with GC Member Card</Tag>
            )}
          </div>
        }
      />
      <MachineOptions
        disableSendButton={disableSendButton}
        id="candy"
        price={candyPrice}
        image={
          <Image src={CandyMachineImage} alt="me" width="176" height="282" />
        }
        priceCalculationFn={(inputTokenValue, price, accountHasMemberCard) =>
          accountHasMemberCard
            ? Math.floor(inputTokenValue * price * 2)
            : Math.floor(inputTokenValue * price)
        }
        accounts={accounts}
        inputTokenName="GC Tokens"
        outputTokenName="Candies"
        onSubmit={onSubmit}
      ></MachineOptions>
    </Card>
  )
}

import { Card } from '../../base-components/card'
import { Tag } from '../../base-components/tag'
import Image from 'next/image'
import {
  MachineOptions,
  MachineOptionsProps,
} from '../components/machine-options/MachineOptions'
import { MachineHeader } from '../components/machine-header/MachineHeader'
import { AccountWithTokens } from '@/app/hooks/useAccounts'
import { hasMemberCard as hasMemberCardFn } from '@/app/helpers/hasMemberCard'
import GumballMachineImage from '../../../../../public/assets/gumball-machine.png'

export const GumballMachine = ({
  accounts,
  onSubmit,
  disableSendButton,
}: {
  accounts: AccountWithTokens[]
  onSubmit: MachineOptionsProps['onSubmit']
  disableSendButton?: boolean
}) => {
  const hasMemberCard = hasMemberCardFn(accounts)
  const priceCalculationFn = (
    inputTokenValue: number,
    price: number,
    accountHasMemberCard: boolean
  ) =>
    accountHasMemberCard
      ? Math.floor((inputTokenValue / price) * 2)
      : Math.floor(inputTokenValue / price)

  const price = 2

  return (
    <Card>
      <MachineHeader
        header="Gumball Machine"
        subtitle="Use GC Tokens to buy Gumballs!"
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
            <Tag color="blue">2 GC = 1 Gumball</Tag>
            {hasMemberCard && (
              <Tag color="green">50% off with GC Member Card</Tag>
            )}
          </div>
        }
      />
      <MachineOptions
        disableSendButton={disableSendButton}
        id="gumball"
        price={price}
        image={
          <Image src={GumballMachineImage} alt="me" width="190" height="305" />
        }
        priceCalculationFn={priceCalculationFn}
        accounts={accounts}
        inputTokenName="GC Tokens"
        outputTokenName="Gumballs"
        onSubmit={(value) => {
          const inputValueWithoutChange = value.memberCard
            ? value.inputTokenValue
            : Math.floor(value.inputTokenValue / price) * price
          return onSubmit({
            ...value,
            inputTokenValue: inputValueWithoutChange,
          })
        }}
      ></MachineOptions>
    </Card>
  )
}

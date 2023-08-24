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

export const GumballMachine = ({
  accounts,
  onSubmit,
}: {
  accounts: AccountWithTokens[]
  onSubmit: MachineOptionsProps['onSubmit']
}) => {
  const hasMemberCard = hasMemberCardFn(accounts)
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
        id="gumball"
        price={2}
        image={
          <Image
            src="/assets/gumball-machine.png"
            alt="me"
            width="190"
            height="305"
          />
        }
        priceCalculationFn={(inputTokenValue, price, accountHasMemberCard) =>
          accountHasMemberCard
            ? Math.floor((inputTokenValue / price) * 2)
            : Math.floor(inputTokenValue / price)
        }
        accounts={accounts}
        inputTokenName="GC Tokens"
        outputTokenName="Gumballs"
        onSubmit={onSubmit}
      ></MachineOptions>
    </Card>
  )
}

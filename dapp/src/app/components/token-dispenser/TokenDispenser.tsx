'use client'
import { AccountPicker } from '../base-components/account-picker/AccountPicker'
import { Card } from '../base-components/card'
import { Tag } from '../base-components/tag'
import { Text } from '../base-components/text'
import styles from './TokenDispenser.module.css'
import { useEffect, useState } from 'react'
import { Button } from '../base-components/button'
import { WalletDataStateAccount } from '@radixdlt/radix-dapp-toolkit'

export const TokenDispenser = ({
  accounts,
  onSubmit,
  disableSendButton,
}: {
  hasXrd: boolean
  accounts: WalletDataStateAccount[]
  onSubmit: (selectedAccount: string) => void
  disableSendButton?: boolean
}) => {
  const [{ selectedAccount }, setState] = useState<{
    selectedAccount?: string
  }>({})

  useEffect(() => {
    if (selectedAccount) {
      const selectedAccountExists = accounts.some(
        (account) => account.address === selectedAccount
      )
      if (!selectedAccountExists) setState({ selectedAccount: undefined })
    }
  }, [selectedAccount, accounts])

  const isButtonDisabled = !selectedAccount || accounts.length === 0

  return (
    <Card className={styles.card} outerClassName={styles['outer-card']}>
      <div>
        <Text variant="header">Gumball Club Token Dispenser</Text>
        <Text variant="paragraph" className="mb-1">
          Start here! Get some GC Tokens and use them to buy Gumballs or Candy!
        </Text>
        <Tag color="blue">Receive 20 GC Tokens</Tag>
      </div>
      <AccountPicker
        accounts={accounts}
        selected={selectedAccount}
        onSelect={(selectedAccount) =>
          setState((prev) => ({ ...prev, selectedAccount }))
        }
      />
      <Button
        icon="external-link"
        disabled={isButtonDisabled || disableSendButton}
        onClick={() => {
          if (selectedAccount) {
            onSubmit(selectedAccount)
          }
        }}
      >
        Send to the Radix Wallet
      </Button>
    </Card>
  )
}

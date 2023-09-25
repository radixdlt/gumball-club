'use client'

import styles from './GumballMachine.module.css'
import { AccountPicker } from '../../../base-components/account-picker/AccountPicker'
import { Input } from '../../../base-components/input/Input'
import { Border } from '../../../base-components/border/Border'
import { ReactNode, useEffect, useState } from 'react'
import { Button } from '../../../base-components/button'
import { AccountWithTokens } from '@/app/hooks/useAccounts'
import { config } from '@/app/config'
import BigNumber from 'bignumber.js'
import { getMemberCard } from '@/app/helpers/hasMemberCard'
import { NonFungibleResource } from '@/app/transformers/addTokens'

export type MachineOptionsProps = {
  id: 'gumball' | 'candy' | 'member'
  accounts: AccountWithTokens[]
  outputTokenName: string
  inputTokenName: string
  image: ReactNode
  onSubmit: (value: {
    selectedAccountAddress: string
    inputTokenValue: number
    outputTokenValue: number
    memberCard?: NonFungibleResource
    change?: number
  }) => void
  price: number
  priceCalculationFn?: (
    inputTokenValue: number,
    price: number,
    hasMemberCard: boolean
  ) => number
  disabled?: boolean
  defaultInputTokenValue?: number
  disableSendButton?: boolean
}

export const MachineOptions = ({
  id,
  accounts,
  outputTokenName,
  inputTokenName,
  image,
  onSubmit,
  price,
  disabled,
  defaultInputTokenValue = 0,
  priceCalculationFn,
  disableSendButton,
}: MachineOptionsProps) => {
  const isDisabled = accounts.length === 0
  const [{ selectedAccountAddress, inputTokenValue, isValid }, setState] =
    useState<{
      selectedAccountAddress?: string
      inputTokenValue: number
      isValid: boolean
    }>({ inputTokenValue: defaultInputTokenValue, isValid: false })

  const accountMap = accounts.reduce<Record<string, AccountWithTokens>>(
    (acc, account) => ({ ...acc, [account.address]: account }),
    {}
  )

  const selectedAccount = accountMap[selectedAccountAddress || '']

  const gcTokens =
    selectedAccount?.fungibleTokens[config.addresses.gumballClubTokensResource]
      ?.value

  const invalidInput = new BigNumber(inputTokenValue).gt(gcTokens || 0)

  const memberCard = selectedAccount
    ? getMemberCard(selectedAccount)
    : undefined

  const hasMemberCard = !!memberCard

  const outputTokenValue = priceCalculationFn
    ? priceCalculationFn(inputTokenValue, price, hasMemberCard)
    : Math.floor(inputTokenValue / price)

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isValid: !!selectedAccountAddress && outputTokenValue >= 1,
    }))
  }, [selectedAccountAddress, outputTokenValue, setState])

  return (
    <>
      <div className={styles.content}>
        {image}
        <div className={styles.options}>
          <AccountPicker
            className="mb-2"
            accounts={accounts}
            selected={selectedAccountAddress}
            onSelect={(selectedAccountAddress) =>
              setState((prev) => ({
                ...prev,
                selectedAccountAddress,
                inputTokenValue: defaultInputTokenValue,
              }))
            }
          />
          <Input
            value={inputTokenValue}
            disabled={isDisabled || disabled}
            onChange={(ev) => {
              setState((prev) => ({
                ...prev,
                inputTokenValue: Number(ev.target.value),
              }))
            }}
            className="mb-1"
            tokenBalance={gcTokens}
            error={
              invalidInput && selectedAccountAddress
                ? 'Not enough GC Tokens in account'
                : undefined
            }
          >
            {inputTokenName}
          </Input>
          <Border className="mb-1" />
          <Input
            disabled
            value={outputTokenValue}
            hint={
              hasMemberCard && id !== 'member'
                ? 'Includes 50% GC Member Card discount'
                : undefined
            }
            after={
              id === 'candy' && inputTokenValue > 0 && selectedAccount ? (
                <div
                  className={styles.guarantees}
                  style={{ bottom: hasMemberCard ? '-3.5rem' : '-2.5rem' }}
                >
                  ⚠️ Set your own guarantees on estimated returns in your Radix
                  Wallet!
                </div>
              ) : null
            }
          >
            {id === 'candy' ? (
              <div>
                Candies
                <div className="small">
                  <strong>Estimated</strong> <span>at market price</span>
                </div>
              </div>
            ) : (
              outputTokenName
            )}
          </Input>
        </div>
      </div>
      <Button
        disabled={!isValid || isDisabled || invalidInput || disableSendButton}
        icon="external-link"
        onClick={() => {
          if (isValid) {
            onSubmit({
              selectedAccountAddress: selectedAccountAddress!,
              inputTokenValue,
              outputTokenValue,
              memberCard,
            })
            setState((prev) => ({
              ...prev,
              inputTokenValue: defaultInputTokenValue,
            }))
          }
        }}
      >
        Send to the Radix Wallet
      </Button>
    </>
  )
}

"use client"

import styles from "./GumballMachine.module.css"
import { AccountPicker } from "../../../base-components/account-picker/AccountPicker"
import { Input } from "../../../base-components/input/Input"
import { Border } from "../../../base-components/border/Border"
import { ReactNode, useEffect, useState } from "react"
import { Button } from "../../../base-components/button"
import { AccountWithFungibleTokens } from "@/app/hooks/useAccounts"
import { config } from "@/app/config"
import BigNumber from "bignumber.js"

export const MachineOptions = ({
  accounts,
  outputTokenName,
  inputTokenName,
  image,
  onSubmit,
  price,
  disabled,
  defaultInputTokenValue = 0,
  priceCalculationFn,
}: {
  accounts: AccountWithFungibleTokens[]
  outputTokenName: string
  inputTokenName: string
  image: ReactNode
  onSubmit: (value: {
    selectedAccount: string
    inputTokenValue: number
    outputTokenValue: number
  }) => void
  price: number
  priceCalculationFn?: (inputTokenValue: number, price: number) => number
  disabled?: boolean
  defaultInputTokenValue?: number
}) => {
  const isDisabled = accounts.length === 0
  const [{ selectedAccount, inputTokenValue, isValid }, setState] = useState<{
    selectedAccount?: string
    inputTokenValue: number
    isValid: boolean
  }>({ inputTokenValue: defaultInputTokenValue, isValid: false })

  const outputTokenValue = priceCalculationFn
    ? priceCalculationFn(inputTokenValue, price)
    : Math.floor(inputTokenValue / price)

  const gcTokens = accounts.find(
    (account) => selectedAccount === account.address
  )?.fungibleTokens[config.addresses.gumballClubTokensResource]?.value

  const invalidInput = new BigNumber(inputTokenValue).gt(gcTokens || 0)

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isValid: !!selectedAccount && outputTokenValue >= 1,
    }))
  }, [selectedAccount, outputTokenValue, setState])

  return (
    <>
      <div className={styles.content}>
        {image}
        <div className={styles.options}>
          <AccountPicker
            className="mb-2"
            accounts={accounts}
            selected={selectedAccount}
            onSelect={(selectedAccount) =>
              setState((prev) => ({ ...prev, selectedAccount }))
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
              invalidInput && selectedAccount
                ? "Not enough GC Tokens in account"
                : undefined
            }
          >
            {inputTokenName}
          </Input>
          <Border className="mb-1" />
          <Input disabled value={outputTokenValue}>
            {outputTokenName}
          </Input>
        </div>
      </div>
      <Button
        disabled={!isValid || isDisabled || invalidInput}
        icon="external-link"
        onClick={() => {
          if (isValid) {
            onSubmit({
              selectedAccount: selectedAccount!,
              inputTokenValue,
              outputTokenValue,
            })
            setState((prev) => ({
              ...prev,
              inputTokenValue: defaultInputTokenValue,
              selectedAccount: undefined,
            }))
          }
        }}
      >
        Send to the Radix Wallet
      </Button>
    </>
  )
}

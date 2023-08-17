"use client"

import styles from "./GumballMachine.module.css"
import { AccountPicker } from "../../../base-components/account-picker/AccountPicker"
import { Input } from "../../../base-components/input/Input"
import { Border } from "../../../base-components/border/Border"
import { Account } from "@/app/types"
import { ReactNode, useEffect, useState } from "react"
import { Button } from "../../../base-components/button"

export const MachineOptions = ({
  accounts,
  outputTokenName,
  inputTokenName,
  image,
  onSubmit,
  price,
}: {
  accounts: Account[]
  outputTokenName: string
  inputTokenName: string
  image: ReactNode
  onSubmit: (value: {
    selectedAccount: string
    inputTokenValue: number
  }) => void
  price: number
}) => {
  const isDisabled = accounts.length === 0
  const [{ selectedAccount, inputTokenValue, isValid }, setState] = useState<{
    selectedAccount?: string
    inputTokenValue: number
    isValid: boolean
  }>({ inputTokenValue: 0, isValid: false })

  const outputTokenValue = Math.floor(inputTokenValue / price)

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
            disabled={isDisabled}
            onChange={(ev) => {
              setState((prev) => ({
                ...prev,
                inputTokenValue: Number(ev.target.value),
              }))
            }}
            className="mb-1"
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
        disabled={!isValid || isDisabled}
        icon="external-link"
        onClick={() => {
          if (isValid)
            onSubmit({ selectedAccount: selectedAccount!, inputTokenValue })
        }}
      >
        Send to the Radix Wallet
      </Button>
    </>
  )
}

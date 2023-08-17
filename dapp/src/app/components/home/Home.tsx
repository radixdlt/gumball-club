"use client"

import { useAccounts } from "@/app/hooks/useAccounts"
import { Header } from "../header/Header"
import { CandyBagMachine } from "../machines/candybag-machine/CandyBagMachine"
import { GumballMachine } from "../machines/gumball-machine/GumballMachine"
import { TokenDispenser } from "../token-dispenser/TokenDispenser"
import { MembershipMachine } from "../machines/membership-machine/MembershipMachine"
import styles from "./Home.module.css"
import { Footer } from "../footer/Footer"
import { useWellKnownAddresses } from "@/app/hooks/useWellKnownAddresses"
import BigNumber from "bignumber.js"
import { usePersona } from "@/app/hooks/usePersona"
import { animated, useSpring } from "@react-spring/web"
import { useEffect } from "react"

export const Home = () => {
  const {
    state: { accounts, status, hasLoaded: hasAccountsLoaded },
  } = useAccounts()

  const { hasLoaded: hasPersonaLoaded } = usePersona()

  const wellKnownAddresses = useWellKnownAddresses()

  const [style, api] = useSpring(() => ({
    from: { opacity: 0 },
  }))

  const isLoading =
    !hasAccountsLoaded || !hasPersonaLoaded || !wellKnownAddresses

  useEffect(() => {
    if (!isLoading) api.start({ opacity: 1 })
  }, [isLoading])

  if (isLoading) return null

  const xrdAddress = wellKnownAddresses?.xrd
  const hasXrd = accounts.some(
    (account) =>
      account.fungibleTokens[xrdAddress] &&
      new BigNumber(account.fungibleTokens[xrdAddress].value).gt(0)
  )

  const isAccountsLoading = status === "pending"

  return (
    <animated.div className={styles.home} style={style}>
      <Header
        className={styles.header}
        accounts={accounts}
        hasXrd={hasXrd}
        accountsLoading={isAccountsLoading}
      />
      <main className={styles.main}>
        <TokenDispenser
          hasXrd={hasXrd}
          accounts={accounts}
          onSubmit={() => {}}
        />
        <div className={styles.machines}>
          <GumballMachine accounts={accounts} onSubmit={() => {}} />
          <CandyBagMachine price={2} accounts={accounts} onSubmit={() => {}} />
          {false && (
            <MembershipMachine accounts={accounts} onSubmit={() => {}} />
          )}
        </div>
        <Footer />
      </main>
    </animated.div>
  )
}

'use client'

import { AccountWithTokens, useAccounts } from '@/app/hooks/useAccounts'
import { Header } from '../header/Header'
import { CandyBagMachine } from '../machines/candybag-machine/CandyBagMachine'
import { GumballMachine } from '../machines/gumball-machine/GumballMachine'
import { TokenDispenser } from '../token-dispenser/TokenDispenser'
import { MembershipMachine } from '../machines/membership-machine/MembershipMachine'
import styles from './Home.module.css'
import { Footer } from '../footer/Footer'
import { useWellKnownAddresses } from '@/app/hooks/useWellKnownAddresses'
import BigNumber from 'bignumber.js'
import { usePersona } from '@/app/hooks/usePersona'
import { animated, useSpring } from '@react-spring/web'
import { useEffect, useState } from 'react'
import { useSendTransactionManifest } from '@/app/hooks/useSendTransactionManifest'
import { hasFungibleTokens } from '@/app/helpers/getAccountTokens'
import { config } from '@/app/config'
import { HomeModule, ModalKind } from './components/HomeModule'
import { useConnectButtonState } from '@/app/hooks/useConnectButtonState'

export const Home = () => {
  const {
    refresh,
    state: { accounts, status, hasLoaded: hasAccountsLoaded },
  } = useAccounts()
  const { dispenseGcTokens, buyGumball, buyCandy, buyMemberCard } =
    useSendTransactionManifest()()

  const connectButtonState = useConnectButtonState()

  const isConnectButtonPending = connectButtonState === 'pending'

  const [state, setState] = useState<
    Partial<{
      showModal: ModalKind
      account: AccountWithTokens
      outputTokenValue: number
      shouldShowMemberRevealModal: boolean
    }>
  >()

  const { hasLoaded: hasPersonaLoaded } = usePersona()

  const wellKnownAddresses = useWellKnownAddresses()

  const [style, api] = useSpring(() => ({
    from: { opacity: 0 },
  }))

  const isLoading =
    !hasAccountsLoaded || !hasPersonaLoaded || !wellKnownAddresses

  useEffect(() => {
    if (!isLoading) api.start({ opacity: 1 })
  }, [isLoading, api])

  if (isLoading) return null

  const xrdAddress = wellKnownAddresses?.xrd
  const hasXrd = accounts.some(
    (account) =>
      account.fungibleTokens[xrdAddress] &&
      new BigNumber(account.fungibleTokens[xrdAddress].value).gt(0)
  )

  const isAccountsLoading = status === 'pending'

  const hasGcTokens = hasFungibleTokens(
    accounts,
    config.addresses.gumballClubTokensResource
  )

  const hasGumTokens = hasFungibleTokens(
    accounts,
    config.addresses.gumballResource
  )

  const hasCandyTokens = hasFungibleTokens(
    accounts,
    config.addresses.candyTokenResource
  )

  const handleDismissModal = (onDismiss?: () => void) => {
    setState((prev) => ({
      ...prev,
      showModal: undefined,
    }))

    // wait for animation to finish before resetting account state
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        account: undefined,
        outputTokenValue: undefined,
        shouldShowMemberRevealModal: false,
        showModal: state?.shouldShowMemberRevealModal
          ? 'memberReveal'
          : undefined,
      }))
    }, 1000)
  }

  const handleShowModal = (
    showModal: 'tokenDispenser' | 'gumball' | 'candy' | 'member',
    selectedAccountAddress: string,
    outputTokenValue?: number,
    shouldShowMemberRevealModal?: boolean
  ) =>
    setState((prev) => ({
      ...prev,
      showModal,
      account: accounts.find(
        (account) => account.address === selectedAccountAddress
      ),
      outputTokenValue,
      shouldShowMemberRevealModal,
    }))

  return (
    <>
      <HomeModule
        outputTokenValue={state?.outputTokenValue}
        show={state?.showModal}
        onDismiss={() => handleDismissModal()}
        account={state?.account}
      />

      <animated.div className={styles.home} style={style}>
        <Header
          className={styles.header}
          accounts={accounts}
          hasXrd={hasXrd}
          accountsLoading={isAccountsLoading}
        />
        <main className={styles.main}>
          <TokenDispenser
            disableSendButton={isConnectButtonPending}
            hasXrd={hasXrd}
            accounts={accounts}
            onSubmit={(selectedAccountAddress: string) => {
              dispenseGcTokens(selectedAccountAddress)
                .map(refresh)
                .map(() =>
                  handleShowModal('tokenDispenser', selectedAccountAddress)
                )
            }}
          />
          <div className={styles.machines}>
            <GumballMachine
              disableSendButton={isConnectButtonPending}
              accounts={accounts}
              onSubmit={({
                selectedAccountAddress,
                inputTokenValue,
                outputTokenValue,
                memberCard,
              }) => {
                const shouldShowMemberRevealModal =
                  !hasGumTokens && !hasCandyTokens
                debugger
                buyGumball({
                  accountAddress: selectedAccountAddress,
                  inputTokenValue,
                  outputTokenValue,
                  memberCard,
                })
                  .map(refresh)
                  .map(() =>
                    handleShowModal(
                      'gumball',
                      selectedAccountAddress,
                      outputTokenValue,
                      shouldShowMemberRevealModal
                    )
                  )
              }}
            />
            <CandyBagMachine
              disableSendButton={isConnectButtonPending}
              price={2}
              accounts={accounts}
              onSubmit={({
                selectedAccountAddress,
                inputTokenValue,
                outputTokenValue,
                memberCard,
              }) => {
                const shouldShowMemberRevealModal =
                  !hasGumTokens && !hasCandyTokens
                buyCandy({
                  accountAddress: selectedAccountAddress,
                  inputTokenValue,
                  memberCard,
                })
                  .map(refresh)
                  .map(() =>
                    handleShowModal(
                      'candy',
                      selectedAccountAddress,
                      outputTokenValue,
                      shouldShowMemberRevealModal
                    )
                  )
              }}
            />
            {hasGcTokens && (
              <MembershipMachine
                disableSendButton={isConnectButtonPending}
                accounts={accounts}
                onSubmit={({
                  selectedAccountAddress,
                  inputTokenValue,
                  outputTokenValue,
                }) =>
                  buyMemberCard({
                    accountAddress: selectedAccountAddress,
                    inputTokenValue,
                  })
                    .map(refresh)
                    .map(() =>
                      handleShowModal(
                        'member',
                        selectedAccountAddress,
                        outputTokenValue
                      )
                    )
                }
              />
            )}
          </div>
          <Footer />
        </main>
      </animated.div>
    </>
  )
}

import Image from 'next/image'
import styles from './Header.module.css'
import { Hero } from '../base-components/hero/Hero'
import { AccountWithTokens } from '@/app/hooks/useAccounts'
import { InsufficientXrdAlert } from './InsufficientXrdAlert'
import React, { useEffect, useRef } from 'react'
import { useConnectButtonState } from '@/app/hooks/useConnectButtonState'
import { Tooltip } from '../base-components/tooltip/Tooltip'
import { usePersona } from '@/app/hooks/usePersona'
import { usePersonaData } from '@/app/hooks/usePersonaData'
import ConnectArrow from '../../../../public/assets/connect-arrow.svg'
import Logo from '../../../../public/assets/logo.png'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'radix-connect-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
    }
  }
}

const ConnectHelper = () => (
  <Image
    className={styles['connect-arrow']}
    src={ConnectArrow}
    height={104}
    width={251}
    alt="connect helper"
  />
)

export const Header = ({
  className = '',
  hasXrd,
  accounts = [],
  accountsLoading = false,
}: {
  className?: string
  hasXrd?: boolean
  accounts?: AccountWithTokens[]
  accountsLoading?: boolean
}) => {
  const { persona } = usePersona()
  const connectButtonState = useConnectButtonState()
  const personaData = usePersonaData()
  const [state, setState] = React.useState<{
    hideTooltip: boolean
    isPopoverOpen: boolean
    insufficientXrdAlertDismissed: boolean
  }>({
    hideTooltip: false,
    isPopoverOpen: false,
    insufficientXrdAlertDismissed: false,
  })
  const ref = useRef<any>(null)

  const showConnectHelper =
    accounts.length === 0 && connectButtonState === 'default'

  const showTooltip =
    !state.hideTooltip &&
    !state.isPopoverOpen &&
    connectButtonState === 'pending'

  const showInsufficientXrdAlert =
    !!persona &&
    !accountsLoading &&
    !state.insufficientXrdAlertDismissed &&
    !hasXrd

  useEffect(() => {
    if (state.hideTooltip && connectButtonState !== 'pending') {
      setState((prev) => ({ ...prev, hideTooltip: false, popoverOpen: false }))
    }

    const handlePopoverState = () => {
      const isPopoverOpen = !!ref.current?.showPopover
      if (state.isPopoverOpen !== isPopoverOpen)
        setState((prev) => ({ ...prev, isPopoverOpen }))
    }

    document.addEventListener('click', handlePopoverState)

    return () => {
      document.removeEventListener('click', handlePopoverState)
    }
  }, [connectButtonState, state, setState, ref])

  return (
    <header className={`${className}`}>
      <div className={`${styles.header} `}>
        <Image src={Logo} height={42} width={139} alt="logo" />
        <div className={styles['radix-connect-button']}>
          <radix-connect-button ref={ref} />
          {showConnectHelper ? <ConnectHelper /> : null}
          {showTooltip && (
            <Tooltip
              className={styles.tooltip}
              onClose={() =>
                setState((prev) => ({ ...prev, hideTooltip: true }))
              }
            >
              You have a request waiting! Open your Radix Wallet mobile app to
              review and approve.
            </Tooltip>
          )}
        </div>
      </div>
      <Hero persona={persona} personaDataName={personaData.fullName} />
      <InsufficientXrdAlert
        show={showInsufficientXrdAlert}
        onClose={() => {
          setState((prev) => ({
            ...prev,
            insufficientXrdAlertDismissed: true,
          }))
        }}
        onGetXrd={() => {}}
      />
    </header>
  )
}

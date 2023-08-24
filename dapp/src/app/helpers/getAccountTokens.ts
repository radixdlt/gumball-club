import BigNumber from 'bignumber.js'
import { AccountWithTokens } from '../hooks/useAccounts'

export const getAccountTokens = (
  accounts: AccountWithTokens[],
  accountAddress: string,
  resourceAddress: string
) =>
  accounts.find((account) => accountAddress === account.address)
    ?.fungibleTokens[resourceAddress].value

export const hasFungibleTokens = (
  accounts: AccountWithTokens[],
  resourceAddress: string
) =>
  accounts
    .reduce(
      (acc, account) =>
        acc.plus(account.fungibleTokens[resourceAddress]?.value || 0),
      new BigNumber(0)
    )
    .gt(0)

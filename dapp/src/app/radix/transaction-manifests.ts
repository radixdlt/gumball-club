import { ResourceAddresses } from '../config'
import { AccountWithMemberCard } from '../helpers/hasMemberCard'

export const TransactionManifests = ({
  gumballClubComponent,
  gumballClubTokensResource,
  gumballMachineComponent,
  candyMachineComponent,
  gumballResource,
  gumballClubMemberCardResource,
}: ResourceAddresses) => {
  const dispenseGcTokens = (accountAddress: string) => {
    const transactionManifest = `
        CALL_METHOD
            Address("${gumballClubComponent}")
            "dispense_gc_tokens"
        ;
        TAKE_FROM_WORKTOP
            Address("${gumballClubTokensResource}")
            Decimal("20")
            Bucket("gcTokensBucket")
        ;
        CALL_METHOD
            Address("${accountAddress}")
            "deposit"
            Bucket("gcTokensBucket")
        ;
    `
    console.log(transactionManifest)
    return transactionManifest
  }

  const buyGumball = ({
    accountAddress,
    inputTokenValue,
    outputTokenValue,
    accountWithMemberCard,
    change,
  }: {
    accountAddress: string
    inputTokenValue: number
    outputTokenValue: number
    accountWithMemberCard?: AccountWithMemberCard
    change?: number
  }) => {
    const transactionManifest = accountWithMemberCard
      ? `
        CALL_METHOD
            Address("${accountWithMemberCard.account.address}")
            "create_proof_of_non_fungibles"
            Address("${accountWithMemberCard.memberCard.address}")
            Array<NonFungibleLocalId>(
                NonFungibleLocalId("${accountWithMemberCard.memberCard.id}")
            )
        ;
        CALL_METHOD
            Address("${accountAddress}")
            "withdraw"
            Address("${gumballClubTokensResource}")
            Decimal("${inputTokenValue}")
        ;
        TAKE_FROM_WORKTOP
            Address("${gumballClubTokensResource}")
            Decimal("${inputTokenValue}")
            Bucket("gumball_club_token_bucket")
        ;
        CALL_METHOD
            Address("${gumballMachineComponent}")
            "buy_gumball_with_member_card"
            Bucket("gumball_club_token_bucket")
        ;
        TAKE_FROM_WORKTOP
            Address("${gumballResource}")
            Decimal("${outputTokenValue}")
            Bucket("gumball_bucket")
        ;
        CALL_METHOD
            Address("${accountAddress}")
            "deposit"
            Bucket("gumball_bucket")
        ;
        `
      : `
        CALL_METHOD
          Address("${accountAddress}")
          "withdraw"
          Address("${gumballClubTokensResource}")
          Decimal("${
            change && change > 0 ? inputTokenValue + change : inputTokenValue
          }")
        ;
        TAKE_FROM_WORKTOP
            Address("${gumballClubTokensResource}")
            Decimal("${inputTokenValue}")
            Bucket("gumball_club_token_bucket")
        ;
        CALL_METHOD
            Address("${gumballMachineComponent}")
            "buy_gumball"
            Bucket("gumball_club_token_bucket")
        ;
        TAKE_FROM_WORKTOP
            Address("${gumballResource}")
            Decimal("${outputTokenValue}")
            Bucket("gumball_bucket")
        ;
        CALL_METHOD
            Address("${accountAddress}")
            "deposit"
            Bucket("gumball_bucket")
        ;
        ${
          change && change > 0
            ? `
        TAKE_FROM_WORKTOP
          Address("${gumballClubTokensResource}")
          Decimal("${change}")
          Bucket("change_bucket")
        ;
        CALL_METHOD
            Address("${accountAddress}")
            "deposit"
            Bucket("change_bucket")
        ;
        `
            : ``
        }
  `
    console.log(transactionManifest)
    return transactionManifest
  }

  const buyCandy = ({
    accountAddress,
    inputTokenValue,
    accountWithMemberCard,
  }: {
    accountAddress: string
    inputTokenValue: number
    accountWithMemberCard?: AccountWithMemberCard
  }) =>
    accountWithMemberCard
      ? `
        CALL_METHOD
            Address("${accountWithMemberCard.account.address}")
            "create_proof_of_non_fungibles"
            Address("${accountWithMemberCard.memberCard.address}")
            Array<NonFungibleLocalId>(
                NonFungibleLocalId("${accountWithMemberCard.memberCard.id}")
            )
        ;
        CALL_METHOD
            Address("${accountAddress}")
            "withdraw"
            Address("${gumballClubTokensResource}")
            Decimal("${inputTokenValue}")
        ;
        TAKE_FROM_WORKTOP
            Address("${gumballClubTokensResource}")
            Decimal("${inputTokenValue}")
            Bucket("gumball_club_token_bucket")
        ;
        CALL_METHOD
            Address("${candyMachineComponent}")
            "buy_candy_with_member_card"
            Bucket("gumball_club_token_bucket")
        ;
        CALL_METHOD
            Address("${accountAddress}")
            "deposit_batch"
            Expression("ENTIRE_WORKTOP")
        ;  
    `
      : `
        CALL_METHOD
            Address("${accountAddress}")
            "withdraw"
            Address("${gumballClubTokensResource}")
            Decimal("${inputTokenValue}")
        ;
        TAKE_FROM_WORKTOP
            Address("${gumballClubTokensResource}")
            Decimal("${inputTokenValue}")
            Bucket("gumball_club_token_bucket")
        ;
        CALL_METHOD
            Address("${candyMachineComponent}")
            "buy_candy"
            Bucket("gumball_club_token_bucket")
        ;
        CALL_METHOD
            Address("${accountAddress}")
            "deposit_batch"
            Expression("ENTIRE_WORKTOP")
        ;
    `
  const buyMemberCard = ({
    accountAddress,
    inputTokenValue,
  }: {
    accountAddress: string
    inputTokenValue: number
  }) => {
    const transactionManifest = `
    CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${gumballClubTokensResource}")
        Decimal("${inputTokenValue}")
    ;
    TAKE_FROM_WORKTOP
        Address("${gumballClubTokensResource}")
        Decimal("${inputTokenValue}")
        Bucket("gumball_club_token_bucket")
    ;
    CALL_METHOD
        Address("${gumballClubComponent}")
        "buy_member_card"
        Bucket("gumball_club_token_bucket")
    ;
    TAKE_FROM_WORKTOP
        Address("${gumballClubMemberCardResource}")
        Decimal("1")
        Bucket("member_card_bucket")
    ;
    CALL_METHOD
        Address("${accountAddress}")
        "deposit"
        Bucket("member_card_bucket")
    ;
  `
    console.log(transactionManifest)
    return transactionManifest
  }

  return { dispenseGcTokens, buyGumball, buyCandy, buyMemberCard }
}

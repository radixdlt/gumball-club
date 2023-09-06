import { ResourceAddresses } from '../config'
import { NonFungibleResource } from '../transformers/addTokens'

export const TransactionManifests = ({
  gumballClubComponent,
  gumballClubTokensResource,
  gumballMachineComponent,
  candyMachineComponent,
  gumballResource,
  gumballClubMemberCardResource,
}: ResourceAddresses) => {
  const dispenseGcTokens = (accountAddress: string) => `
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

  const buyGumball = ({
    accountAddress,
    inputTokenValue,
    outputTokenValue,
    memberCard,
  }: {
    accountAddress: string
    inputTokenValue: number
    outputTokenValue: number
    memberCard?: NonFungibleResource
  }) => {
    const transactionManifest = memberCard
      ? `
        CALL_METHOD
            Address("${accountAddress}")
            "create_proof_of_non_fungibles"
            Address("${memberCard.address}")
            Array<NonFungibleLocalId>(
                NonFungibleLocalId("${memberCard.id}")
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
            Address("${gumballClubTokensResource}")
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
            Decimal("${inputTokenValue}")
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
  `
    console.log(transactionManifest)
    return transactionManifest
  }

  const buyCandy = ({
    accountAddress,
    inputTokenValue,
    memberCard,
  }: {
    accountAddress: string
    inputTokenValue: number
    memberCard?: NonFungibleResource
  }) =>
    memberCard
      ? `
        CALL_METHOD
            Address("${accountAddress}")
            "create_proof_of_non_fungibles"
            Address("${memberCard.address}")
            Array<NonFungibleLocalId>(
                NonFungibleLocalId("${memberCard.id}")
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
  }) => `
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

  return { dispenseGcTokens, buyGumball, buyCandy, buyMemberCard }
}

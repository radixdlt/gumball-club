import { ResourceAddresses } from '../config'
import { NonFungibleResource } from '../transformers/addTokens'

export const TransactionManifests = ({
  gumballClubComponent,
  gumballClubTokensResource,
  gumballMachineComponent,
  candyMachineComponent,
}: ResourceAddresses) => {
  const dispenseGcTokens = (accountAddress: string) => `
        CALL_METHOD
            Address("${gumballClubComponent}")
            "dispense_gc_tokens"
        ;
        TAKE_ALL_FROM_WORKTOP
            Address("${gumballClubTokensResource}")
            Bucket("bucket1")
        ;
        CALL_METHOD
            Address("${accountAddress}")
            "deposit"
            Bucket("bucket1")
        ;
    `

  const buyGumball = (
    accountAddress: string,
    gcTokensValue: number,
    memberCard?: NonFungibleResource
  ) =>
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
            Decimal("${gcTokensValue}")
        ;
        TAKE_ALL_FROM_WORKTOP
            Address("${gumballClubTokensResource}")
            Bucket("gumball_club_token_bucket")
        ;
        CALL_METHOD
            Address("${gumballMachineComponent}")
            "buy_gumball_with_member_card"
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
            Decimal("${gcTokensValue}")
        ;
        TAKE_ALL_FROM_WORKTOP
            Address("${gumballClubTokensResource}")
            Bucket("gumball_club_token_bucket")
        ;
        CALL_METHOD
            Address("${gumballMachineComponent}")
            "buy_gumball"
            Bucket("gumball_club_token_bucket")
        ;
        CALL_METHOD
            Address("${accountAddress}")
            "deposit_batch"
            Expression("ENTIRE_WORKTOP")
        ;
  `

  const buyCandy = (
    accountAddress: string,
    gcTokensValue: number,
    memberCard?: NonFungibleResource
  ) =>
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
            Decimal("${gcTokensValue}")
        ;
        TAKE_ALL_FROM_WORKTOP
            Address("${gumballClubTokensResource}")
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
            Decimal("${gcTokensValue}")
        ;
        TAKE_ALL_FROM_WORKTOP
            Address("${gumballClubTokensResource}")
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
  const buyMemberCard = (accountAddress: string, gcTokensValue: number) => `
    CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${gumballClubTokensResource}")
        Decimal("${gcTokensValue}")
    ;
    TAKE_ALL_FROM_WORKTOP
        Address("${gumballClubTokensResource}")
        Bucket("gumball_club_token_bucket")
    ;
    CALL_METHOD
        Address("${gumballClubComponent}")
        "buy_member_card"
        Bucket("gumball_club_token_bucket")
    ;
    CALL_METHOD
        Address("${accountAddress}")
        "deposit_batch"
        Expression("ENTIRE_WORKTOP")
    ;
  `

  return { dispenseGcTokens, buyGumball, buyCandy, buyMemberCard }
}

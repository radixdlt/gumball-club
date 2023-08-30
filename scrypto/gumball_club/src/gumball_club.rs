use scrypto::prelude::*;
use crate::gumball_machine::gumball_machine::GumballMachine;
use crate::gumball_machine::gumball_machine::GumballMachineFunctions;
use crate::candy_machine::candy_machine::CandyMachine;
use crate::candy_machine::candy_machine::CandyMachineFunctions;

/// The `NonFungibleData` structure of the member card NFT badge.
#[derive(ScryptoSbor, NonFungibleData)]
pub struct GumballClubMember {}

#[blueprint]
mod gumball_club {

    /// The `GumballClub` holds these state in its component:

    /// * `gumball_club_token_manager` | `ResourceManager` - Holds the `ResourceManager` of the Gumball Club 
    ///    tokens to reference and mint from.
    /// * `member_card_manager` | `ResourceManager` - Holds the `ResourceManager` of the member card NFT badge 
    ///    to reference and mint from.
    /// * `collected_gc_vault` | `Vault` - A `Vault` that holds and collects all the payment resource in Gumball 
    ///    Club tokens it receives from the member cards it sells.
    /// * `gumball_club_member_counter` | `u64` - Holds and tracks the member card NFT badges is minted and 
    ///    determines its `NonFungibleLocalId`
    struct GumballClub {
        gumball_club_token_manager: ResourceManager,
        member_card_manager: ResourceManager,
        collected_gc_vault: Vault,
        price_per_card: Decimal,
        gumball_club_member_counter: u64,
    }

    impl GumballClub {

    /// The `GumballClub` instantiation function: `instantiate_gumball_club` takes in 3 argument inputs:

    /// 1. `owner_role` | `OwnerRole` - This is to define the "owner" of the components and resource as 
    ///     well as map the `AccessRule` of the owner to a badge address.
    ///     - The `OwnerRole` can be specified to be `Fixed` meaning that the badge address that the `AccessRule`
    ///     is mapped to will forever remain immutable.
    ///     - The `OwnerRole` can be specified to be `Updatable` meaning the badge address that the `AccessRule` 
    ///     is mapped to can be updated by the owner itself.
    ///     - The `OwnerRole` can be specified to `None` meaning that the component and its resources will not 
    ///     have an owner and will not be able to have access to privileged methods nor update the entities metadata.
    ///     - It is important to specify an `OwnerRole` and configure it to a badge address to enable [
    ///     metadata verification](https://docs-babylon.radixdlt.com/main/standards/metadata-for-verification.html).
    /// 2. `price_per_card` | `Decimal` - This is to confgiure the price of the member card that will be minted and 
    ///     sold by the `GumballClub` component.
    /// 3. `price_per_gumball` | `Decimal` - This is the configure the price of the gumball resource minted and sold 
    ///     by the `GumballMachine`.
        pub fn instantiate_gumball_club(
            owner_role: OwnerRole,
            price_per_card: Decimal,
            price_per_gumball: Decimal,
        ) -> (
            Global<GumballClub>, 
            Global<GumballMachine>, 
            Global<CandyMachine>
        ) {

            // Create a `GlobalAddressReservation` and `ComponentAddress` to use as the component's 
            // "virtual actor badge".
            let (address_reservation, component_address) = 
                Runtime::allocate_component_address(
                    BlueprintId::new(&Runtime::package_address(), "GumballClub")
                );     

            // The resource definition for the candy token. This resource has divisibility
            // set to maximum of 18 as the Gumball Club token is designed to be fractionalized.

            // *Resource Behaviors*
            // * Mintable - This resource can be mintable by the minter role.

            // --Roles--
            // * `minter` - The role that has authority to mint this resource. This role's 
            // `AccessRule` is mapped to the component. 
            // * `minter_updater` - The role that has authority to mutate the `AccessRule`
            // of the `minter` role. This role's `AccessRule` is mapped to `DenyAll`, meaning
            // the `minter` will always be the component.

            // --Supply--
            // This resource has no finite supply.
            let gumball_club_token_manager: ResourceManager = 
                ResourceBuilder::new_fungible(owner_role.clone())
                .divisibility(DIVISIBILITY_MAXIMUM)
                .metadata(metadata!(
                    init {
                        "name" => "Gumball Club Tokens", locked;
                        "symbol" => "GC", locked;
                    }
                ))
                .mint_roles(mint_roles! {
                    minter => rule!(require(global_caller(component_address)));
                    minter_updater => rule!(deny_all);
                })
                .create_with_no_initial_supply();

            // The resource definition for the member card. The `NonFungibleLocalId`
            // of this resource is set to `Integer` type.

            // --NonFungibleData--
            // * None

            // *Resource Behaviors*
            // * Mintable - This resource can be mintable by the minter role.

            // --Roles--
            // * `minter` - The role that has authority to mint this resource. This role's 
            // `AccessRule` is mapped to the component. 
            // * `minter_updater` - The role that has authority to mutate the `AccessRule`
            // of the `minter` role. This role's `AccessRule` is mapped to `DenyAll`, meaning
            // the `minter` will always be the component.

            // --Supply--
            // This resource has no finite supply.
            let member_card_manager: ResourceManager = 
                ResourceBuilder::new_integer_non_fungible::<GumballClubMember>(owner_role.clone())
                .metadata(metadata! {
                    init {
                        "name" => "Gumball Club Member Card", locked;
                        "description" => "Use this Gumball Club Member Card to get 50% discount on our sweet machines", locked;
                        "tags" => vec!["badge"], locked;
                    }
                })
                .mint_roles(mint_roles!(
                    minter => rule!(require(global_caller(component_address)));
                    minter_updater => rule!(deny_all);
                ))
                .burn_roles(burn_roles!(
                    burner => rule!(allow_all);
                    burner_updater => rule!(deny_all);
                ))
                .create_with_no_initial_supply();
            
            let gumball_machine: Global<GumballMachine> = 
                Blueprint::<GumballMachine>::instantiate_gumball_machine(
                    owner_role.clone(),
                    gumball_club_token_manager.address(),
                    member_card_manager.address(),
                    price_per_gumball,
                );

            let candy_machine: Global<CandyMachine> =
                Blueprint::<CandyMachine>::instantiate_candy_machine(
                    owner_role.clone(),
                    gumball_club_token_manager.address(), 
                    member_card_manager.address(), 
                );
            
            let gumball_club: Global<GumballClub> = Self {
                gumball_club_token_manager: gumball_club_token_manager,
                member_card_manager: member_card_manager,
                collected_gc_vault: Vault::new(gumball_club_token_manager.address()),
                price_per_card: price_per_card,
                gumball_club_member_counter: 0,
            }
            .instantiate()
            .prepare_to_globalize(owner_role)
            .metadata(metadata! (
                roles {
                    metadata_setter => OWNER;
                    metadata_setter_updater => OWNER;
                    metadata_locker => OWNER;
                    metadata_locker_updater => OWNER;
                },
                init {
                    "name" => "GumballClub Component", locked;
                    "description" => "Use this component to dispense Gumball Club tokens and buy membership cards!", locked;
                }
            ))
            .with_address(address_reservation)
            .globalize();

            return (gumball_club, gumball_machine, candy_machine)

        }

        /// * `dispense_gc_tokens` - This method, when called, mints the caller with 20 Gumball Club tokens. 
        ///    A user may continuously call this method to mint more Gumball Club tokens, 20 at a time.
        
        /// --INPUTS--
        /// * None
        /// --RETURNS--
        /// * `Bucket` - Returns a `Bucket` of Gumball Club token at hardcoded amount of 20.
        pub fn dispense_gc_tokens(&mut self) -> Bucket {
            let gumball_club_tokens = self.gumball_club_token_manager.mint(dec!(20));

            return gumball_club_tokens
        }

        /// * `buy_member_card` - This takes in a payment `Bucket` of Gumball Club tokens. For 5 Gumball Club tokens, 
        ///    the caller will receive 1 Member Card NFT badge.
        
        /// --INPUTS--
        /// * `payment` | `Bucket` - Takes a `Bucket` payment of Gumball Club tokens.
    
        /// --RETURNS--
        /// * `(Bucket, Bucket)` - Returns a tuple of `Bucket`:
        /// 1. Any refunded/leftover payments to the user.
        /// 2. The `Bucket` of member card NFT badge.
        pub fn buy_member_card(&mut self, mut payment: Bucket) -> (Bucket, Bucket) {
            
            assert_eq!(
                payment.resource_address(), self.collected_gc_vault.resource_address(),
                "[GumballClub]: Only Gumball Club tokens are accepted as payments!"
            );

            let actual_payment = payment.take(self.price_per_card);

            self.collected_gc_vault.put(actual_payment);

            self.gumball_club_member_counter += 1;

            let member_card = self.member_card_manager
                .mint_non_fungible(
                    &NonFungibleLocalId::integer(self.gumball_club_member_counter),
                    GumballClubMember {
                    }
                );

            return (member_card, payment)
        }
    }
}

use scrypto::prelude::*;
use crate::gumball_machine::gumball_machine::GumballMachine;
use crate::gumball_machine::gumball_machine::GumballMachineFunctions;
use crate::candy_machine::candy_machine::CandyMachine;
use crate::candy_machine::candy_machine::CandyMachineFunctions;

#[derive(ScryptoSbor, NonFungibleData)]
pub struct GumballClubMember {}

#[blueprint]
mod gumball_club {
    struct GumballClub {
        gumball_club_token_manager: ResourceManager,
        member_card_manager: ResourceManager,
        collected_gc_vault: Vault,
        price_per_card: Decimal,
        gumball_club_member_counter: u64,
    }

    impl GumballClub {
        pub fn instantiate_gumball_club(
            owner_role: OwnerRole,
            price_per_card: Decimal,
            price_per_gumball: Decimal,
        ) -> (
            Global<GumballClub>, 
            Global<GumballMachine>, 
            Global<CandyMachine>
        ) {

            let (address_reservation, component_address) =
                Runtime::allocate_component_address(Runtime::blueprint_id());       
            
            let gumball_club_token_manager: ResourceManager = 
                ResourceBuilder::new_fungible(owner_role.clone())
                .divisibility(DIVISIBILITY_NONE)
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

        
        pub fn dispense_gc_tokens(&mut self) -> Bucket {
            // Currently mint amount hard coded to 20
            let gumball_club_tokens = self.gumball_club_token_manager.mint(dec!(20));

            return gumball_club_tokens
        }

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
                    GumballClubMember {}
                );

            return (member_card, payment)
        }
    }
}

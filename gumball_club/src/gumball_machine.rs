use scrypto::prelude::*;

#[blueprint]
mod gumball_machine {
    enable_method_auth! {
        roles {
            member => updatable_by: [SELF];
        },
        methods {
            buy_gumball => PUBLIC;
            get_price => PUBLIC;
            buy_gumball_with_member_card => restrict_to: [member];
            change_price => restrict_to: [OWNER];
            change_discount => restrict_to: [OWNER];
            change_member_card => restrict_to: [OWNER];
        }
    }
    struct GumballMachine {
        gumball_token_manager: ResourceManager,
        collected_tokens: Vault,
        price_per_gumball: Decimal,
        discount_amount: Decimal,
    }

    impl GumballMachine {
        
        pub fn instantiate_gumball_machine(
            owner_role: OwnerRole,
            payment_token_address: ResourceAddress, 
            member_card_address: ResourceAddress,
            price_per_gumball: Decimal,
        ) -> Global<GumballMachine> {

            let (address_reservation, component_address) = 
                Runtime::allocate_component_address(Runtime::blueprint_id());

            let gumball_token_manager = 
                ResourceBuilder::new_fungible(owner_role.clone())
                .divisibility(DIVISIBILITY_NONE)
                .metadata(metadata!(
                    init {
                        "name" => "Gumball".to_owned(), locked;
                        "symbol" => "GUM".to_owned(), locked;
                        "description" => "A delicious gumball".to_owned(), locked;
                    }
                ))
                .mint_roles(mint_roles! {
                    minter => rule!(require(global_caller(component_address)));
                    minter_updater => rule!(deny_all);
                })
                .create_with_no_initial_supply();
            
            // populate a GumballMachine struct and instantiate a new component
            Self {
                gumball_token_manager: gumball_token_manager,
                collected_tokens: Vault::new(payment_token_address),
                price_per_gumball: price_per_gumball,
                discount_amount: dec!(50),
            }
            .instantiate()
            .prepare_to_globalize(owner_role)
            .roles(roles!(
                member => rule!(require(member_card_address));
            ))
            .metadata(metadata! (
                roles {
                    metadata_setter => OWNER;
                    metadata_setter_updater => OWNER;
                    metadata_locker => OWNER;
                    metadata_locker_updater => OWNER;
                },
                init {
                    "name" => "GumballMachine Component", locked;
                    "description" => "Use this component to purchase delicious gumballs!", locked;
                }
            ))
            .with_address(address_reservation)
            .globalize()
        }

        pub fn get_price(&self) -> Decimal {
            self.price_per_gumball
        }

        pub fn buy_gumball(&mut self, mut payment: Bucket) -> (Bucket, Bucket) {
            
            assert_eq!(
                payment.resource_address(), self.collected_tokens.resource_address(),
                "[GumballMachine]: Only {:?} tokens are accepted as payments!", 
                self.collected_tokens.resource_address()
            );
            
            let total_gumball_amount = payment.amount() / self.price_per_gumball;
            let total_gumball_price = total_gumball_amount * self.price_per_gumball;
            let our_share = payment.take(total_gumball_price);

            self.collected_tokens.put(our_share);

            // return a tuple containing a gumball, plus whatever change is left on the input payment (if any)
            (self.gumball_token_manager.mint(total_gumball_amount), payment)
        }

        pub fn buy_gumball_with_member_card(&mut self, mut payment: Bucket) -> (Bucket, Bucket) {

            assert_eq!(
                payment.resource_address(), self.collected_tokens.resource_address(),
                "[GumballMachine]: Only {:?} tokens are accepted as payments!", 
                self.collected_tokens.resource_address()
            );
            
            let discount_percent = (dec!(100) - self.discount_amount) / dec!(100);
            let discounted_price_per_gumball = self.price_per_gumball * discount_percent;

            let total_gumball_amount = payment.amount() / discounted_price_per_gumball;
            let total_gumball_price = total_gumball_amount * discounted_price_per_gumball;

            let our_share = payment.take(total_gumball_price);

            self.collected_tokens.put(our_share);
            

            // return a tuple containing a gumball, plus whatever change is left on the input payment (if any)
            // if we're out of gumballs to give, we'll see a runtime error when we try to grab one
            (self.gumball_token_manager.mint(total_gumball_amount), payment)

        }

        pub fn change_price(&mut self, new_price_per_gumball: Decimal) {
            self.price_per_gumball = new_price_per_gumball;
        }

        pub fn change_discount(&mut self, new_discount_amount: Decimal) {
            assert!(
                (new_discount_amount >= Decimal::zero()) & (new_discount_amount <= dec!("100")), 
                "[GumballMachine]: Discount amount must be between 0 and 100"
            );

            self.discount_amount = new_discount_amount;
        }

        pub fn change_member_card(&mut self, new_member_card: ResourceAddress) {
            Runtime::global_component().set_role("member", rule!(require(new_member_card)));
        }
    }
}

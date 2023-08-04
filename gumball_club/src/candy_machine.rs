use scrypto::prelude::*;

#[blueprint]
mod candy_machine {
    // extern_blueprint! (
    //     "",
    //     SugarPriceOracle {
    //         fn get_price(&mut self) -> Decimal;
    //     }

    // );


    enable_method_auth! {
        roles {
            member => updatable_by: [];
        },
        methods {
            buy_candy => PUBLIC;
            get_price => PUBLIC;
            buy_candy_with_member_card => restrict_to: [member];
            change_discount => restrict_to: [OWNER];
        }
    }
    struct CandyMachine {
        candy_token_manager: ResourceManager,
        collected_tokens: Vault,
        discount_amount: Decimal,
        last_updated: Instant
    }

    impl CandyMachine {
        
        pub fn instantiate_candy_machine(
            owner_role: OwnerRole,
            payment_token_address: ResourceAddress, 
            member_card_address: ResourceAddress,
        ) -> Global<CandyMachine> {

            let (address_reservation, component_address) = 
                Runtime::allocate_component_address(Runtime::blueprint_id());
            
            let candy_token_manager = 
                ResourceBuilder::new_fungible(owner_role.clone())
                .divisibility(DIVISIBILITY_NONE)
                .metadata(metadata!(
                    init {
                        "name" => "Candy Token".to_owned(), locked;
                        "symbol" => "CANDY".to_owned(), locked;
                        "description" => "A delicious sugar packed candy!".to_owned(), locked;
                    }
                ))
                .mint_roles(mint_roles! {
                    minter => rule!(require(global_caller(component_address)));
                    minter_updater => rule!(deny_all);
                })
                .create_with_no_initial_supply();
            
            info!("time: {:?}", Clock::current_time_rounded_to_minutes().seconds_since_unix_epoch);
            Self {
                candy_token_manager: candy_token_manager,
                collected_tokens: Vault::new(payment_token_address),
                discount_amount: dec!(50),
                last_updated: Clock::current_time_rounded_to_minutes(),
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
                    "name" => "CandyMachine Component", locked;
                }
            ))
            .with_address(address_reservation)
            .globalize()
        }

        pub fn buy_candy(&mut self, mut payment: Bucket) -> (Bucket, Bucket) {
            
            assert_eq!(
                payment.resource_address(), self.collected_tokens.resource_address(),
                "[CandyMachine]: Only {:?} tokens are accepted as payments!", 
                self.collected_tokens.resource_address()
            );
            
            let price_per_candy = self.get_price();
            let total_candy_amount = payment.amount() / price_per_candy;
            let total_candy_price = total_candy_amount * price_per_candy;
            let our_share = payment.take(total_candy_price);

            self.collected_tokens.put(our_share);

            return (self.candy_token_manager.mint(total_candy_price), payment)
        }

        pub fn buy_candy_with_member_card(&mut self, mut payment: Bucket) -> (Bucket, Bucket) {

            assert_eq!(
                payment.resource_address(), self.collected_tokens.resource_address(),
                "[CandyMachine]: Only {:?} tokens are accepted as payments!", 
                self.collected_tokens.resource_address()
            );
            
            let price_per_candy = self.get_price();
            let discount_percent = (dec!(100) - self.discount_amount) / dec!(100);
            let discounted_price_per_gumball = price_per_candy * discount_percent;

            let total_candy_amount = payment.amount() / discounted_price_per_gumball;
            let total_candy_price = total_candy_amount * discounted_price_per_gumball;

            let our_share = payment.take(total_candy_price);

            self.collected_tokens.put(our_share);

            (self.candy_token_manager.mint(total_candy_amount), payment)

        }

        pub fn change_discount(&mut self, new_discount_amount: Decimal) {
            assert!(
                (new_discount_amount >= Decimal::zero()) & (new_discount_amount <= dec!("100")), 
                "[CandyMachine]: Discount amount must be between 0 and 100"
            );

            self.discount_amount = new_discount_amount;
        }

        pub fn get_price(&mut self) -> Decimal {
            let last_updated_in_seconds = self.last_updated.seconds_since_unix_epoch;
            let current_time_in_seconds = Clock::current_time_rounded_to_minutes().seconds_since_unix_epoch;
            let time = current_time_in_seconds - last_updated_in_seconds;

            let half_period = 1800;
            
            let normalized_time = time % (2 * half_period);
        
            let price = if normalized_time < half_period {
                // Linear rise for the first half (30 minutes)
                normalized_time * 10 / half_period
            } else {
                // Linear fall for the second half (30 minutes)
                10 - ((normalized_time - half_period) * 10 / half_period)
            };

            self.last_updated = Clock::current_time_rounded_to_minutes();

            return Decimal::from(price);
        }
    }
}

use scrypto::prelude::*;

/// WARNING: This component can't dispense candies until the SugarPriceOracle package is set up and 
/// hardcoded correctly.

#[blueprint]
/// Would we rather want to store this in the struct?
/// I think this would mean that we may need to store it as Global<AnyComponent>
/// This would give customizeability to allow the OWNER to change oracles, but maybe not
/// every oracle will be a Global<SugarPriceOracle>?
/// This is currently a resim package, will need to re-hardcode to rcnet/Babylon PackageAddress
mod candy_machine {
    extern_blueprint!(
        "package_sim1p4nkwqqnqt8cfnhns58gah77m5xlpqk4fl6q6gg2gqhsk38yjnf84q",
        SugarPriceOracle {
            fn get_price(&mut self) -> Decimal;
        }
    );

    const SUGARPRICEORACLE: Global<SugarPriceOracle> = global_component!(
        SugarPriceOracle,
        // This is currently a resim component, will need to re-hardcode to rcnet/Babylon ComponentAddress
        "component_sim1cqfjcpw68asmc7w76gk34ylvrch8u4ujxg0aa8rn4sf2qf92hvmxn8"
    );

    enable_method_auth! {
        roles {
            member => updatable_by: [SELF];
        },
        methods {
            buy_candy => PUBLIC;
            get_price => PUBLIC;
            buy_candy_with_member_card => restrict_to: [member];
            change_discount => restrict_to: [OWNER];
            change_member_card => restrict_to: [OWNER];
        }
    }

    struct CandyMachine {
        candy_token_manager: ResourceManager,
        collected_tokens: Vault,
        discount_amount: Decimal,
        last_updated: Instant,
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
                    "description" => "Use this component to purchase sweet candies!", locked;
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
             
            let total_candy_amount = 
                (payment.amount() / price_per_candy).round(0, RoundingMode::ToZero);

            info!("Total Candy: {:?}", total_candy_amount);

            let total_candy_price = total_candy_amount * price_per_candy;
            let our_share = payment.take(total_candy_price);

            self.collected_tokens.put(our_share);

            return (self.candy_token_manager.mint(total_candy_amount), payment)
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

            let total_candy_amount = 
            (payment.amount() / discounted_price_per_gumball).round(0, RoundingMode::ToZero);
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

        pub fn change_member_card(&mut self, new_member_card: ResourceAddress) {
            Runtime::global_component().set_role("member", rule!(require(new_member_card)));
        }

        pub fn get_price(&mut self) -> Decimal {
            SUGARPRICEORACLE.get_price()
        }
    }
}

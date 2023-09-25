use scrypto::prelude::*;

// WARNING: This component can't dispense candies until the SugarPriceOracle package is set up and 
// hardcoded correctly.

#[blueprint]
mod candy_machine {
    extern_blueprint!(
        // This is currently a resim component, will need to re-hardcode to rcnet/Babylon ComponentAddress
        // "package_sim1p44ms5qn4dx495qy67z73eg69fmmumjjt2v3nph0ksf03hnud2attn",
        "package_tdx_2_1p56309c37y65tvtav6a33dq3hyrmp6r360gmac0ka2346tfpnnunfh",
        SugarPriceOracle {
            fn get_price(&self) -> Decimal;
        }
    );

    // Defines component method authority
    
    // --Roles--
    // * `OWNER` -  The owner of the component which has authority to change resource and component 
    //    metadata. 
    // * `SELF` - The component itself which is designated authority to mint candies.
    // * `member` - The member which is specified by those who hold the badge resource determined by 
    //    the `member_card_address`.
    // * `PUBLIC` - The role that defines everybody else.
    enable_method_auth! {
        roles {
            member => updatable_by: [SELF,OWNER];
        },
        methods {
            buy_candy => PUBLIC;
            get_price => PUBLIC;
            buy_candy_with_member_card => restrict_to: [member];
            change_discount => restrict_to: [OWNER];
            change_member_card => restrict_to: [OWNER];
            get_discount => PUBLIC;
            get_member_role => PUBLIC;
        }
    }

    /// The `CandyMachine` holds these state in its component:

    /// * `candy_token_manager` | `ResourceManager` - Holds the `ResourceManager` of the 
    ///     candy tokens to reference and mint from.
    
    /// * `collected_tokens` | `Vault` - A `Vault` that holds and collects all the payment 
    ///     resource determined by the `payment_token_address` it receives from the candies 
    ///     it sells.
    
    /// * `discount_amount` | `Decimal` - Holds the discount amount that `member` role can 
    ///     qualify for holding the specified `member_card_address`. 
    struct CandyMachine {
        candy_token_manager: ResourceManager,
        collected_tokens: Vault,
        discount_amount: Decimal,
    }

    impl CandyMachine {

    /// The `CandyMachine` uses the `instantiate_candy_machine` function to instantiate its 
    /// component and it takes in 3 argument inputs:

    /// 1. `owner_role` | `OwnerRole` - This is to define the "owner" of the components and 
    ///     resource as well as map the `AccessRule` of the owner to a badge address.
    ///     - The `OwnerRole` can be specified to be `Fixed` meaning that the badge address 
    ///     that the `AccessRule` is mapped to will forever remain immutable.
    ///     - The `OwnerRole` can be specified to be `Updatable` meaning the badge address 
    ///     that the `AccessRule` is mapped to can be updated by the owner itself.
    ///     - The `OwnerRole` can be specified to `None` meaning that the component and its 
    ///     resources will not have an owner and will not be able to have access to privileged 
    ///     methods nor update the entities metadata.
    ///     - It is important to specify an `OwnerRole` and configure it to a badge address to 
    ///     enable [metadata verification](https://docs-babylon.radixdlt.com/main/standards/metadata-for-verification.html).
    /// 2. `payment_token_address` | `ResourceAddress` - This is the `ResourceAddress` of the 
    ///     resource used for payment to purchase candy from this component.
    /// 3. `member_card_address` | `ResourceAddress` - This is the `ResourceAddress` of a member 
    ///     card badge resource used to provide special discounts to candies sold and minted by this component. 

    /// You may use the `GumballClub` blueprint to automatically instantiate the `CandyMachine` 
    /// with pre-configured `payment_token_address` and `member_card_address` provided by the 
    /// `GumballClub`. If you wish to instantiate the `CandyMachine` on its own, then you must 
    /// specify its own `payment_token_address` and `member_card_address` for your own purpose.
        pub fn instantiate_candy_machine(
            owner_role: OwnerRole,
            payment_token_address: ResourceAddress, 
            member_card_address: ResourceAddress,
        ) -> Global<CandyMachine> {

            // Create a `GlobalAddressReservation` and `ComponentAddress` to use as the component's 
            // "virtual actor badge".
            let (address_reservation, component_address) = 
                Runtime::allocate_component_address(CandyMachine::blueprint_id());  
            
            assert_ne!(
                payment_token_address, member_card_address,
                "payment_token_address cannot be the same as the member_card_address"
            );

            assert!(
                !(
                    (owner_role == OwnerRole::Fixed(rule!(require(payment_token_address))) ||
                     owner_role == OwnerRole::Fixed(rule!(require(member_card_address))))
                    &&
                    (owner_role == OwnerRole::Updatable(rule!(require(payment_token_address))) ||
                     owner_role == OwnerRole::Updatable(rule!(require(member_card_address))))
                ),
                "`OwnerRole` mapping cannot map to either payment_token_address nor member_card_address"
            );
            // The resource definition for the candy token. This resource has divisibility
            // set to 0 to ensure candies sold are whole candies and cannot be fractionalized.

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
            let candy_token_manager = 
                ResourceBuilder::new_fungible(owner_role.clone())
                .divisibility(DIVISIBILITY_NONE)
                .metadata(metadata!(
                    init {
                        "name" => "GC Candies".to_owned(), locked;
                        "symbol" => "CANDY".to_owned(), locked;
                        "description" => "Official Gumball Club candies, using only the finest sugar from decentralized markets.".to_owned(), locked;
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

        /// * `get_price` - Retrieves the current price of candy saved in component state. It uses an external 
        ///     blueprint package cross-component call to the `SugarPriceOracle` to retrieve the price per candy.
        /// 
        /// --INPUTS--
        /// * None
        /// 
        /// --RETURNS--
        /// * `Decimal` - The price of candies in `Decimal` type.
        pub fn get_price(&mut self) -> Decimal {
            let sugar_price_oracle: Global<SugarPriceOracle> = global_component!(
                SugarPriceOracle,
                // This is currently a resim component, will need to re-hardcode to rcnet/Babylon ComponentAddress
                // "component_sim1crwtvasx7z96s4z8mlv0gpjlqysanlw926sy7885j7ntz8jm2skx8x"
                "component_tdx_2_1cz3cc6hth2lwsm6zv0jp5gevv8a5axg36at7hyq4d29wace3s5xk2c"
            );

            sugar_price_oracle.get_price()
        }

        /// * `buy_candy` - Takes in a `Bucket` of resource specified by `payment_token_address` and mints candy 
        ///     based on the cross-component call to `SugarPriceOracle` to determine the price per candy.
        /// --INPUTS--
        /// * `payment`: `Bucket` - Takes in a `Bucket` of payment specified by
        /// `payment_token_address`.
        
        /// --RETURNS--
        /// * `(Bucket, Bucket)` - Returns a tuple of `Bucket`:
        /// 1. Any refunded/leftover payments to the user.
        /// 2. The `Bucket` of candy.
        pub fn buy_candy(&mut self, payment: Bucket) -> Bucket {    

            let resource_name_metadata: String = 
                self.collected_tokens
                    .resource_manager()
                    .get_metadata("name")
                    .unwrap()
                    .unwrap_or_else(|| {
                        let address = self.collected_tokens.resource_address();
                        Runtime::bech32_encode_address(address)
                    });         

            // Asserts that the payment type is of the accepted payment resource.
            // This assert is not needed but can be used for friendly error messages.
            assert_eq!(
                payment.resource_address(), self.collected_tokens.resource_address(),
                "[CandyMachine]: Only {:?} tokens are accepted as payments!", 
                resource_name_metadata
            );
            
            
            let price_per_candy = self.get_price();

            // Calculate the total amount of candy based on the amount of payment sent.
            let total_candy_amount = 
                (payment.amount().checked_mul(price_per_candy))
                .unwrap()
                .checked_round(0, RoundingMode::ToZero)
                .unwrap();

            self.collected_tokens.put(payment);

            return self.candy_token_manager.mint(total_candy_amount)
        }

        /// * `buy_candy_with_member_card` - Authorized method for `member` role which requires a `Proof` of 
        ///     the resource specified by `member_card_address`. If `Proof` is provided, then candies are 50% off.
        /// 
        /// --INPUTS--
        /// * `payment`: `Bucket` - Takes in a `Bucket` of payment specified by
        /// `payment_token_address`.
        
        /// --RETURNS--
        /// * `(Bucket, Bucket)` - Returns a tuple of `Bucket`:
        /// 1. Any refunded/leftover payments to the user.
        /// 2. The `Bucket` of candy.
        pub fn buy_candy_with_member_card(&mut self, payment: Bucket) -> Bucket {

            let resource_name_metadata: String = 
                self.collected_tokens
                    .resource_manager()
                    .get_metadata("name")
                    .unwrap()
                    .unwrap_or_else(|| {
                        let address = self.collected_tokens.resource_address();
                        Runtime::bech32_encode_address(address)
                    });

            // Asserts that the payment type is of the accepted payment resource.
            // This assert is not needed but can be used for friendly error messages.
            assert_eq!(
                payment.resource_address(), self.collected_tokens.resource_address(),
                "[CandyMachine]: Only {:?} tokens are accepted as payments!", 
                resource_name_metadata
            );
            
            let price_per_candy = self.get_price();
            
            let discount_percent = 
                (dec!(100).checked_sub(self.discount_amount))
                .and_then(|x| {
                    x.checked_div(dec!(100))
                })
                .unwrap();

            let discounted_price_per_candy = 
                price_per_candy
                .checked_div(discount_percent)
                .unwrap();

            let total_candy_amount = 
                (payment.amount().checked_mul(discounted_price_per_candy))
                .unwrap()
                .checked_round(0, RoundingMode::ToZero)
                .unwrap();

            self.collected_tokens.put(payment);

            return self.candy_token_manager.mint(total_candy_amount)

        }

        /// * `change_discount` - Authorized method for `OWNER` role which requires a `Proof` of the resource 
        ///     specified by `owner_role`. If `Proof` is provided, then new discount amount may be inputted. 
        
        /// --INPUTS--
        /// * `new_discount_amount` | `Decimal` - The new discount amount members can qualify
        /// for candies purchased inputted as a `Decimal` type.
        
        /// --RETURNS--
        /// * None
        pub fn change_discount(&mut self, new_discount_amount: Decimal) {
            assert!(
                (new_discount_amount >= Decimal::zero()) & (new_discount_amount <= dec!("100")), 
                "[CandyMachine]: Discount amount must be between 0 and 100"
            );

            self.discount_amount = new_discount_amount;
        }

        /// * `change_member_card` - Authorized method for `OWNER` role which requires a `Proof` of the resource 
        /// specified by `owner_role`. If `Proof` is provided, then new `member_card_address` may be inputted. 
         
        /// --INPUTS--
        /// * `new_member_card` | `ResourceAddress` - The new member card that will be associated
        /// with the `member` role to qualify for special discounts inputted as a `ResourceAddress`.
        
        /// --RETURNS--
        /// * None
        pub fn change_member_card(&mut self, new_member_card: ResourceAddress) {
            Runtime::global_component().set_role("member", rule!(require(new_member_card)));
        }

        /// * `get_discount` - Retrieves the current discount amount a member can qualify for the candies.
         
        /// --INPUTS--
        /// * None
        
        /// --RETURNS--
        /// * `Decimal` - Retrieves the discount amount that members can qualify for the 
        /// purchase of candies returned as a `Decimal` type.
        pub fn get_discount(&self) -> Decimal {
            self.discount_amount
        }

        /// * `get_member_role` - Retrieves the `AccessRule` of the `member` role.
         
        /// --INPUTS--
        /// * None
         
        /// --RETURNS--
        /// `AccessRule` - Returns the `member` role's `AccessRule` which maps to the member
        /// card's `ResourceAddress.
        pub fn get_member_role(&self) -> AccessRule {
            Runtime::global_component().get_role("member").unwrap()
        }
    }
}
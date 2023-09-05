use scrypto::prelude::*;

#[blueprint]
mod gumball_machine {
    // Defines component method authority
    
    // --Roles--
    // * `OWNER` -  The owner of the component which has authority to change resource and component 
    //    metadata. 
    // * `SELF` - The component itself which is designated authority to mint gumballs.
    // * `member` - The member which is specified by those who hold the badge resource determined by 
    //    the `member_card_address`.
    // * `PUBLIC` - The role that defines everybody else.
    enable_method_auth! {
        roles {
            member => updatable_by: [SELF, OWNER];
        },
        methods {
            buy_gumball => PUBLIC;
            get_price => PUBLIC;
            buy_gumball_with_member_card => restrict_to: [member];
            change_price => restrict_to: [OWNER];
            change_discount => restrict_to: [OWNER];
            change_member_card => restrict_to: [OWNER];
            get_discount => PUBLIC;
            get_member_role => PUBLIC;
        }
    }

    /// The `GumballMachine` holds these state in its component:

    /// * `gumball_token_manager` | `ResourceManager` - Holds the `ResourceManager` of the gumball tokens
    ///  to reference and mint from.
    
    /// * `collected_tokens` | `Vault` - A `Vault` that holds and collects all the payment resource 
    /// determined by the `payment_token_address` it receives from the gumballs it sells.
    
    /// * `price_per_gumball` | `Decimal` - Holds the current price of the specified `payment_token_address` 
    /// amount for each gumball that is sold for.
    
    /// * `discount_amount` | `Decimal` - Holds the discount amount that `member` role can qualify for 
    /// holding the specified `member_card_address`. 
    
    struct GumballMachine {
        gumball_token_manager: ResourceManager,
        collected_tokens: Vault,
        price_per_gumball: Decimal,
        discount_amount: Decimal,
    }

    impl GumballMachine {
        
        /// The `GumballMachine` uses the `instantiate_gumball_machine` function to instantiate its component 
        /// and it takes in 4 argument inputs:

        /// 1. `owner_role` | `OwnerRole` - This is to define the "owner" of the components and resource as well 
        /// as map the `AccessRule` of the owner to a badge address.
        ///    - The `OwnerRole` can be specified to be `Fixed` meaning that the badge address that the 
        ///      `AccessRule` is mapped to will forever remain immutable.
        ///    - The `OwnerRole` can be specified to be `Updatable` meaning the badge address that the 
        ///      `AccessRule` is mapped to can be updated by the owner itself.
        ///    - The `OwnerRole` can be specified to `None` meaning that the component and its resources 
        ///      will not have an owner and will not be able to have access to privileged methods nor update 
        ///      the entities metadata.
        ///    - It is important to specify an `OwnerRole` and configure it to a badge address to enable 
        ///      [metadata verification](https://docs-babylon.radixdlt.com/main/standards/metadata-for-verification.html).
        
        /// 2. `payment_token_address` | `ResourceAddress` - This is the `ResourceAddress` of the resource used 
        ///     for payment to purchase gumballs from this component.
        
        /// 3. `member_card_address` | `ResourceAddress` - This is the `ResourceAddress` of a member card 
        ///     badge resource used to provide special discounts to gumballs sold and minted by this component. 
        
        /// 4. `price_per_gumball` | `Decimal` - This is the configure the price of the gumball resource 
        ///     minted and sold by this component.
        
        /// You may use the `GumballClub` blueprint to automatically instantiate the `GumballMachine` with 
        /// pre-configured `payment_token_address` and `member_card_address` provided by the `GumballClub`. 
        /// If you wish to instantiate the `GumballMachine` on its own, then you must specify its own 
        /// `payment_token_address` and `member_card_address` for your own purpose.
        pub fn instantiate_gumball_machine(
            owner_role: OwnerRole,
            payment_token_address: ResourceAddress, 
            member_card_address: ResourceAddress,
            price_per_gumball: Decimal,
        ) -> Global<GumballMachine> {

            // Create a `GlobalAddressReservation` and `ComponentAddress` to use as the component's 
            // "virtual actor badge".
            let (address_reservation, component_address) = 
                Runtime::allocate_component_address(GumballMachine::blueprint_id());

            assert_ne!(
                payment_token_address, member_card_address,
                "payment_token_address cannot be the same as the member_card_address"
            );

            // Ideally it would be nice to assert the `ResourceAddress` of the `OwnerRole` without
            // needing to account different `OwnerRole` variation.

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

        /// `get_price` - Retrieves the current price of gumballs saved in component state.
         
        /// --INPUTS--
        /// * None
        
        /// --RETURNS--
        /// * `Decimal` - The price of gumballs in `Decimal` type. 
        pub fn get_price(&self) -> Decimal {
            self.price_per_gumball
        }

        /// `buy_gumball` - Takes in a `Bucket` of resource specified by `payment_token_address` 
        /// and mints a gumball based on amount afforded based on `price_per_gumball`.
         
        /// --INPUTS--
        /// * `payment`: `Bucket` - Takes in a `Bucket` of payment specified by
        /// `payment_token_address`.
        
        /// --RETURNS--
        /// * `(Bucket, Bucket)` - Returns a tuple of `Bucket`:
        /// 1. Any refunded/leftover payments to the user.
        /// 2. The `Bucket` of gumballs.
        pub fn buy_gumball(&mut self, mut payment: Bucket) -> (Bucket, Bucket) {

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
                "[GumballMachine]: Only {:?} tokens are accepted as payments!", 
                resource_name_metadata
            );
            
            // Calculate the total amount of gumball based on the amount of payment sent.
            // The conditional statement is used whereby if the payment is less than
            // the unit price of the gumball, then the full amount of payment will be
            // refunded and no gumballs will be returned. If the payment is sufficient,
            // then the total gumball amount is calculated and rounded down to ensure
            // only whole gumballs can be minted.
            let total_gumball_amount = if payment.amount() < self.price_per_gumball {
                dec!(0)
             } else {
                (payment.amount().checked_div(self.price_per_gumball))
                .unwrap()
                .checked_round(0, RoundingMode::ToZero)
                .unwrap()
             };

            let total_gumball_price = 
                total_gumball_amount
                .checked_mul(self.price_per_gumball)
                .unwrap();

            // Takes the only the total cost of the gumballs from the payment `Bucket`.
            let our_share = payment.take(total_gumball_price);

            // Puts the `Bucket` of collected payment to the component `Vault`.
            self.collected_tokens.put(our_share);

            // return a tuple containing a gumball, plus whatever change is left on the 
            // input payment (if any)
            (self.gumball_token_manager.mint(total_gumball_amount), payment)
        }

        /// `buy_gumball_with_member_card` - Authorized method for `member` role which 
        /// requires a `Proof` of the resource specified by `member_card_address`. If 
        /// `Proof` is provided, then gumballs are 50% off.
         
        /// --INPUTS--
        /// * `payment`: `Bucket` - Takes in a `Bucket` of payment specified by
        /// `payment_token_address`.
        
        /// --RETURNS--
        /// * `(Bucket, Bucket)` - Returns a tuple of `Bucket`:
        /// 1. Any refunded/leftover payments to the user.
        /// 2. The `Bucket` of gumballs.
        pub fn buy_gumball_with_member_card(&mut self, mut payment: Bucket) -> (Bucket, Bucket) {

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
                "[GumballMachine]: Only {:?} tokens are accepted as payments!", 
                resource_name_metadata
            );
            
            // Calculates the discounted price per gumball based on hardcoded discount
            // value of 50%.
            let discount_percent = 
                (dec!(100).checked_sub(self.discount_amount))
                .and_then(|x| {
                    x.checked_div(dec!(100))
                })
                .unwrap();
            let discounted_price_per_gumball = 
                self.price_per_gumball
                .checked_mul(discount_percent)
                .unwrap();

            // Calculate the total amount of gumball based on the amount of payment sent.
            // The conditional statement is used whereby if the payment is less than
            // the unit price of the gumball, then the full amount of payment will be
            // refunded and no gumballs will be returned. If the payment is sufficient,
            // then the total gumball amount is calculated and rounded down to ensure
            // only whole gumballs can be minted.
            let total_gumball_amount = if payment.amount() < discounted_price_per_gumball {
                dec!(0)
             } else {
                (payment.amount().checked_div(discounted_price_per_gumball))
                .unwrap()
                .checked_round(0, RoundingMode::ToZero)
                .unwrap()
             };

            let total_gumball_price = 
                total_gumball_amount
                .checked_mul(discounted_price_per_gumball)
                .unwrap();

            // Takes the only the total cost of the gumballs from the payment `Bucket`.
            let our_share = payment.take(total_gumball_price);

            // Puts the `Bucket` of collected payment to the component `Vault`.
            self.collected_tokens.put(our_share);
            

            // return a tuple containing a gumball, plus whatever change is left on the 
            // input payment (if any)
            (self.gumball_token_manager.mint(total_gumball_amount), payment)

        }

        /// `change_price` - Authorized method for `OWNER` role which requires a `Proof` 
        /// of the resource specified by `owner_role`. If `Proof` is provided, then new 
        /// price of gumballs may be inputted. 
        
        /// --INPUTS--
        /// * `new_price_per_gumball` | `Decimal` - The new unit price of gumballs that
        /// will be sold for inputted as a `Decimal` type.
        
        /// --RETURNS--
        /// * None
        pub fn change_price(&mut self, new_price_per_gumball: Decimal) {
            self.price_per_gumball = new_price_per_gumball;
        }

        /// `change_discount` - Authorized method for `OWNER` role which requires a `Proof` 
        /// of the resource specified by `owner_role`. If `Proof` is provided, then new 
        /// discount amount may be inputted. 
        
        /// --INPUTS--
        /// * `new_discount_amount` | `Decimal` - The new discount amount members can qualify
        /// for gumballs purchased inputted as a `Decimal` type.
        
        /// --RETURNS--
        /// * None
        pub fn change_discount(&mut self, new_discount_amount: Decimal) {
            assert!(
                (new_discount_amount >= Decimal::zero()) & (new_discount_amount <= dec!("100")), 
                "[GumballMachine]: Discount amount must be between 0 and 100"
            );

            self.discount_amount = new_discount_amount;
        }

        /// `change_member_card` - Authorized method for `OWNER` role which requires a `Proof` 
        /// of the resource specified by `owner_role`. If `Proof` is provided, then new 
        /// `member_card_address` may be inputted. 
        
        /// --INPUTS--
        /// * `new_member_card` | `ResourceAddress` - The new member card that will be associated
        /// with the `member` role to qualify for special discounts inputted as a `ResourceAddress`.
        
        /// --RETURNS--
        /// * None
        pub fn change_member_card(&mut self, new_member_card: ResourceAddress) {
            Runtime::global_component().set_role("member", rule!(require(new_member_card)));
        }

        /// `get_discount` - Retrieves the current discount amount a member can qualify for
        ///  the gumballs.
        
        /// --INPUTS--
        /// * None
        
        /// --RETURNS--
        /// * `Decimal` - Retrieves the discount amount that members can qualify for the 
        /// purchase of gumballs returned as a `Decimal` type.
        pub fn get_discount(&self) -> Decimal {
            self.discount_amount
        }

        /// `get_member_role` - Retrieves the `AccessRule` of the `member` role.
        
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

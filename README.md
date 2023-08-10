# Table of Contents
- [Abstract](#abstract)
- [Features](#features)
- [Details of Design](#details-of-design)
  - [Blueprints Overview](#blueprints-overview)
    - [GumballClub Blueprint](#gumballclub-blueprint)
    - [GumballMachine Blueprint](#gumballclub-blueprint)
    - [CandyMachine Blueprint](#gumballclub-blueprint)

# Abstract
The motivation of this blueprint package is to showcase a simple example that utilizes many different Scrypto concepts and aims to provide users a delightful experience with the Radix Wallet. The `GumballClub` is a collection of blueprints which facilitates the distribution of Gumball Club token and member card NFT badges to be used to purchase gumballs and candies from the `GumballMachine` and `CandyMachine`. The Scrypto concepts it uses are:

* Radix Engine system-based authority model
* Native resources
* Finite state machine guaranteed resource management
* External blueprint package cross-component call
* Reusable blueprints
* Intent based transactions

# Features

The `GumballClub` has a few simple yet novel features:

* Users can dispense free Gumball Club tokens to purchase member cards, gumballs, and candies.
* Users can uses member cards to access privilaged methods and qualify for discounts on gumballs and candies.
* Owners can configure component state and metadata of the `GumballClub`.
* Customizable blueprint instantiations.

# Details of Design

## Blueprint Overview
The GumballClub package is made up of 3 blueprints: `GumballClub`, `GumballMachine`, and `CandyMachine`. It relies on an external package `SugarPriceOracle` to feed the price of candy used by the `CandyMachine`.

### GumballClub Blueprint
You can think of the `GumballClub` blueprint as the "master" blueprint. It is designed to instantiate all the component and create all the resources needed to build your `GumballClub` component backend out of the box and only a few configurations are needed to get it set up. Below will describe the instantiation process and the methods the `GumballClub` blueprint provides.

**Instantiation** 

The `GumballClub` instantiation function: `instantiate_gumball_club` takes in 3 argument inputs:

1. `owner_role` | `OwnerRole` - This is to define the "owner" of the components and resource as well as map the `AccessRule` of the owner to a badge address.
    - The `OwnerRole` can be specified to be `Fixed` meaning that the badge address that the `AccessRule` is mapped to will forever remain immutable.
    - The `OwnerRole` can be specified to be `Updatable` meaning the badge address that the `AccessRule` is mapped to can be updated by the owner itself.
    - The `OwnerRole` can be specified to `None` meaning that the component and its resources will not have an owner and will not be able to have access to privileged methods nor update the entities metadata.
    - It is important to specify an `OwnerRole` and configure it to a badge address to enable [metadata verification](https://docs-babylon.radixdlt.com/main/standards/metadata-for-verification.html).
2. `price_per_card` | `Decimal` - This is to confgiure the price of the member card that will be minted and sold by the `GumballClub` component.
3. `price_per_gumball` | `Decimal` - This is the configure the price of the gumball resource minted and sold by the `GumballMachine`.

**Resources**

The `GumballClub` creates two resources:

1. Gumball Club Token - This is the currency token used to purchase member card, gumballs, and candies from the `GumballClub`, `GumballMachine`, and `CandyMachine` components it instantiates. 

2. Member Card - The member card is a distinguished NFT badge used by members of the `GumballClub` to purchase gumballs and candies from the `GumballMachine` and `CandyMachine` component at a discount.

**Component State**

The `GumballClub` holds these state in its component:

* `gumball_club_token_manager` | `ResourceManager` - Holds the `ResourceManager` of the Gumball Club tokens to reference and mint from.
* `member_card_manager` | `ResourceManager` - Holds the `ResourceManager` of the member card NFT badge to reference and mint from.
* `collected_gc_vault` | `Vault` - A `Vault` that holds and collects all the payment resource in Gumball Club tokens it receives from the member cards it sells.
* `gumball_club_member_counter` | `u64` - Holds and tracks the member card NFT badges is minted and determines its `NonFungibleLocalId`

**Methods**

The `GumballClub` provides these methods:

* `dispense_gc_tokens` - This method, when called, mints the caller with 20 Gumball Club tokens. A user may continuously call this method to mint more Gumball Club tokens, 20 at a time.

* `buy_member_card` - This takes in a payment `Bucket` of Gumball Club tokens. For 5 Gumball Club tokens, the caller will receive 1 Member Card NFT badge.

### GumballMachine Blueprint
The `GumballMachine` blueprint facilitates the minting/selling of gumballs when users send in a payment. A member card can be used to provide special discounts on gumballs to its members. Owners of the component can configure resource and component metadata as well as access privilaged methods safeguarded by the Radix Engine auth model to change the price of gumballs, discounts, and more.

**Instantiation**

The `GumballMachine` uses the `instantiate_gumball_machine` function to instantiate its component and it takes in 4 argument inputs:

1. `owner_role` | `OwnerRole` - This is to define the "owner" of the components and resource as well as map the `AccessRule` of the owner to a badge address.
    - The `OwnerRole` can be specified to be `Fixed` meaning that the badge address that the `AccessRule` is mapped to will forever remain immutable.
    - The `OwnerRole` can be specified to be `Updatable` meaning the badge address that the `AccessRule` is mapped to can be updated by the owner itself.
    - The `OwnerRole` can be specified to `None` meaning that the component and its resources will not have an owner and will not be able to have access to privileged methods nor update the entities metadata.
    - It is important to specify an `OwnerRole` and configure it to a badge address to enable [metadata verification](https://docs-babylon.radixdlt.com/main/standards/metadata-for-verification.html).
2. `payment_token_address` | `ResourceAddress` - This is the `ResourceAddress` of the resource used for payment to purchase gumballs from this component.
3. `member_card_address` | `ResourceAddress` - This is the `ResourceAddress` of a member card badge resource used to provide special discounts to gumballs sold and minted by this component. 
4. `price_per_gumball` | `Decimal` - This is the configure the price of the gumball resource minted and sold by this component.

You may use the `GumballClub` blueprint to automatically instantiate the `GumballMachine` with pre-configured `payment_token_address` and `member_card_address` provided by the `GumballClub`. If you wish to instantiate the `GumballMachine` on its own, then you must specify its own `payment_token_address` and `member_card_address` for your own purpose.

**Component State**

The `GumballMachine` holds these state in its component:

* `gumball_token_manager` | `ResourceManager` - Holds the `ResourceManager` of the gumball tokens to reference and mint from.
* `collected_tokens` | `Vault` - A `Vault` that holds and collects all the payment resource determined by the `payment_token_address` it receives from the gumballs it sells.
* `price_per_gumball` | `Decimal` - Holds the current price of the specified `payment_token_address` amount for each gumball that is sold for.
* `discount_amount` | `Decimal` - Holds the discount amount that `member` role can qualify for holding the specified `member_card_address`. 

**Resources**

The `GumballMachine` creates only one resource:

1. Gumballs - This is the gumball resource that this component will mint and sell to users.

**Methods**

The `GumballMachine` has these methods:

* `get_price` - Retrieves the current price of gumballs saved in component state.

* `buy_gumball` - Takes in a `Bucket` of resource specified by `payment_token_address` and mints a gumball based on amount afforded based on `price_per_gumball`.

* `buy_gumball_with_member_card` - Authorized method for `member` role which requires a `Proof` of the resource specified by `member_card_address`. If `Proof` is provided, then gumballs are 50% off.

* `change_price` - Authorized method for `OWNER` role which requires a `Proof` of the resource specified by `owner_role`. If `Proof` is provided, then new price of gumballs may be inputted. 

* `change_discount` - Authorized method for `OWNER` role which requires a `Proof` of the resource specified by `owner_role`. If `Proof` is provided, then new discount amount may be inputted. 

* `change_member_card` - Authorized method for `OWNER` role which requires a `Proof` of the resource specified by `owner_role`. If `Proof` is provided, then new `member_card_address` may be inputted. 

* `get_discount` - Retrieves the current discount amount a member can qualify for the gumballs.

* `get_member_role` - Retrieves the `AccessRule` of the `member` role.

**Auth**

* `OWNER` - The owner of the component which has authority to change resource and component metadata. 

* `SELF` - The component itself which is designated authority to mint gumballs.

* `member` - The member which is specified by those who hold the badge resource determined by the `member_card_address`.

### CandyMachine Blueprint
The `CandyMachine` blueprint facilitates the minting/selling of candies when users send in a payment. A member card can be used to provide special discounts on candies to its members. Owners of the component can configure resource and component metadata as well as access privilaged methods safeguarded by the Radix Engine auth model to change the price of candies, discounts, and more.

**Instantiation**

The `CandyMachine` uses the `instantiate_candy_machine` function to instantiate its component and it takes in 3 argument inputs:

1. `owner_role` | `OwnerRole` - This is to define the "owner" of the components and resource as well as map the `AccessRule` of the owner to a badge address.
    - The `OwnerRole` can be specified to be `Fixed` meaning that the badge address that the `AccessRule` is mapped to will forever remain immutable.
    - The `OwnerRole` can be specified to be `Updatable` meaning the badge address that the `AccessRule` is mapped to can be updated by the owner itself.
    - The `OwnerRole` can be specified to `None` meaning that the component and its resources will not have an owner and will not be able to have access to privileged methods nor update the entities metadata.
    - It is important to specify an `OwnerRole` and configure it to a badge address to enable [metadata verification](https://docs-babylon.radixdlt.com/main/standards/metadata-for-verification.html).
2. `payment_token_address` | `ResourceAddress` - This is the `ResourceAddress` of the resource used for payment to purchase candy from this component.
3. `member_card_address` | `ResourceAddress` - This is the `ResourceAddress` of a member card badge resource used to provide special discounts to candies sold and minted by this component. 

You may use the `GumballClub` blueprint to automatically instantiate the `CandyMachine` with pre-configured `payment_token_address` and `member_card_address` provided by the `GumballClub`. If you wish to instantiate the `CandyMachine` on its own, then you must specify its own `payment_token_address` and `member_card_address` for your own purpose.

**Component State**

The `CandyMachine` holds these state in its component:

* `candy_token_manager` | `ResourceManager` - Holds the `ResourceManager` of the candy tokens to reference and mint from.
* `collected_tokens` | `Vault` - A `Vault` that holds and collects all the payment resource determined by the `payment_token_address` it receives from the candies it sells.
* `discount_amount` | `Decimal` - Holds the discount amount that `member` role can qualify for holding the specified `member_card_address`. 

**Resources**

The `CandyMachine` creates only one resource:

1. Candy - This is the candy resource that this component will mint and sell to users.

**Methods**

The `CandyMachine` has these methods:

* `get_price` - Retrieves the current price of candy saved in component state. It uses an external blueprint package cross-component call to the `SugarPriceOracle` to retrieve the price per candy.

* `buy_candy` - Takes in a `Bucket` of resource specified by `payment_token_address` and mints candy based on the cross-component call to `SugarPriceOracle` to determine the price per candy..

* `buy_candy_with_member_card` - Authorized method for `member` role which requires a `Proof` of the resource specified by `member_card_address`. If `Proof` is provided, then candies are 50% off.

* `change_discount` - Authorized method for `OWNER` role which requires a `Proof` of the resource specified by `owner_role`. If `Proof` is provided, then new discount amount may be inputted. 

* `change_member_card` - Authorized method for `OWNER` role which requires a `Proof` of the resource specified by `owner_role`. If `Proof` is provided, then new `member_card_address` may be inputted. 

* `get_discount` - Retrieves the current discount amount a member can qualify for the candies.

* `get_member_role` - Retrieves the `AccessRule` of the `member` role.

**Auth**

* `OWNER` - The owner of the component which has authority to change resource and component metadata. 

* `SELF` - The component itself which is designated authority to mint candies.

* `member` - The member which is specified by those who hold the badge resource determined by the `member_card_address`.

### SugarPriceOracle Blueprint
The `SugarPriceOracle` is a pseudo Oracle the feeds the `CandyMachine` price of candy. 

**Instantiation**

The `SugarPriceOracle` can be instantiated by calling the `instantiate_sugar_price_oracle` function and takes no argument input.

**Component State**

The `SugarPriceOracle` only takes one state:

* `starting_time` | `Instant` - Holds the date and timestamp formatted in ISO 8601 of when the component was instantiated. This is used to calculate the price of candies for the `CandyMachine`

**Resources**

The `SugarPriceOracle` does not create nor manage any resources.

**Methods**

The `SugarPriceOracle` only has one method:

* `get_price` - This method retrieves and returns the price in `Decimal` type. It uses a simple sawtooth function based on a 30 minute interval to calculate its price with a minimum value of `0.10` and a maximum value of `5.10`. The final price calculation is rounded to decimal places towards zero. 

**Auth**

The `SugarPriceOracle` has no roles or auth set up.

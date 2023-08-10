# Table of Contents
- [Abstract](#abstract)
- [Details of Design](#details-of-design)
  - [Blueprints Overview](#blueprints-overview)
    - [GumballClub Blueprint](#gumballclub-blueprint)
    - [GumballMachine Blueprint](#gumballclub-blueprint)
    - [CandyMachine Blueprint](#gumballclub-blueprint)

# Abstract

# Details of Design

## Blueprint Overview
The GumballClub dApp is made up of 3 blueprints: `GumballClub`, `GumballMachine`, and `CandyMachine`. 

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

**Methods**

The `GumballClub` provides these methods:

* `dispense_gc_tokens` - This method, when called, mints the caller with 20 Gumball Club tokens. A user may continuously call this method to mint more Gumball Club tokens, 20 at a time.

* `buy_member_card` - This takes in a payment `Bucket` of Gumball Club tokens. For 5 Gumball Club tokens, the caller will receive 1 Member Card NFT badge.

### GumballMachine Blueprint

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

**Resources**

The `GumballMachine` creates only one resource:

1. Gumballs - This is the gumball resource that this component will mint and sell to users.

**Methods**

The `GumballMachine` has these methods:

* `get_price`

* `buy_gumball`

* `buy_gumball_with_member_card`

* `change_price`

* `change_discount`

* `change_member_card`

* `get_discount`

* `get_member_role`

**Auth**

* `OWNER`

* `SELF`

* `member`
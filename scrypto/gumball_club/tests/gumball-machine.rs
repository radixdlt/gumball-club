use scrypto::prelude::*;
use scrypto_unit::*;
use transaction::{builder::ManifestBuilder, manifest::decompiler::ManifestObjectNames, prelude::TransactionManifestV1};
use radix_engine::transaction::TransactionReceipt;
use radix_engine::transaction::BalanceChange;
use scrypto::api::ObjectModuleId;

pub struct Account {
    public_key: Secp256k1PublicKey,
    account_address: ComponentAddress,
}

pub struct TestEnvironment {
    test_runner: DefaultTestRunner,
    account: Account,
    owner_badge: ResourceAddress,
    package_address: PackageAddress,
    gumball_machine_component: ComponentAddress,
    gumball_club_token: ResourceAddress,
    member_card_badge: ResourceAddress,
    gumball_token: ResourceAddress,
}

impl TestEnvironment {

    pub fn instantiate_test() -> Self {
        let mut test_runner = TestRunnerBuilder::new().build();

        // Create an account
        let (public_key, _private_key, account_address) = test_runner.new_allocated_account();  
        let account = Account { public_key, account_address };

        let owner_badge = test_runner.create_fungible_resource(
            dec!(1), 
            0u8, 
            account_address
        );

        let package_address = test_runner.compile_and_publish("../sugar_price_oracle");

        let manifest = ManifestBuilder::new()
            .call_function(
                package_address, 
                "SugarPriceOracle", 
                "instantiate_sugar_price_oracle", 
                manifest_args!()
            )
            .build();

        let receipt = test_runner.execute_manifest_ignoring_fee(
            manifest, 
            vec![NonFungibleGlobalId::from_public_key(&public_key)]
        );

        receipt.expect_commit_success();
        
        let package_address = test_runner.compile_and_publish(this_package!());

        let manifest = ManifestBuilder::new()
            .call_function(
                package_address, 
                "GumballClub", 
                "instantiate_gumball_club", 
                manifest_args!(
                    OwnerRole::Updatable(rule!(require(owner_badge))),
                    dec!(5),
                    dec!(2),
                )
            )
            .build();

        let receipt = test_runner.execute_manifest_ignoring_fee(
            manifest, 
            vec![NonFungibleGlobalId::from_public_key(&public_key)]
        );

        let commit_success = receipt.expect_commit_success();

        let gumball_club_component = commit_success.new_component_addresses()[0];
        let gumball_machine_component = commit_success.new_component_addresses()[1];
        let gumball_club_token = commit_success.new_resource_addresses()[0];
        let member_card_badge = commit_success.new_resource_addresses()[1];
        let gumball_token = commit_success.new_resource_addresses()[2];

        let manifest = ManifestBuilder::new()
            .call_method(
                gumball_club_component, 
                "dispense_gc_tokens", 
                manifest_args!()
            )
            .deposit_batch(account_address)
            .build();

        test_runner.execute_manifest_ignoring_fee(
            manifest, 
            vec![NonFungibleGlobalId::from_public_key(&public_key)], 
        ).expect_commit_success();

        let manifest = ManifestBuilder::new()
            .withdraw_from_account(
                account_address, 
                gumball_club_token, 
                dec!(5)
            )
            .take_all_from_worktop(
                gumball_club_token, 
                "gumball_club_token_bucket"
            )
            .call_method_with_name_lookup(
                gumball_club_component, 
                "buy_member_card", 
                |lookup| (
                    lookup.bucket("gumball_club_token_bucket"),
                )
            )
            .deposit_batch(account_address)
            .build();

        test_runner.execute_manifest_ignoring_fee(
            manifest, 
            vec![NonFungibleGlobalId::from_public_key(&public_key)], 
        ).expect_commit_success();

        Self {
            test_runner,
            account,
            owner_badge,
            package_address,
            gumball_machine_component,
            gumball_club_token,
            member_card_badge,
            gumball_token,
        }
    }

    pub fn execute_manifest_ignoring_fee(
        &mut self, 
        manifest_names: ManifestObjectNames, 
        manifest: TransactionManifestV1, 
        name: &str,
        network: &NetworkDefinition
    ) -> TransactionReceipt {

        dump_manifest_to_file_system(
            manifest_names,
            &manifest,
            "./transaction_manifest/gumball_machine",
            Some(name),
            network
        )
        .err();

        self.test_runner.execute_manifest_ignoring_fee(
            manifest, 
            vec![NonFungibleGlobalId::from_public_key(&self.account.public_key)]
        )
    }

    pub fn instantiate_gumball_machine(
        &mut self,
        owner_role: OwnerRole,
        payment_token_address: ResourceAddress,
        member_card_address: ResourceAddress,
        price_per_gumball: Decimal,
    ) -> TransactionReceipt {
        let manifest = ManifestBuilder::new()
            .call_function(
                self.package_address, 
                "GumballMachine", 
                "instantiate_gumball_machine", 
                manifest_args!(
                    owner_role,
                    payment_token_address,
                    member_card_address,
                    price_per_gumball
                )
            );

        self.execute_manifest_ignoring_fee(
            manifest.object_names(),
            manifest.build(),
            "instantiate_gumball_machine",
            &NetworkDefinition::simulator()
        )
    }

    pub fn get_price(&mut self) -> TransactionReceipt {

        let manifest = ManifestBuilder::new()
            .call_method(
                self.gumball_machine_component, 
                "get_price", 
                manifest_args!()
            );

        self.execute_manifest_ignoring_fee(
            manifest.object_names(), 
            manifest.build(), 
            "gm_get_price", 
            &NetworkDefinition::simulator()
        )
    }

    pub fn buy_gumball(&mut self, gc_token_amount: Decimal) -> TransactionReceipt {

        let manifest = ManifestBuilder::new()
            .withdraw_from_account(
                self.account.account_address, 
                self.gumball_club_token, 
                gc_token_amount
            )
            .take_all_from_worktop(
                self.gumball_club_token, 
                "gumball_club_token_bucket"
            )
            .call_method_with_name_lookup(
                self.gumball_machine_component, 
                "buy_gumball", 
                |lookup| (
                    lookup.bucket("gumball_club_token_bucket"),
                )
            )
            .deposit_batch(self.account.account_address);

        self.execute_manifest_ignoring_fee(
            manifest.object_names(), 
            manifest.build(), 
            "buy_gumball", 
            &NetworkDefinition::simulator()
        )
    }

    pub fn buy_gumball_with_member_card(&mut self, gc_token_amount: Decimal) -> TransactionReceipt {

        let manifest = ManifestBuilder::new()
            .create_proof_from_account_of_non_fungibles(
                self.account.account_address, 
                self.member_card_badge, 
                [NonFungibleLocalId::integer(1)]
            )
            .withdraw_from_account(
                self.account.account_address, 
                self.gumball_club_token, 
                gc_token_amount
            )
            .take_all_from_worktop(
                self.gumball_club_token, 
                "gumball_club_token_bucket"
            )
            .call_method_with_name_lookup(
                self.gumball_machine_component, 
                "buy_gumball_with_member_card", 
                |lookup| (
                    lookup.bucket("gumball_club_token_bucket"),
                )
            )
            .deposit_batch(self.account.account_address);

        self.execute_manifest_ignoring_fee(
            manifest.object_names(), 
            manifest.build(), 
            "buy_gumball_with_member_card", 
            &NetworkDefinition::simulator()
        )
    }

    pub fn change_price(&mut self, new_price: Decimal) -> TransactionReceipt {

        let manifest = ManifestBuilder::new()
            .create_proof_from_account_of_amount(
                self.account.account_address, 
                self.owner_badge, 
                dec!(1)
            )
            .call_method(
                self.gumball_machine_component, 
                "change_price", 
                manifest_args!(
                    new_price
                )
            );

        self.execute_manifest_ignoring_fee(
            manifest.object_names(), 
            manifest.build(), 
            "change_price", 
            &NetworkDefinition::simulator()
        )
    }

    pub fn change_discount(&mut self, new_discount: Decimal) -> TransactionReceipt {

        let manifest = ManifestBuilder::new()
            .create_proof_from_account_of_amount(
                self.account.account_address, 
                self.owner_badge, 
                dec!(1)
            )
            .call_method(
                self.gumball_machine_component, 
                "change_discount", 
                manifest_args!(new_discount)
            );

        self.execute_manifest_ignoring_fee(
            manifest.object_names(),
            manifest.build(),
            "change_discount",
            &NetworkDefinition::simulator(),
        )
    }

    pub fn change_member_card(&mut self, new_member_card: ResourceAddress) -> TransactionReceipt {
        
        let manifest = ManifestBuilder::new()
            .create_proof_from_account_of_amount(
                self.account.account_address, 
                self.owner_badge, 
                dec!(1)
            )
            .call_method(
                self.gumball_machine_component, 
                "change_member_card", 
                manifest_args!(new_member_card)
            );

        self.execute_manifest_ignoring_fee(
            manifest.object_names(),
            manifest.build(),
            "new_member_card",
            &NetworkDefinition::simulator(),
        )
    }
}

#[test]
fn instantiate_gumball_machine() {
    let mut test_environment = TestEnvironment::instantiate_test();
    let owner_badge = test_environment.owner_badge;
    let gumball_club_token = test_environment.gumball_club_token;
    let member_card = test_environment.member_card_badge;

    let receipt = test_environment.instantiate_gumball_machine(
        OwnerRole::Updatable(rule!(require(owner_badge))), 
        gumball_club_token, 
        member_card, 
        dec!(5)
    );

    receipt.expect_commit_success();
}

#[test]
fn get_price() {
    let mut test_environment = TestEnvironment::instantiate_test();

    let receipt = test_environment.get_price();

    let output: Decimal = receipt.expect_commit_success().output(1);

    assert_eq!(
        output, 
        dec!(2),
    );
}

#[test]
fn buy_gumball() {
    let mut test_environment = TestEnvironment::instantiate_test();

    let receipt = test_environment.buy_gumball(dec!(2));

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let commit = receipt.expect_commit_success();

    assert_eq!(
        test_environment.test_runner.sum_descendant_balance_changes(commit, test_environment.account.account_address.as_node_id()),
        indexmap!(
            test_environment.gumball_token => BalanceChange::Fungible(dec!("1")),
            test_environment.gumball_club_token => BalanceChange::Fungible(dec!("-2"))
        ),
    );

    assert_eq!(
        test_environment.test_runner.sum_descendant_balance_changes(commit, test_environment.gumball_machine_component.as_node_id()),
        indexmap!(test_environment.gumball_club_token => BalanceChange::Fungible(dec!("2")))
    );

}

#[test]
fn buy_gumball_with_member_card() {
    let mut test_environment = TestEnvironment::instantiate_test();

    let receipt = test_environment.buy_gumball_with_member_card(dec!(2));

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let commit = receipt.expect_commit_success();

    assert_eq!(
        test_environment.test_runner.sum_descendant_balance_changes(commit, test_environment.account.account_address.as_node_id()),
        indexmap!(
            test_environment.gumball_token => BalanceChange::Fungible(dec!("2")),
            test_environment.gumball_club_token => BalanceChange::Fungible(dec!("-2"))
        ),
    );

    assert_eq!(
        test_environment.test_runner.sum_descendant_balance_changes(commit, test_environment.gumball_machine_component.as_node_id()),
        indexmap!(test_environment.gumball_club_token => BalanceChange::Fungible(dec!("2")))
    );
}

#[test]
fn change_price() {
    let mut test_environment = TestEnvironment::instantiate_test();

    let receipt = test_environment.change_price(dec!(2));

    receipt.expect_commit_success();

    let receipt = test_environment.get_price();

    let output: Decimal = receipt.expect_commit_success().output(1);

    assert_eq!(output, dec!(2), "Incorrect price!");
}

#[test]
fn change_discount() {
    let mut test_environment = TestEnvironment::instantiate_test();
    let gumball_machine_component = test_environment.gumball_machine_component;

    let receipt = test_environment.change_discount(dec!(20));

    receipt.expect_commit_success();

    let manifest = ManifestBuilder::new()
        .call_method(
            gumball_machine_component, 
            "get_discount", 
            manifest_args!()
        )
        .build();

    let receipt = test_environment.test_runner.execute_manifest_ignoring_fee(manifest, 
        vec![NonFungibleGlobalId::from_public_key(&test_environment.account.public_key)]
    );

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let output: Decimal = receipt.expect_commit_success().output(1);

    assert_eq!(output, dec!(20), "Incorrect discount!");
}

#[test]
fn change_member_card() {
    let mut test_environment = TestEnvironment::instantiate_test();
    let gumball_machine_component = test_environment.gumball_machine_component;

    let new_member_card = 
        test_environment.test_runner
        .create_fungible_resource(
            dec!(1), 
            0u8, 
            test_environment.account.account_address
        );

    let receipt = test_environment.change_member_card(new_member_card);

    receipt.expect_commit_success();

    let manifest = ManifestBuilder::new()
        .get_role(
            gumball_machine_component, 
            ObjectModuleId::Main, 
            RoleKey::from("member")
        )
        .build();

    let receipt = test_environment.test_runner.execute_manifest_ignoring_fee(manifest, 
        vec![NonFungibleGlobalId::from_public_key(&test_environment.account.public_key)]
    );

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let output: RoleDefinition = receipt.expect_commit_success().output(1);
    let role = RoleDefinition::Some(rule!(require(new_member_card)));

    assert_eq!(output, role, "Roles do not match!");

}
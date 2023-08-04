use scrypto::prelude::*;
use scrypto_unit::*;
use transaction::{builder::ManifestBuilder, manifest::decompiler::ManifestObjectNames, prelude::TransactionManifestV1};
use radix_engine::transaction::TransactionReceipt;
use radix_engine::transaction::BalanceChange;

pub struct Account {
    public_key: Secp256k1PublicKey,
    account_address: ComponentAddress,
}

pub struct TestEnvironment {
    test_runner: TestRunner,
    account: Account,
    owner_badge: ResourceAddress,
    package_address: PackageAddress,
    gumball_club_component: ComponentAddress,
    gumball_machine_component: ComponentAddress,
    candy_machine_component: ComponentAddress,
    gumball_club_token: ResourceAddress,
    member_card_badge: ResourceAddress,
    gumball_token: ResourceAddress,
    candy_token: ResourceAddress,
}

impl TestEnvironment {

    pub fn instantiate_test() -> Self {

        let mut test_runner = TestRunner::builder().build();

        // Create an account
        let (public_key, _private_key, account_address) = test_runner.new_allocated_account();

        let owner_badge = test_runner.create_fungible_resource(
            dec!(1), 
            0u8, 
            account_address
        );
        
        let account = Account { public_key, account_address };

        let package_address = test_runner.compile_and_publish(this_package!());

        let manifest = ManifestBuilder::new()
            .call_function(
                package_address, 
                "GumballClub", 
                "instantiate_gumball_club", 
                manifest_args!(
                    OwnerRole::Updatable(rule!(require(owner_badge))),
                    dec!(5),
                    dec!(1),
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
        let candy_machine_component = commit_success.new_component_addresses()[2];
        let gumball_club_token = commit_success.new_resource_addresses()[0];
        let member_card_badge = commit_success.new_resource_addresses()[1];
        let gumball_token = commit_success.new_resource_addresses()[2];
        let candy_token = commit_success.new_resource_addresses()[3];

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
            gumball_club_component,
            gumball_machine_component,
            candy_machine_component,
            gumball_club_token,
            member_card_badge,
            gumball_token,
            candy_token,
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
            &manifest,
            manifest_names,
            "./transaction_manifest",
            Some(name),
            network
        )
        .err();

        self.test_runner.execute_manifest_ignoring_fee(
            manifest, 
            vec![NonFungibleGlobalId::from_public_key(&self.account.public_key)]
        )
    }

    pub fn dispense_gc_tokens(&mut self) {
        let manifest = ManifestBuilder::new()
        .call_method(
            self.gumball_club_component, 
            "dispense_gc_tokens", 
            manifest_args!()
        )
        .deposit_batch(self.account.account_address)
        .build();

        self.test_runner.execute_manifest_ignoring_fee(
            manifest, 
            vec![NonFungibleGlobalId::from_public_key(&self.account.public_key)], 
        ).expect_commit_success();
    }

    pub fn inspect_account(&mut self, resource_address: ResourceAddress) -> Decimal {
        self.test_runner.account_balance(
            self.account.account_address, 
            resource_address
        ).unwrap()

    }
}

#[test]
fn dispense_gc_tokens() {
    let mut test_environment = TestEnvironment::instantiate_test();
    let account_address = test_environment.account.account_address;
    let gumball_club_component = test_environment.gumball_club_component;
    let gumball_club_token = test_environment.gumball_club_token;

    let manifest = ManifestBuilder::new()
        .call_method(
            gumball_club_component, 
            "dispense_gc_tokens", 
            manifest_args!()
        )
        .deposit_batch(account_address);

    let receipt = test_environment.execute_manifest_ignoring_fee(
        manifest.object_names(), 
        manifest.build(), 
        "dispense_gc_tokens", 
        &NetworkDefinition::simulator()
    );

    let commit = receipt.expect_commit_success();

    assert_eq!(
        commit.balance_changes(),
        &indexmap!(
            CONSENSUS_MANAGER.into() => indexmap!(
                XRD => BalanceChange::Fungible(commit.fee_summary.expected_reward_if_single_validator())),
            test_environment.test_runner.faucet_component().into() => indexmap!(
                XRD => BalanceChange::Fungible(-(commit.fee_summary.total_cost()))
            ),
            account_address.into() => indexmap!(
                gumball_club_token => BalanceChange::Fungible(dec!("20"))
            ),
        )
    );
}

#[test]

fn buy_member_card() {
    let mut test_environment = TestEnvironment::instantiate_test();
    test_environment.dispense_gc_tokens();
    let account_address = test_environment.account.account_address;
    let gumball_club_component = test_environment.gumball_club_component;
    let gumball_club_token = test_environment.gumball_club_token;
    let member_card_badge = test_environment.member_card_badge;

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
        .deposit_batch(account_address);

    let receipt = test_environment.execute_manifest_ignoring_fee(
        manifest.object_names(), 
        manifest.build(), 
        "dispense_gc_tokens", 
        &NetworkDefinition::simulator()
    );

    let commit = receipt.expect_commit_success();

    assert_eq!(
        commit.balance_changes(),
        &indexmap!(
            CONSENSUS_MANAGER.into() => indexmap!(
                XRD => BalanceChange::Fungible(commit.fee_summary.expected_reward_if_single_validator())),
            test_environment.test_runner.faucet_component().into() => indexmap!(
                XRD => BalanceChange::Fungible(-(commit.fee_summary.total_cost()))
            ),
            account_address.into() => indexmap!(
                member_card_badge => BalanceChange::NonFungible{ added: btreeset!(NonFungibleLocalId::integer(2)), removed: btreeset!()},
                gumball_club_token => BalanceChange::Fungible(dec!("-5"))
            ),
            gumball_club_component.into() => indexmap!(
                gumball_club_token => BalanceChange::Fungible(dec!("5"))
            )
        )
    );

}

#[test]
fn gm_get_price() {
    let mut test_environment = TestEnvironment::instantiate_test();
    let gumball_machine_component = test_environment.gumball_machine_component;

    let manifest = ManifestBuilder::new()
        .call_method(
            gumball_machine_component, 
            "get_price", 
            manifest_args!()
        );

    let receipt = test_environment.execute_manifest_ignoring_fee(
        manifest.object_names(), 
        manifest.build(), 
        "dispense_gc_tokens", 
        &NetworkDefinition::simulator()
    );

    let output: Decimal = receipt.expect_commit_success().output(0);

    assert_eq!(
        output, 
        dec!(1),
    );
}

#[test]
fn gm_buy_gumball() {
    let mut test_environment = TestEnvironment::instantiate_test();
    let account_address = test_environment.account.account_address;
    let gumball_club_token = test_environment.gumball_club_token;
    let gumball_machine_component = test_environment.gumball_machine_component;
    let gumball_token = test_environment.gumball_token;

    let manifest = ManifestBuilder::new()
        .withdraw_from_account(
            account_address, 
            gumball_club_token, 
            dec!(2)
        )
        .take_all_from_worktop(
            gumball_club_token, 
            "gumball_club_token_bucket"
        )
        .call_method_with_name_lookup(
            gumball_machine_component, 
            "buy_gumball", 
            |lookup| (
                lookup.bucket("gumball_club_token_bucket"),
            )
        )
        .deposit_batch(account_address);

    let receipt = test_environment.execute_manifest_ignoring_fee(
        manifest.object_names(), 
        manifest.build(), 
        "buy_gumball", 
        &NetworkDefinition::simulator()
    );

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let commit = receipt.expect_commit_success();

    assert_eq!(
        commit.balance_changes(),
        &indexmap!(
            CONSENSUS_MANAGER.into() => indexmap!(
                XRD => BalanceChange::Fungible(commit.fee_summary.expected_reward_if_single_validator())),
            test_environment.test_runner.faucet_component().into() => indexmap!(
                XRD => BalanceChange::Fungible(-(commit.fee_summary.total_cost()))
            ),
            account_address.into() => indexmap!(
                gumball_token => BalanceChange::Fungible(dec!("2")),
                gumball_club_token => BalanceChange::Fungible(dec!("-2"))
            ),
            gumball_machine_component.into() => indexmap!(
                gumball_club_token => BalanceChange::Fungible(dec!("2"))
            )
        )
    );

}

#[test]
fn gm_buy_gumball_with_member_card() {
    let mut test_environment = TestEnvironment::instantiate_test();
    let account_address = test_environment.account.account_address;
    let gumball_club_token = test_environment.gumball_club_token;
    let gumball_token = test_environment.gumball_token;
    let member_card_badge = test_environment.member_card_badge;
    let gumball_machine_component = test_environment.gumball_machine_component;

    let manifest = ManifestBuilder::new()
        .create_proof_from_account_of_non_fungibles(
            account_address, 
            member_card_badge, 
            &btreeset!(NonFungibleLocalId::integer(1)
        ))
        .withdraw_from_account(
            account_address, 
            gumball_club_token, 
            dec!(1)
        )
        .take_all_from_worktop(
            gumball_club_token, 
            "gumball_club_token_bucket"
        )
        .call_method_with_name_lookup(
            gumball_machine_component, 
            "buy_gumball_with_member_card", 
            |lookup| (
                lookup.bucket("gumball_club_token_bucket"),
            )
        )
        .deposit_batch(account_address);

    let receipt = test_environment.execute_manifest_ignoring_fee(
        manifest.object_names(), 
        manifest.build(), 
        "buy_gumball_with_member_card", 
        &NetworkDefinition::simulator()
    );

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let commit = receipt.expect_commit_success();

    assert_eq!(
        commit.balance_changes(),
        &indexmap!(
            CONSENSUS_MANAGER.into() => indexmap!(
                XRD => BalanceChange::Fungible(commit.fee_summary.expected_reward_if_single_validator())),
            test_environment.test_runner.faucet_component().into() => indexmap!(
                XRD => BalanceChange::Fungible(-(commit.fee_summary.total_cost()))
            ),
            account_address.into() => indexmap!(
                gumball_token => BalanceChange::Fungible(dec!("2")),
                gumball_club_token => BalanceChange::Fungible(dec!("-1"))
            ),
            gumball_machine_component.into() => indexmap!(
                gumball_club_token => BalanceChange::Fungible(dec!("1"))
            )
        )
    );
}

#[test]
fn gm_change_price() {
    let mut test_environment = TestEnvironment::instantiate_test();
    let account_address = test_environment.account.account_address;
    let owner_badge = test_environment.owner_badge;
    let gumball_machine_component = test_environment.gumball_machine_component;

    let manifest = ManifestBuilder::new()
        .create_proof_from_account_of_amount(
            account_address, 
            owner_badge, 
            dec!(1)
        )
        .call_method(
            gumball_machine_component, 
            "change_price", 
            manifest_args!(
                dec!(2)
            )
        );

    test_environment.execute_manifest_ignoring_fee(
        manifest.object_names(), 
        manifest.build(), 
        "buy_gumball_with_member_card", 
        &NetworkDefinition::simulator()
    ).expect_commit_success();
}

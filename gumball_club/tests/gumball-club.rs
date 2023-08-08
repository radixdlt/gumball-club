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
    gumball_club_component: ComponentAddress,
    gumball_club_token: ResourceAddress,
    member_card_badge: ResourceAddress,
}

impl TestEnvironment {

    pub fn instantiate_test() -> Self {
        let mut test_runner = TestRunner::builder().build();

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
        let gumball_club_token = commit_success.new_resource_addresses()[0];
        let member_card_badge = commit_success.new_resource_addresses()[1];

        Self {
            test_runner,
            account,
            gumball_club_component,
            gumball_club_token,
            member_card_badge,
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
            "./transaction_manifest/gumball_club",
            Some(name),
            network
        )
        .err();

        self.test_runner.execute_manifest_ignoring_fee(
            manifest, 
            vec![NonFungibleGlobalId::from_public_key(&self.account.public_key)]
        )
    }

    pub fn dispense_gc_tokens(&mut self) -> TransactionReceipt {
        
        let manifest = ManifestBuilder::new()
            .call_method(
                self.gumball_club_component, 
                "dispense_gc_tokens", 
                manifest_args!()
            )
            .deposit_batch(self.account.account_address);

        self.execute_manifest_ignoring_fee(
            manifest.object_names(),
            manifest.build(),
            "dispense_gc_tokens",
            &NetworkDefinition::simulator()
        )
    }

    pub fn buy_member_card(&mut self, gc_token_amount: Decimal) -> TransactionReceipt {

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
                self.gumball_club_component, 
                "buy_member_card", 
                |lookup| (
                    lookup.bucket("gumball_club_token_bucket"),
                )
            )
            .deposit_batch(self.account.account_address);

        self.execute_manifest_ignoring_fee(
            manifest.object_names(), 
            manifest.build(), 
            "dispense_gc_tokens", 
            &NetworkDefinition::simulator()
        )
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

    let receipt = test_environment.dispense_gc_tokens();

    let commit = receipt.expect_commit_success();
    
    assert_eq!(
        commit.balance_changes(),
        &indexmap!(
            CONSENSUS_MANAGER.into() => indexmap!(
                XRD => BalanceChange::Fungible(commit.fee_summary.expected_reward_if_single_validator())),
            test_environment.test_runner.faucet_component().into() => indexmap!(
                XRD => BalanceChange::Fungible(-(commit.fee_summary.total_cost()))
            ),
            test_environment.account.account_address.into() => indexmap!(
                test_environment.gumball_club_token => BalanceChange::Fungible(dec!("20"))
            ),
        )
    );
}

#[test]
fn buy_member_card() {
    let mut test_environment = TestEnvironment::instantiate_test();
    test_environment.dispense_gc_tokens();

    let receipt = test_environment.buy_member_card(dec!(5));

    let commit = receipt.expect_commit_success();

    assert_eq!(
        commit.balance_changes(),
        &indexmap!(
            CONSENSUS_MANAGER.into() => indexmap!(
                XRD => BalanceChange::Fungible(commit.fee_summary.expected_reward_if_single_validator())),
            test_environment.test_runner.faucet_component().into() => indexmap!(
                XRD => BalanceChange::Fungible(-(commit.fee_summary.total_cost()))
            ),
            test_environment.account.account_address.into() => indexmap!(
                test_environment.member_card_badge => BalanceChange::NonFungible{ added: btreeset!(NonFungibleLocalId::integer(1)), removed: btreeset!()},
                test_environment.gumball_club_token => BalanceChange::Fungible(dec!("-5"))
            ),
            test_environment.gumball_club_component.into() => indexmap!(
                test_environment.gumball_club_token => BalanceChange::Fungible(dec!("5"))
            )
        )
    );

}
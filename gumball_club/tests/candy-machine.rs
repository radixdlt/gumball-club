use scrypto::blueprints::consensus_manager::TimePrecision;
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
    test_runner: TestRunner,
    account: Account,
    owner_badge: ResourceAddress,
    candy_machine_component: ComponentAddress,
    gumball_club_token: ResourceAddress,
    member_card_badge: ResourceAddress,
    candy_token: ResourceAddress,
}

impl TestEnvironment {

    pub fn instantiate_test() -> Self {
        let mut test_runner = TestRunner::builder().with_custom_genesis(
            CustomGenesis::default(Epoch::of(1), CustomGenesis::default_consensus_manager_config())
        )
        .without_trace()
        .build();

        // Create an account
        let (public_key, _private_key, account_address) = test_runner.new_allocated_account();
    
        let account = Account { public_key, account_address };

        let owner_badge = test_runner.create_fungible_resource(
            dec!(1), 
            0u8, 
            account_address
        );

        let spo_package_address = test_runner.compile_and_publish("../sugar_price_oracle");

        let manifest = ManifestBuilder::new()
            .call_function(
                spo_package_address, 
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

        let gc_package_address = test_runner.compile_and_publish(this_package!());

        let manifest = ManifestBuilder::new()
            .call_function(
                gc_package_address, 
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
        let candy_machine_component = commit_success.new_component_addresses()[2];
        let gumball_club_token = commit_success.new_resource_addresses()[0];
        let member_card_badge = commit_success.new_resource_addresses()[1];
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
            candy_machine_component,
            gumball_club_token,
            member_card_badge,
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
            "./transaction_manifest/candy_machine",
            Some(name),
            network
        )
        .err();

        self.test_runner.execute_manifest_ignoring_fee(
            manifest, 
            vec![NonFungibleGlobalId::from_public_key(&self.account.public_key)]
        )
    }

    pub fn buy_candy(&mut self, amount: Decimal) -> TransactionReceipt {

        let manifest = ManifestBuilder::new()
            .withdraw_from_account(
                self.account.account_address, 
                self.gumball_club_token, 
                amount
            )
            .take_all_from_worktop(
                self.gumball_club_token, 
                "gumball_club_token_bucket"
            )
            .call_method_with_name_lookup(
                self.candy_machine_component, 
                "buy_candy", 
                |lookup| (
                    lookup.bucket("gumball_club_token_bucket"),
                )
            )
            .deposit_batch(self.account.account_address);

        self.execute_manifest_ignoring_fee(
            manifest.object_names(),
            manifest.build(),
            "buy_candy",
            &NetworkDefinition::simulator(),
        )
    }

    pub fn buy_candy_with_member_card(&mut self, amount: Decimal) -> TransactionReceipt {

        let manifest = ManifestBuilder::new()
            .create_proof_from_account_of_non_fungibles(
                self.account.account_address, 
                self.member_card_badge, 
                &btreeset!(NonFungibleLocalId::integer(1)
            ))
            .withdraw_from_account(
                self.account.account_address, 
                self.gumball_club_token, 
                amount
            )
            .take_all_from_worktop(
                self.gumball_club_token, 
                "gumball_club_token_bucket"
            )
            .call_method_with_name_lookup(
                self.candy_machine_component, 
                "buy_candy_with_member_card", 
                |lookup| (
                    lookup.bucket("gumball_club_token_bucket"),
                )
            )
            .deposit_batch(self.account.account_address);

        self.execute_manifest_ignoring_fee(
            manifest.object_names(),
            manifest.build(),
            "buy_candy_with_member_card",
            &NetworkDefinition::simulator(),
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
                self.candy_machine_component, 
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
                self.candy_machine_component, 
                "change_member_card", 
                manifest_args!(new_member_card)
            );

        self.execute_manifest_ignoring_fee(
            manifest.object_names(),
            manifest.build(),
            "change_member_card",
            &NetworkDefinition::simulator(),
        )
    }

    pub fn get_price(&mut self) -> TransactionReceipt {
        let manifest = ManifestBuilder::new()
            .call_method(
                self.candy_machine_component, 
                "get_price", 
                manifest_args!()
            );
        
        self.execute_manifest_ignoring_fee(
            manifest.object_names(), 
            manifest.build(), 
            "get_price", 
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
fn get_price() {
    let mut test_environment = TestEnvironment::instantiate_test();

    let final_time_ms: i64 = 7200000;
    let mut proposer_timestamp_ms: i64 = 0;
    let incremental_proposer_timestamp_ms: i64 = 600000;
    let mut round: u64 = 2;
    let incremental_round: u64 = 1;

    let mut price_vec: Vec<Decimal> = Vec::new();
    
    while proposer_timestamp_ms <= final_time_ms {
    
        test_environment.test_runner.advance_to_round_at_timestamp(Round::of(round), proposer_timestamp_ms);
        let time_minutes = test_environment.test_runner.get_current_time(TimePrecision::Minute);
        let time_seconds = test_environment.test_runner.get_current_proposer_timestamp_ms();

        //
        let receipt = test_environment.get_price();
        println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));
        let price: Decimal = receipt.expect_commit_success().output(1);
        price_vec.push(price);

        //
        println!("Time Minutes: {:?}", time_minutes);
        println!("Time Second: {:?}", time_seconds);

        proposer_timestamp_ms += incremental_proposer_timestamp_ms;
        round += incremental_round;
    }

    println!("Price Vec: {:?}", price_vec);
}

#[test]
pub fn buy_candy() {
    let mut test_environment = TestEnvironment::instantiate_test();

    test_environment.test_runner.advance_to_round_at_timestamp(Round::of(2), 1800000);

    let receipt = test_environment.buy_candy(dec!(5));

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
            test_environment.account.account_address.into() => indexmap!(
                test_environment.gumball_club_token => BalanceChange::Fungible(dec!("-4.25")),
                test_environment.candy_token => BalanceChange::Fungible(dec!("1"))
            ),
            test_environment.candy_machine_component.into() => indexmap!(
                test_environment.gumball_club_token => BalanceChange::Fungible(dec!("4.25"))
            )
        )
    );
}

#[test]
pub fn buy_candy_with_member_card() {
    let mut test_environment = TestEnvironment::instantiate_test();

    test_environment.test_runner.advance_to_round_at_timestamp(Round::of(2), 1800000);

    let receipt = test_environment.buy_candy_with_member_card(dec!(5));

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
            test_environment.account.account_address.into() => indexmap!(
                test_environment.gumball_club_token => BalanceChange::Fungible(dec!("-4.25")),
                test_environment.candy_token => BalanceChange::Fungible(dec!("2"))
            ),
            test_environment.candy_machine_component.into() => indexmap!(
                test_environment.gumball_club_token => BalanceChange::Fungible(dec!("4.25"))
            )
        )
    );
}

#[test]
fn change_discount() {
    let mut test_environment = TestEnvironment::instantiate_test();

    let receipt = test_environment.change_discount(dec!(20));

    receipt.expect_commit_success();

    // Need to figure out how to query component state.
}

#[test]
fn change_member_card() {
    let mut test_environment = TestEnvironment::instantiate_test();
    let candy_machine_component = test_environment.candy_machine_component;

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
            candy_machine_component, 
            ObjectModuleId::Main, 
            RoleKey::from("member")
        )
        .build();

    let receipt = test_environment.test_runner.execute_manifest_ignoring_fee(manifest, 
        vec![NonFungibleGlobalId::from_public_key(&test_environment.account.public_key)]
    );

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let output = &receipt.expect_commit_success();
    println!("Output: {:?}", output);

    // Need to figure out how to compare changes to AuthorityModule

}


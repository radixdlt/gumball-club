use scrypto::prelude::*;
use scrypto_unit::*;
use transaction::builder::ManifestBuilder;
use chrono::{DateTime, Utc, TimeZone, ParseError};
use transaction::manifest::decompiler::ManifestObjectNames;
use transaction::prelude::TransactionManifestV1;
use radix_engine::transaction::TransactionReceipt;
use scrypto::blueprints::consensus_manager::TimePrecision::{Minute, self};


pub struct Account {
    public_key: Secp256k1PublicKey,
}

pub struct TestEnvironment {
    test_runner: TestRunner,
    account: Account,
    sugar_price_oracle_component: ComponentAddress,
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
        let account = Account { public_key };

        let package_address = test_runner.compile_and_publish(this_package!());
        
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

        let commit_success = receipt.expect_commit_success();

        let sugar_price_oracle_component = commit_success.new_component_addresses()[0];

        Self {
            test_runner,
            account,
            sugar_price_oracle_component
        }
    }

    pub fn to_seconds(&self, iso8601: &str) -> Result<i64, ParseError> {
        let dt = DateTime::parse_from_rfc3339(iso8601)?;

        Ok(dt.timestamp())
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

    pub fn get_price(&mut self) -> TransactionReceipt {
        let manifest = ManifestBuilder::new()
            .call_method(
                self.sugar_price_oracle_component, 
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

    pub fn get_last_updated(&mut self) -> TransactionReceipt {
        let manifest = ManifestBuilder::new()
            .call_method(
                self.sugar_price_oracle_component, 
                "get_times", 
                manifest_args!()
            );
        
        self.execute_manifest_ignoring_fee(
            manifest.object_names(), 
            manifest.build(), 
            "get_price", 
            &NetworkDefinition::simulator()
        )
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
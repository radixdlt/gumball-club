use scrypto::prelude::*;

#[blueprint]
mod sugar_price_oracle {
    struct SugarPriceOracle {
        starting_time: Instant,
    }
    impl SugarPriceOracle {
        pub fn instantiate_sugar_price_oracle() -> Global<SugarPriceOracle> {
            
            Self {
                starting_time: Clock::current_time_rounded_to_minutes(),
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .globalize()
        }

        pub fn get_price(&self) -> Decimal {
            
            let current_time_in_seconds = Clock::current_time_rounded_to_minutes().seconds_since_unix_epoch;
    
            let time = current_time_in_seconds - self.starting_time.seconds_since_unix_epoch;

            let half_period = 1800;
            
            let normalized_time = time % (2 * half_period);

            let max_value = dec!(5);
            let epsilon = dec!("0.10");
        
            let price = if normalized_time < half_period {
                // Linear rise for the first half (30 minutes)
                (Decimal::from(normalized_time) * max_value / Decimal::from(half_period)) + epsilon
            } else {
                // Linear fall for the second half (30 minutes)
                max_value - ((Decimal::from(normalized_time) 
                - Decimal::from(half_period)) * max_value
                / Decimal::from(half_period)) + epsilon
            };
            
            return price.round(2, RoundingMode::ToZero);
        }
    }
}

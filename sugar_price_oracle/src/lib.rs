use scrypto::prelude::*;

#[blueprint]
mod sugar_price_oracle {
    struct SugarPriceOracle {
        starting_time: Instant,
        last_updated: Instant,
    }
    impl SugarPriceOracle {
        pub fn instantiate_sugar_price_oracle() -> Global<SugarPriceOracle> {
            
            Self {
                starting_time: Clock::current_time_rounded_to_minutes(),
                last_updated: Clock::current_time_rounded_to_minutes(),
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .globalize()
        }

        pub fn get_price(&mut self) -> Decimal {
            let last_updated_in_seconds = self.last_updated.seconds_since_unix_epoch;
            let current_time_in_seconds = Clock::current_time_rounded_to_minutes().seconds_since_unix_epoch;
            let time = current_time_in_seconds - last_updated_in_seconds;

            let half_period = 1800;
            
            let normalized_time = time % (2 * half_period);
        
            let price = if normalized_time < half_period {
                // Linear rise for the first half (30 minutes)
                normalized_time * 5 / half_period
            } else {
                // Linear fall for the second half (30 minutes)
                5 - ((normalized_time - half_period) * 5 / half_period)
            };

            self.last_updated = Clock::current_time_rounded_to_minutes();

            return Decimal::from(price);
        }

        pub fn get_last_updated(&self) -> Instant {
            self.last_updated
        }
    }
}

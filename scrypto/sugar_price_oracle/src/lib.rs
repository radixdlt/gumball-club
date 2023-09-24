use scrypto::prelude::*;

#[blueprint]
mod sugar_price_oracle {
    struct SugarPriceOracle {
        starting_time: Instant,
    }
    impl SugarPriceOracle {
        pub fn instantiate_sugar_price_oracle(owner_role: OwnerRole) -> Global<SugarPriceOracle> {
            
            Self {
                starting_time: Clock::current_time_rounded_to_minutes(),
            }
            .instantiate()
            .prepare_to_globalize(owner_role)
            .metadata(metadata!(
                init {
                    "name" => "SugarPriceOracle Component", locked;
                    "description" => "Pseudo oracle that provides price of sugar.", locked;
                }
            ))
            .globalize()
        }

        pub fn get_price(&self) -> Decimal {
            
            let current_time_in_seconds = Clock::current_time_rounded_to_minutes().seconds_since_unix_epoch;
    
            let time = current_time_in_seconds - self.starting_time.seconds_since_unix_epoch;
            let half_period = 1800;

            let dec_normalized_time = Decimal::from(time % (2 * half_period));
            let dec_half_period = Decimal::from(half_period);

            let max_value = dec!("20");
            let epsilon = dec!("10");
        
            if dec_normalized_time < dec_half_period {
                // Linear rise for the first half (30 minutes)

                let proportion_of_time_passed =
                    dec_normalized_time
                    .checked_div(dec_half_period)
                    .unwrap();

                let linear_increase =
                    proportion_of_time_passed
                    .checked_mul(max_value)
                    .unwrap();

                let price_during_first_half =
                    if linear_increase < epsilon {
                        linear_increase
                        .checked_add(epsilon)
                        .unwrap()
                    } else {
                        linear_increase
                    };
                    
                return 
                price_during_first_half
                .checked_round(2, RoundingMode::ToZero)
                .unwrap()

            } else {
                // Linear fall for the second half (30 minutes)

                // This calculation represents the time that has elapsed within the second 
                // half of the total time period, which is used to determine the proportion 
                // of time passed within the second half.  
                // elapsed_time_in_second_half = dec_normalized_time - dec_half_period 
                let elapsed_time_in_second_half = 
                    dec_normalized_time
                    .checked_sub(dec_half_period)
                    .unwrap();

                // This calculation represents the proportion of time passed within the second 
                // half of the time period which indicates how far along the second half we are.
                // It will be used to scale the decrease in price.
                // proportion_of_time_passed = elapsed_time_in_second_half / dec_half_period
                let proportion_of_time_passed =
                    elapsed_time_in_second_half
                    .checked_div(dec_half_period)
                    .unwrap();

                // This calculation represents the linear decrease in the price during the 
                // second half of the time period.
                // linear_decrease = proportion_of_time_passed * max_value
                let linear_decrease = 
                    proportion_of_time_passed
                    .checked_mul(max_value)
                    .unwrap();

                // This calculation represents the price during the second half of the time period.
                // We then add a small value epsilon such that it does not approach zero. 
                // price_during_second_half = max_value - linear_decrease
                let price_during_second_half =
                    max_value
                    .checked_sub(linear_decrease)
                    .and_then(|result| {
                        if result < epsilon {
                            result.checked_add(epsilon)
                        } else {
                            Some(result)
                        }
                    })
                    .unwrap();

                return 
                price_during_second_half
                .checked_round(2, RoundingMode::ToZero)
                .unwrap()
            };
        }
    }
}

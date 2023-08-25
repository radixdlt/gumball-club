#!/bin/bash

set -e

# Build sugar oracle
cd ./scrypto/sugar_price_oracle
scrypto build

cd ../gumball_club
scrypto build
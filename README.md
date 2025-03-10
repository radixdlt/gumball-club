# Gumball Club

![Gumball Club](scrypto/image.png)

A decentralized application (dApp) built on the Radix DLT platform that showcases Scrypto concepts and provides a delightful user experience with the Radix Wallet.

## Project Overview

The Gumball Club is a collection of blueprints that facilitates the distribution of Gumball Club tokens and member card NFT badges. These can be used to purchase gumballs and candies from the GumballMachine and CandyMachine components.

### Key Features

- Users can dispense free Gumball Club tokens to purchase member cards, gumballs, and candies
- Member cards provide access to privileged methods and qualify for discounts
- Owners can configure component state and metadata
- Customizable blueprint instantiations
- Integration with external price oracle for dynamic pricing

## Project Structure

- **scrypto/** - smart contracts written in Scrypto
  - GumballClub Blueprint
  - GumballMachine Blueprint
  - CandyMachine Blueprint
  - SugarPriceOracle Blueprint
- **dapp/** - Frontend application built with Next.js
- **deploy/** - Deployment scripts and configurations

## Technologies Used

- **Backend**: Scrypto (Radix's smart contract language)
- **Frontend**: Next.js, React, TypeScript
- **Radix DLT**: Radix Dapp Toolkit, Babylon Gateway API SDK

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Radix Engine Simulator or access to Radix Network
- Radix Wallet (for testing with the dApp)

### Backend Setup (Scrypto)

See the detailed instructions in the [scrypto/README.md](scrypto/README.md) file.

### Frontend Setup (dApp)

1. Navigate to the dapp directory:

   ```bash
   cd dapp
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scrypto Concepts Demonstrated

- Radix Engine system-based authority model
- Native resources
- Finite state machine guaranteed resource management
- External blueprint package cross-component call
- Reusable blueprints
- Intent based transactions

## Additional Resources

- [Radix DLT Documentation](https://docs.radixdlt.com/)
- [Scrypto Documentation](https://docs-babylon.radixdlt.com/main/scrypto/introduction.html)
- [Radix Dapp Toolkit](https://github.com/radixdlt/radix-dapp-toolkit)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

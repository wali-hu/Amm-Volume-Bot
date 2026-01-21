# Raydium SDK V2 Demo

A comprehensive demonstration and implementation guide for the Raydium SDK V2, featuring trading operations, liquidity management, and atomic swaps on the Solana blockchain.

## Overview

Raydium is an automated market maker (AMM) and liquidity provider built on Solana. This project demonstrates how to interact with Raydium V2 using the latest SDK, providing practical examples for developers integrating with Raydium's trading infrastructure.

## Key Features

### Trading Operations
- **Buy/Sell Operations**: Execute swaps to buy and sell tokens on Raydium pools
- **Atomic Swaps**: Perform complex multi-token exchanges in a single transaction
- **Pool Inspection**: Query and analyze active liquidity pools

### Liquidity Management
- **Add Liquidity**: Provide liquidity to existing pools
- **Create Pools**: Set up new AMM pools and markets
- **Market Creation**: Initialize markets with proper configuration

### Advanced Features
- **Transaction Logging**: Track and analyze transaction execution
- **Pool Checking**: Verify pool state and parameters
- **Batch Operations**: Process multiple trades efficiently

## Project Structure

```
raydium-sdk-V2-demo/
├── src/
│   ├── amm/
│   │   ├── atomicSwap.ts           # Atomic swap implementation
│   │   ├── buy.ts                  # Token purchase operations
│   │   ├── sell.ts                 # Token sale operations
│   │   ├── sellAll.ts              # Bulk sell operations
│   │   ├── addLiquidity.ts         # Liquidity provision
│   │   ├── createAmmPoolCorrect.ts # Pool creation logic
│   │   ├── createMarketOnly.ts     # Market initialization
│   │   ├── setupTokenAccount.ts    # Token account setup
│   │   ├── checkPool.ts            # Pool state validation
│   │   ├── inspect.ts              # Pool inspection utilities
│   │   ├── testSwap.ts             # Swap testing
│   │   └── getTxLogs.ts            # Transaction log retrieval
│   ├── clmm/
│   │   └── marketMaker.ts          # Concentrated liquidity market maker
│   ├── config.ts                   # Configuration management
│   ├── util.ts                     # Utility functions
│   └── summary.md                  # Implementation details
├── js/
│   └── [Compiled JavaScript output from TypeScript]
├── package.json                    # Project dependencies
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

## Installation

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager
- Solana CLI tools (optional, for blockchain interaction)
- A valid Solana wallet with SOL for transaction fees

### Setup

1. Clone or download the repository:
```bash
cd raydium-sdk-V2-demo
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Build the TypeScript code:
```bash
npm run build
```

## Configuration

Edit `src/config.ts` to configure:
- RPC endpoint URL for blockchain connection
- Wallet keypair path
- Network settings (mainnet, devnet, testnet)
- Pool addresses
- Token mints

Example configuration structure:
```typescript
export const config = {
  rpcUrl: 'https://api.mainnet-beta.solana.com',
  wallet: './path/to/wallet.json',
  network: 'mainnet-beta',
  // ... other settings
}
```

## Available Commands

### Building
```bash
npm run build          # Compile TypeScript to JavaScript
npm run clean          # Clean build artifacts
```

### Development
```bash
npm run dev            # Run TypeScript directly with ts-node
```

### Running Examples
```bash
# Atomic swap example
ts-node src/amm/atomicSwap.ts

# Buy token example
ts-node src/amm/buy.ts

# Sell token example
ts-node src/amm/sell.ts

# Add liquidity example
ts-node src/amm/addLiquidity.ts

# Create pool example
ts-node src/amm/createAmmPoolCorrect.ts

# Pool inspection
ts-node src/amm/checkPool.ts
ts-node src/amm/inspect.ts

# Concentrated liquidity market maker
npm run clmm-market
```

## Usage Examples

### Basic Swap (Buy)

```typescript
import { buy } from './src/amm/buy';

const result = await buy({
  poolId: 'YOUR_POOL_ID',
  inputToken: 'SOL',
  outputToken: 'TOKEN_MINT',
  inputAmount: 1.0,
});

console.log('Swap successful:', result.txSignature);
```

### Atomic Swap

```typescript
import { atomicSwap } from './src/amm/atomicSwap';

const result = await atomicSwap({
  tokens: ['TOKEN_A_MINT', 'TOKEN_B_MINT', 'TOKEN_C_MINT'],
  amounts: [100, 200, 300],
});

console.log('Atomic swap executed:', result);
```

### Add Liquidity

```typescript
import { addLiquidity } from './src/amm/addLiquidity';

const result = await addLiquidity({
  poolId: 'YOUR_POOL_ID',
  tokenAAmount: 1000,
  tokenBAmount: 5000,
});

console.log('Liquidity added:', result.txSignature);
```

## API Reference

### Core Modules

#### AMM Module
Contains all Automated Market Maker operations for token swaps and liquidity management.

**Key Functions:**
- `atomicSwap()` - Execute multiple token swaps in one transaction
- `buy()` - Purchase tokens from a pool
- `sell()` - Sell tokens to a pool
- `addLiquidity()` - Provide liquidity to a pool
- `checkPool()` - Validate pool state and parameters
- `createAmmPoolCorrect()` - Create a new AMM pool

#### Configuration Module
Manages application settings and connection parameters.

**Exports:**
- `config` - Global configuration object
- `getNetwork()` - Get current network settings

#### Utilities Module
Helper functions for common operations.

**Exports:**
- `getProgramId()` - Get Raydium program IDs
- `getTokenDecimals()` - Fetch token decimal places
- `formatAmount()` - Format token amounts

## Important Considerations

### Security
- Store private keys securely, never commit them to version control
- Use environment variables for sensitive configuration
- Validate all input parameters before transactions
- Test thoroughly on devnet before using mainnet

### Performance
- Batch multiple transactions when possible
- Monitor RPC rate limits
- Cache pool data to reduce API calls
- Use connection pooling for multiple requests

### Gas Optimization
- Use atomic transactions to reduce network round trips
- Consider transaction size and fees
- Optimize for network congestion periods

## Error Handling

Common error scenarios and solutions:

```typescript
try {
  const result = await buy(swapParams);
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    console.error('Not enough SOL for transaction fees');
  } else if (error.code === 'SLIPPAGE_EXCEEDED') {
    console.error('Price slippage exceeded tolerance');
  } else if (error.code === 'INVALID_POOL') {
    console.error('Pool not found or invalid');
  } else {
    console.error('Swap failed:', error.message);
  }
}
```

## Troubleshooting

### Common Issues

**RPC Connection Fails**
- Verify the RPC endpoint is correct and accessible
- Check network connectivity
- Try alternative RPC providers

**Insufficient Funds**
- Ensure wallet has enough SOL for transaction fees
- Verify token balances before swaps
- Check account rent requirements

**Invalid Pool**
- Confirm pool ID exists on the network
- Verify tokens are trading on that pool
- Check pool hasn't been closed

**Transaction Timeout**
- Increase timeout values
- Verify RPC endpoint responsiveness
- Check Solana network status

## Dependencies

Key dependencies included in this project:

- `@raydium-io/raydium-sdk-v2`: Raydium SDK V2
- `@solana/web3.js`: Solana Web3 library
- `@solana/spl-token`: SPL Token program interactions
- `typescript`: TypeScript compiler
- `ts-node`: TypeScript execution runtime
- `decimal.js`: Precision decimal arithmetic

See `package.json` for complete dependency list and versions.

## Network Support

This project supports multiple Solana networks:

- **Mainnet-Beta**: Production network
- **Devnet**: Development and testing
- **Testnet**: Staging environment (rarely used)
- **Localnet**: Local testing with Solana validator

Switch networks by updating the RPC URL in configuration.

## Development Guide

### Building from Source

```bash
# Install dependencies
npm install

# Type check without emitting files
npx tsc --noEmit

# Compile TypeScript to JavaScript
npm run build

# Clean build artifacts
npm run clean
```

### Adding New Features

1. Create a new file in `src/amm/` for new functionality
2. Import necessary Raydium SDK modules
3. Implement your feature with proper error handling
4. Add tests for the new functionality
5. Update this README with usage examples

### Code Style

- Use TypeScript for type safety
- Follow standard naming conventions
- Add JSDoc comments for public functions
- Keep functions focused and single-purpose

## Testing

Manual testing approach:

1. Test on devnet first
2. Verify transactions using Solana Explorer
3. Check token balances and pool states
4. Test error conditions and edge cases

For automated testing:
```bash
# Run tests (if test suite exists)
npm test
```

## Supported Tokens

This project can work with any SPL token on Raydium, including:
- SOL (Wrapped SOL)
- USDC, USDT
- RAY (Raydium token)
- And thousands of other tokens listed on Raydium

Token addresses can be found on:
- [Raydium Platform](https://raydium.io)
- [Token Explorer](https://token.solflare.com)
- Solana Blockchain

## License

This project is licensed under the GPL-3.0 License. See LICENSE file for details.

## Support and Resources

### Documentation
- [Raydium Documentation](https://docs.raydium.io)
- [Solana Documentation](https://docs.solana.com)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)

### Community
- [Raydium Discord](https://discord.gg/raydium)
- [Solana Discord](https://discord.gg/solana)
- [GitHub Issues](./issues)

### Tools
- [Solana Explorer](https://explorer.solana.com)
- [Solscan](https://solscan.io)
- [Raydium AMM](https://raydium.io)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request

## Changelog

### Version 0.0.1-alpha
- Initial release with core AMM operations
- Support for atomic swaps
- Liquidity management features
- Pool inspection utilities

## Version Info

- **SDK Version**: Raydium SDK V2 (0.2.32-alpha)
- **Node Requirement**: 16.0+
- **Solana Chain**: Mainnet-Beta, Devnet, Testnet

## Disclaimer

This project is provided as-is for educational purposes. Trading on blockchain involves risk of financial loss. Always:

- Test with small amounts first
- Verify transactions before confirmation
- Keep private keys secure
- Understand the risks of AMM trading
- Do not risk funds you cannot afford to lose

## FAQ

**Q: Can I use this on mainnet?**
A: Yes, but test thoroughly on devnet first. Use small amounts initially.

**Q: What if a transaction fails?**
A: Check the error message, verify your configuration, and retry. Funds are returned on failed transactions.

**Q: How do I find a pool ID?**
A: Use Raydium's API or blockchain explorer to search for token pairs.

**Q: What are typical transaction fees?**
A: Solana fees are typically 0.00025 SOL per transaction, though they vary with network congestion.

**Q: Can I run multiple operations in parallel?**
A: Yes, but be aware of account locking and nonce issues. Use connection pooling for better performance.

---

**Last Updated**: January 2025

For more information or support, please refer to the official Raydium and Solana documentation.

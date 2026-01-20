# 🚀 Raydium AMM Trading Suite

A complete, production-ready suite of scripts for trading on Raydium AMM pools using Solana Devnet.

## 📌 What's Included

### ✅ Tested & Working
- **Raydium AMM Pool:** Fully functional on Devnet
- **Custom SPL Token:** Created and deployed
- **OpenBook Market:** Set up for the token pair
- **Trading Scripts:** Buy and Sell fully tested

### 📊 Verified Transactions
- **Buy (SOL → Token):** Successfully executed with hash
- **Sell (Token → SOL):** Successfully executed with hash
- **Slippage Protection:** 5% default, configurable
- **Price Computation:** Real-time calculation before execution

---

## 🎯 Quick Start (2 Minutes)

### Prerequisites
```bash
Node.js 16+
npm or yarn
```

### Installation
```bash
# Install dependencies (if not already done)
npm install
# or
yarn install
```

### Run Trading Scripts

**Buy Tokens:**
```bash
npx ts-node src/amm/buy.ts
```

**Sell Tokens:**
```bash
npx ts-node src/amm/sell.ts
```

---

## 📖 Complete Command Reference

| Command | Purpose | Output |
|---------|---------|--------|
| `npx ts-node src/amm/buy.ts` | Swap 0.1 SOL for ~79.79 tokens | TxHash + amount |
| `npx ts-node src/amm/sell.ts` | Swap 10 tokens for ~0.0114 SOL | TxHash + amount |
| `npx ts-node src/amm/testSwap.ts` | Generic swap test | TxHash + details |
| `npx ts-node src/amm/checkPool.ts` | Check pool status | Pool info |

---

## 🔧 Configuration

### Pool Information
Located in `src/amm/buy.ts` and `src/amm/sell.ts` (line ~15):
```typescript
const poolId = 'DdsMQzVueB5L7Rn5hMkzSz2BFCnQyVXbnA5cMUimT92C'
```

### Modify Swap Amounts

**Buy Script (`src/amm/buy.ts` line 32):**
```typescript
// Change this line to modify input amount (in lamports)
const inputAmount = new BN('100000000') // 0.1 SOL
```

**Sell Script (`src/amm/sell.ts` line 32):**
```typescript
// Change this line to modify input amount (in token units)
const inputAmount = new BN('10000000') // 10 tokens @ 6 decimals
```

### Modify Slippage Tolerance

Both scripts (around line 50):
```typescript
slippage: 0.05 // 5% = 0.05, 1% = 0.01, 10% = 0.10
```

---

## 📊 Verified Test Results

### ✅ Buy Transaction
```
Input:        0.1 SOL (100,000,000 lamports)
Expected:     83.98 tokens
Min Output:   79.79 tokens (5% slippage)
Price Impact: 1.81%
Transaction:  5Y1BzgGtJbSrEFHg1JgFuq7N8FyoB5rNhgpmMqKoKiemD9Ciqbrfs5FvhHq9dpKe4hUDktaPcRN92MfpsWnF1EXZ
Status:       ✅ Confirmed
```

### ✅ Sell Transaction
```
Input:        10 tokens (10,000,000 units @ 6 decimals)
Expected:     0.01204 SOL
Min Output:   0.01144 SOL (5% slippage)
Price Impact: 0.22%
Transaction:  E8Dq9C9EfNEtDMvQE8Ef3LSh31FL9uSfeDBnCg6sreaB7hjo433TmQWGrjUJvS97UGXk3Ax4cu3LrSWobGgTket
Status:       ✅ Confirmed
```

---

## 🔑 Pool & Token Details

```
Network:          Solana Devnet
Pool ID:          DdsMQzVueB5L7Rn5hMkzSz2BFCnQyVXbnA5cMUimT92C
Market ID:        qNETQX7roK2UgPNn3K49hffT6b4rfrAnowqMUHqWUm5

Base Token:       SOL
Address:          So11111111111111111111111111111111111111112
Decimals:         9

Quote Token:      Custom Token
Address:          8XG9JQF5ajQB3DXC2ANMJyo9QBzSovwEorH9EeRzzCgo
Decimals:         6

TVL:              $1,456.41
Status:           Active & Trading
```

---

## 💡 How It Works

### Buy Flow (SOL → Token)
```
1. User runs: npx ts-node src/amm/buy.ts
2. Fetch pool info and current reserves
3. Calculate output: input 0.1 SOL → output ~79.79 tokens
4. Apply 5% slippage: min output = ~75.79 tokens
5. Create swap instruction
6. Execute transaction with signatures
7. Wait for confirmation
8. Display results with transaction hash
```

### Sell Flow (Token → SOL)
```
1. User runs: npx ts-node src/amm/sell.ts
2. Fetch pool info and current reserves
3. Calculate output: input 10 tokens → output ~0.01204 SOL
4. Apply 5% slippage: min output = ~0.01144 SOL
5. Create swap instruction
6. Execute transaction with signatures
7. Wait for confirmation
8. Display results with transaction hash
```

---

## 🔒 Security

- ✅ Private key stored in `src/config.ts` (excluded from git)
- ✅ All transactions signed with keypair
- ✅ Network: Devnet only (testnet, not real money)
- ✅ Slippage protection prevents large losses
- ✅ Compute budget optimized for reliability

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `QUICK_START.md` | Get started in 2 minutes |
| `TRADING_COMMANDS.md` | Detailed command reference |
| `SWAP_GUIDE.md` | Technical swap explanation |
| `src/amm/buy.ts` | Buy script source code |
| `src/amm/sell.ts` | Sell script source code |

---

## 🛠️ Development

### Project Structure
```
src/
├── amm/
│   ├── buy.ts                    ← Buy tokens (SOL → Token)
│   ├── sell.ts                   ← Sell tokens (Token → SOL)
│   ├── testSwap.ts               ← Test swap
│   ├── checkPool.ts              ← Check pool status
│   ├── createAmmPoolCorrect.ts   ← Pool creation
│   ├── createMarketOnly.ts       ← Market creation
│   ├── setupTokenAccount.ts      ← Token account setup
│   └── addLiquidity.ts           ← Add liquidity
├── config.ts                      ← SDK configuration
└── util.ts                        ← Utilities
```

### Key Technologies
- **Raydium SDK V2** - AMM operations
- **Solana Web3.js** - Blockchain interaction
- **TypeScript** - Type safety
- **BN.js** - Large number handling
- **Decimal.js** - Precision calculations

---

## 🚀 Advanced Usage

### Create Your Own Pool
Modify `src/amm/createAmmPoolCorrect.ts` to create a new pool

### Change Token Pair
Edit pool ID in scripts to trade different tokens

### Batch Trading
Create a wrapper script that calls buy/sell multiple times

### Price Monitoring
Add loop to check prices before executing

---

## 🆘 Troubleshooting

### "Pool not found"
- Verify pool ID is correct
- Check network is Devnet
- Run `npx ts-node src/amm/checkPool.ts`

### "Insufficient balance"
- Buy: Ensure wallet has enough SOL
- Sell: Ensure wallet has enough tokens
- Check balance in wallet

### "Transaction failed"
- Increase slippage tolerance
- Increase compute budget units
- Wait a few blocks and retry

### "Connection timeout"
- Check internet connection
- Verify Devnet RPC is accessible
- Try again in a few seconds

---

## 📈 Next Steps

1. **Customize amounts** - Edit input amounts in scripts
2. **Add more pools** - Create scripts for other token pairs
3. **Automate trading** - Add cron jobs or webhooks
4. **Monitor performance** - Track price movements
5. **Build UI** - Create web interface for trading

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review SWAP_GUIDE.md for technical details
3. Check Solana documentation
4. Review Raydium SDK documentation

---

## 📝 License

GPL-3.0

---

## 🎉 You're All Set!

```bash
# To start trading, just run:
npx ts-node src/amm/buy.ts   # Buy tokens
npx ts-node src/amm/sell.ts  # Sell tokens
```

Enjoy! 🚀

---

**Last Updated:** January 2024
**SDK Version:** Raydium SDK V2 (0.2.32-alpha)
**Network:** Solana Devnet

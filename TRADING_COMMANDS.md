# 🚀 Raydium AMM Pool Trading Commands

## Pool Information
- **Pool ID:** `DdsMQzVueB5L7Rn5hMkzSz2BFCnQyVXbnA5cMUimT92C`
- **Base Token (SOL):** `So11111111111111111111111111111111111111112`
- **Quote Token (Custom):** `8XG9JQF5ajQB3DXC2ANMJyo9QBzSovwEorH9EeRzzCgo`
- **Market ID:** `qNETQX7roK2UgPNn3K49hffT6b4rfrAnowqMUHqWUm5`
- **TVL:** $1,456.41
- **Network:** Solana Devnet

---

## 📋 Available Scripts

### 1. **BUY Tokens** (SOL → Custom Token)
Convert SOL to custom tokens

**Command:**
```bash
npx ts-node src/amm/buy.ts
```

**What it does:**
- Swaps 0.1 SOL for ~79.79 custom tokens
- Applies 5% slippage protection
- Shows expected and minimum output
- Returns transaction hash

**Example Output:**
```
✅ BUY SUCCESSFUL!

Transaction Hash:
5Y1BzgGtJbSrEFHg1JgFuq7N8FyoB5rNhgpmMqKoKiemD9Ciqbrfs5FvhHq9dpKe4hUDktaPcRN92MfpsWnF1EXZ

You received: ~79.785243 tokens
```

---

### 2. **SELL Tokens** (Custom Token → SOL)
Convert custom tokens back to SOL

**Command:**
```bash
npx ts-node src/amm/sell.ts
```

**What it does:**
- Swaps 10 custom tokens for ~0.0114 SOL
- Applies 5% slippage protection
- Shows expected and minimum output
- Returns transaction hash

**Example Output:**
```
✅ SELL SUCCESSFUL!

Transaction Hash:
E8Dq9C9EfNEtDMvQE8Ef3LSh31FL9uSfeDBnCg6sreaB7hjo433TmQWGrjUJvS97UGXk3Ax4cu3LrSWobGgTket

You received: ~0.01143846 SOL
```

---

### 3. **TEST SWAP** (Custom - For Development)
General swap testing script

**Command:**
```bash
npx ts-node src/amm/testSwap.ts
```

---

## 🔄 Complete Trading Flow Example

### Step 1: Buy Tokens
```bash
$ npx ts-node src/amm/buy.ts
# Transaction: 5Y1BzgGtJbSrEFHg1JgFuq7N8FyoB5rNhgpmMqKoKiemD9Ciqbrfs5FvhHq9dpKe4hUDktaPcRN92MfpsWnF1EXZ
# Received: 79.785243 tokens
```

### Step 2: Wait for Confirmation (~15 seconds)

### Step 3: Sell Tokens
```bash
$ npx ts-node src/amm/sell.ts
# Transaction: E8Dq9C9EfNEtDMvQE8Ef3LSh31FL9uSfeDBnCg6sreaB7hjo433TmQWGrjUJvS97UGXk3Ax4cu3LrSWobGgTket
# Received: 0.01143846 SOL
```

---

## 📊 Transaction Details

### BUY Transaction
- **Input:** 0.1 SOL (100,000,000 lamports)
- **Expected Output:** 83.98 tokens
- **Min Output (5% slippage):** 79.79 tokens
- **Price Impact:** 1.81%

### SELL Transaction
- **Input:** 10 tokens (10,000,000 units @ 6 decimals)
- **Expected Output:** 0.01204 SOL
- **Min Output (5% slippage):** 0.01144 SOL
- **Price Impact:** 0.22%

---

## 🔗 View Transactions

View on Solana Explorer:

**Buy Transaction:**
https://explorer.solana.com/tx/5Y1BzgGtJbSrEFHg1JgFuq7N8FyoB5rNhgpmMqKoKiemD9Ciqbrfs5FvhHq9dpKe4hUDktaPcRN92MfpsWnF1EXZ?cluster=devnet

**Sell Transaction:**
https://explorer.solana.com/tx/E8Dq9C9EfNEtDMvQE8Ef3LSh31FL9uSfeDBnCg6sreaB7hjo433TmQWGrjUJvS97UGXk3Ax4cu3LrSWobGgTket?cluster=devnet

---

## ⚙️ How to Customize

### Edit Buy Amount
Open `src/amm/buy.ts` and change line:
```typescript
const inputAmount = new BN('100000000') // Change this (in lamports)
```

### Edit Sell Amount
Open `src/amm/sell.ts` and change line:
```typescript
const inputAmount = new BN('10000000') // Change this (in token units)
```

### Edit Slippage
Change slippage in both files (default 0.05 = 5%):
```typescript
slippage: 0.05 // Change to 0.01 for 1%, 0.10 for 10%, etc.
```

---

## 📝 Key Features

✅ **Automatic Token Account Creation** - Creates accounts if they don't exist
✅ **Price Computation** - Shows expected price before execution
✅ **Slippage Protection** - Prevents price impact losses (default 5%)
✅ **Transaction Confirmation** - Waits for on-chain confirmation
✅ **Detailed Output** - Shows amounts, price impact, and hash
✅ **Error Handling** - Detailed error messages if something goes wrong

---

## 🔐 Security Notes

- Private key is in `src/config.ts` (do NOT commit to git)
- All transactions are signed and sent to Devnet
- Slippage is set to 5% for protection
- Compute budget is optimized for reliability

---

## 🆘 Troubleshooting

### "Pool not found"
- Check pool ID is correct
- Verify network is Devnet
- Run `src/amm/checkPool.ts` to verify pool exists

### "Insufficient balance"
- Buy: Check wallet has enough SOL
- Sell: Check wallet has enough custom tokens

### "Transaction failed"
- Increase slippage tolerance
- Increase compute budget units
- Wait a few blocks and try again

---

## 📈 Next Steps

1. Modify amounts and test different trade sizes
2. Create buy/sell scripts for other pools
3. Add routing logic to find best pools
4. Set up automated trading
5. Create a web UI for trading

---

**Created:** 2024
**Network:** Solana Devnet
**SDK Version:** Raydium SDK V2 (0.2.32-alpha)

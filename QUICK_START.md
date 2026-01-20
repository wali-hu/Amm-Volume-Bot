# ⚡ Quick Start Guide - Raydium Trading

## 🎯 What You Can Do Now

You have a **fully functional Raydium AMM pool** on Solana Devnet with:
- ✅ Custom Token created and funded
- ✅ OpenBook market initialized
- ✅ AMM pool deployed with liquidity
- ✅ Buy and Sell scripts ready to use

---

## 📦 Scripts Available

| Script | Command | Action |
|--------|---------|--------|
| **BUY** | `npx ts-node src/amm/buy.ts` | Swap SOL → Custom Token |
| **SELL** | `npx ts-node src/amm/sell.ts` | Swap Custom Token → SOL |
| **TEST** | `npx ts-node src/amm/testSwap.ts` | General test swap |

---

## 🚀 Quick Commands to Run

### 1️⃣ Buy Tokens (SOL → Token)
```bash
npx ts-node src/amm/buy.ts
```
**Result:** You'll get the transaction hash and tokens received

### 2️⃣ Sell Tokens (Token → SOL)
```bash
npx ts-node src/amm/sell.ts
```
**Result:** You'll get the transaction hash and SOL received

### 3️⃣ Check Pool Status
```bash
npx ts-node src/amm/checkPool.ts
```
**Result:** Shows pool TVL, liquidity, and status

---

## ✅ Verified Transactions

### Successful BUY (SOL → Token)
```
✅ Input: 0.1 SOL
✅ Output: ~79.79 tokens
✅ TxHash: 5Y1BzgGtJbSrEFHg1JgFuq7N8FyoB5rNhgpmMqKoKiemD9Ciqbrfs5FvhHq9dpKe4hUDktaPcRN92MfpsWnF1EXZ
```

### Successful SELL (Token → SOL)
```
✅ Input: 10 tokens
✅ Output: ~0.0114 SOL
✅ TxHash: E8Dq9C9EfNEtDMvQE8Ef3LSh31FL9uSfeDBnCg6sreaB7hjo433TmQWGrjUJvS97UGXk3Ax4cu3LrSWobGgTket
```

---

## 🔑 Pool Information
- **Pool ID:** `DdsMQzVueB5L7Rn5hMkzSz2BFCnQyVXbnA5cMUimT92C`
- **Base Token:** SOL
- **Quote Token:** Custom Token (`8XG9JQF5ajQB3DXC2ANMJyo9QBzSovwEorH9EeRzzCgo`)
- **Network:** Solana Devnet

---

## 📝 File Locations

```
src/amm/
├── buy.ts                 ← Buy tokens (SOL → Token)
├── sell.ts                ← Sell tokens (Token → SOL)
├── testSwap.ts            ← General swap test
├── checkPool.ts           ← Check pool status
├── createAmmPoolCorrect.ts
├── createMarketOnly.ts
├── setupTokenAccount.ts
└── addLiquidity.ts
```

---

## 🔧 Customization

### Change Buy Amount
Edit `src/amm/buy.ts` line 32:
```typescript
const inputAmount = new BN('100000000') // 0.1 SOL in lamports
```

### Change Sell Amount
Edit `src/amm/sell.ts` line 32:
```typescript
const inputAmount = new BN('10000000') // 10 tokens
```

### Change Slippage
Edit both files (around line 50):
```typescript
slippage: 0.05 // 5% slippage tolerance
```

---

## 📊 What Happens When You Run Commands

### BUY Flow:
1. Fetch pool info from API
2. Calculate output amount with slippage
3. Create swap instruction
4. Execute transaction
5. Show transaction hash and amount received

### SELL Flow:
1. Fetch pool info from API
2. Calculate output amount with slippage
3. Create swap instruction
4. Execute transaction
5. Show transaction hash and amount received

---

## ✨ Features

✅ Real-time price calculation
✅ Slippage protection (5% default)
✅ Automatic token account creation
✅ Transaction confirmation
✅ Detailed error messages
✅ Beautiful formatted output

---

## 🎓 What You Learned

1. **Pool Creation** - How to create Raydium AMM pools
2. **Token Management** - Create, mint, and manage SPL tokens
3. **Market Setup** - Create OpenBook markets
4. **Swap Mechanics** - Calculate and execute swaps
5. **SDK Usage** - Use Raydium SDK V2 for DeFi operations

---

## 🚀 Try It Now!

```bash
# Buy tokens
npx ts-node src/amm/buy.ts

# Then sell them
npx ts-node src/amm/sell.ts
```

Enjoy! 🎉

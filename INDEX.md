# 📚 Documentation Index

## Quick Navigation

### 🚀 Getting Started (Start Here!)
- **[QUICK_START.md](QUICK_START.md)** - Get trading in 2 minutes ⚡

### 📖 Complete Documentation
- **[README_TRADING.md](README_TRADING.md)** - Full guide with all features 📚

### 📋 Reference Guides
- **[TRADING_COMMANDS.md](TRADING_COMMANDS.md)** - All commands and options 📋
- **[SWAP_GUIDE.md](SWAP_GUIDE.md)** - How swaps work technically 🔧

### 📊 Project Info
- **[summary.md](summary.md)** - Original project summary 📈

---

## 🎯 Your Commands

### Buy Tokens (SOL → Custom Token)
```bash
npx ts-node src/amm/buy.ts
```

### Sell Tokens (Custom Token → SOL)
```bash
npx ts-node src/amm/sell.ts
```

### Check Pool Status
```bash
npx ts-node src/amm/checkPool.ts
```

---

## 📁 Script Files

| File | Purpose |
|------|---------|
| `src/amm/buy.ts` | Buy script - Swap SOL for tokens |
| `src/amm/sell.ts` | Sell script - Swap tokens for SOL |
| `src/amm/testSwap.ts` | Test script - General swap testing |
| `src/amm/checkPool.ts` | Status script - Check pool information |

---

## ✅ Verified Results

### Buy Transaction
- **Input:** 0.1 SOL
- **Output:** ~79.79 tokens
- **Hash:** `5Y1BzgGtJbSrEFHg1JgFuq7N8FyoB5rNhgpmMqKoKiemD9Ciqbrfs5FvhHq9dpKe4hUDktaPcRN92MfpsWnF1EXZ`
- **Status:** ✅ Confirmed

### Sell Transaction
- **Input:** 10 tokens
- **Output:** ~0.01144 SOL
- **Hash:** `E8Dq9C9EfNEtDMvQE8Ef3LSh31FL9uSfeDBnCg6sreaB7hjo433TmQWGrjUJvS97UGXk3Ax4cu3LrSWobGgTket`
- **Status:** ✅ Confirmed

---

## �� Pool Information

| Detail | Value |
|--------|-------|
| **Network** | Solana Devnet |
| **Pool ID** | `DdsMQzVueB5L7Rn5hMkzSz2BFCnQyVXbnA5cMUimT92C` |
| **Market ID** | `qNETQX7roK2UgPNn3K49hffT6b4rfrAnowqMUHqWUm5` |
| **Base Token** | SOL |
| **Quote Token** | `8XG9JQF5ajQB3DXC2ANMJyo9QBzSovwEorH9EeRzzCgo` |
| **TVL** | $1,456.41 |

---

## 📖 Reading Order

1. **First Time?** → Read `QUICK_START.md` (5 mins)
2. **Need Details?** → Read `README_TRADING.md` (15 mins)
3. **Want Commands?** → Check `TRADING_COMMANDS.md` (reference)
4. **Technical Details?** → Read `SWAP_GUIDE.md` (10 mins)

---

## ✨ Features

✅ Buy and sell tokens  
✅ Real-time price calculation  
✅ Slippage protection  
✅ Transaction hashes returned  
✅ Beautiful formatted output  
✅ Easy to customize  
✅ Fully tested  

---

## 🆘 Troubleshooting

**Pool not found?**
- Run: `npx ts-node src/amm/checkPool.ts`

**Insufficient balance?**
- Check your wallet balance
- Buy: Need SOL
- Sell: Need custom tokens

**Transaction failed?**
- Increase slippage tolerance
- Try again after a few blocks

---

## 🎓 What You'll Learn

- How to create Raydium AMM pools
- How to create SPL tokens
- How to execute swaps
- How to use Raydium SDK V2
- How to handle Solana transactions

---

**Ready to trade?**

```bash
npx ts-node src/amm/buy.ts
```

Good luck! 🚀

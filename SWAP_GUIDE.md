# Raydium AMM Pool Swap Guide

## 🎉 Successful Swap Completed!

**Transaction Hash:** `3ytaJuP8QRa1vRMdjyxKCddMcvfxJ6d1XhZf9tbEe4j6bNdy4az3mGdAiJdopoLAsGjeoHhxZ5PGa96PqmuNE8UV`

### Swap Details
- **From:** 0.1 SOL (100,000,000 lamports)
- **To:** ~92.91 Custom Tokens (after 5% slippage)
- **Expected:** ~97.80 Custom Tokens (without slippage)
- **Pool ID:** `DdsMQzVueB5L7Rn5hMkzSz2BFCnQyVXbnA5cMUimT92C`
- **Price Impact:** 1.956%

## ⚠️ The Problem We Solved

The initial swap attempts failed with error:
```
Error: invalid params
```

This was because the SDK's `liquidity.swap()` function requires **both**:
1. `amountIn` - How much you're sending
2. `amountOut` - How much you expect to receive (minimum, with slippage applied)

## ✅ The Solution

### Step 1: Calculate Expected Output
Before calling swap, use `computeAmountOut()` to calculate the expected output:

```typescript
const { amountOut, minAmountOut, priceImpact } = raydium.liquidity.computeAmountOut({
  poolInfo,
  amountIn: inputAmount,
  mintIn: inputMint,
  mintOut: outputMint,
  slippage: 0.05, // 5% slippage tolerance
})
```

### Step 2: Execute Swap with Computed Amounts

```typescript
const { execute } = await raydium.liquidity.swap({
  poolInfo,
  poolKeys,
  inputMint,
  amountIn: inputAmount,
  amountOut: minAmountOut, // Use minimum with slippage
  fixedSide: 'in',         // Amount in is fixed
  txVersion,
  config: {
    inputUseSolBalance: true,  // SOL doesn't need token account
    outputUseSolBalance: false, // Custom token needs token account
  },
  computeBudgetConfig: {
    units: 600000,
    microLamports: 100000000,
  },
})

const { txId } = await execute({ sendAndConfirm: true })
```

## 📊 Key Parameters Explained

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `amountIn` | 100,000,000 (0.1 SOL) | Input amount in smallest units (lamports) |
| `amountOut` | 92,908,965 (92.91 tokens) | Minimum output with 5% slippage |
| `fixedSide` | 'in' | Fixes the input amount, output varies with price |
| `inputUseSolBalance` | true | Use account's SOL balance directly (no token account) |
| `outputUseSolBalance` | false | Create token account for custom token output |
| `slippage` | 0.05 | 5% price slippage tolerance |

## 🚀 How to Run

```bash
npx ts-node src/amm/testSwap.ts
```

## 📈 Next Steps

1. **Perform more swaps** - Try swapping tokens back to SOL
2. **Create another pool** - Use two custom SPL tokens instead of SOL
3. **Add liquidity** - Use the `addLiquidity()` function
4. **Check pool performance** - Monitor TVL and volume

## 🔗 References

- Pool ID: `DdsMQzVueB5L7Rn5hMkzSz2BFCnQyVXbnA5cMUimT92C`
- Market ID: `qNETQX7roK2UgPNn3K49hffT6b4rfrAnowqMUHqWUm5`
- Custom Token: `8XG9JQF5ajQB3DXC2ANMJyo9QBzSovwEorH9EeRzzCgo`

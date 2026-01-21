#!/bin/bash

# Atomic Buy-Sell Swap Script
# Usage: ./scripts/atomicSwap.sh [buyAmount] [sellAmount] [slippage]
#
# Examples:
#   ./scripts/atomicSwap.sh                    # Uses defaults (0.1 SOL, 10 tokens, 0.5%)
#   ./scripts/atomicSwap.sh 50000000           # Custom buy amount
#   ./scripts/atomicSwap.sh 100000000 5000000  # Custom buy and sell
#   ./scripts/atomicSwap.sh 100000000 10000000 0.01  # With 1% slippage

BUY_AMOUNT=${1:-100000000}       # 0.1 SOL (9 decimals)
SELL_AMOUNT=${2:-10000000}       # 10 tokens (6 decimals)
SLIPPAGE=${3:-0.005}             # 0.5%

echo "🔄 Running Atomic Buy-Sell Swap..."
echo "   Buy Amount: $BUY_AMOUNT lamports ($(echo "scale=9; $BUY_AMOUNT / 1000000000" | bc) SOL)"
echo "   Sell Amount: $SELL_AMOUNT units ($(echo "scale=6; $SELL_AMOUNT / 1000000" | bc) tokens)"
echo "   Slippage: $SLIPPAGE ($(echo "scale=2; $SLIPPAGE * 100" | bc)%)"
echo ""

npx ts-node src/amm/atomicSwap.ts \
  --buyAmount $BUY_AMOUNT \
  --sellAmount $SELL_AMOUNT \
  --slippage $SLIPPAGE

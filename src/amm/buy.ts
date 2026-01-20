import { initSdk, txVersion } from '../config'
import BN from 'bn.js'
import Decimal from 'decimal.js'

/**
 * BUY Script: Swap SOL → Custom Token
 * This script swaps SOL (base token) for custom tokens (quote token)
 */

const buyTokens = async () => {
  const raydium = await initSdk({ loadToken: true })
  const poolId = 'DdsMQzVueB5L7Rn5hMkzSz2BFCnQyVXbnA5cMUimT92C'
  
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    🛒 BUY TOKENS (SOL → Token)                ║
╚════════════════════════════════════════════════════════════════╝
  `)
  
  try {
    // Fetch pool data
    console.log('📊 Fetching pool information...')
    const poolData = await raydium.api.fetchPoolById({ ids: poolId })
    
    if (!poolData || poolData.length === 0) {
      console.error('❌ Pool not found')
      return
    }
    
    const pool = poolData[0]
    console.log('✅ Pool found!')
    console.log(`   Base Token: ${pool.mintA.symbol} (${pool.mintA.address})`)
    console.log(`   Quote Token: ${pool.mintB.symbol || 'Custom'} (${pool.mintB.address})`)
    
    // Get pool info from RPC
    const rpcData = await raydium.liquidity.getPoolInfoFromRpc({ poolId })
    const poolInfo = rpcData.poolInfo
    const poolKeys = rpcData.poolKeys
    
    // Buy 0.1 SOL worth of tokens
    const inputAmount = new BN('100000000') // 0.1 SOL (100M lamports)
    const inputMint = pool.mintA.address // SOL
    
    console.log(`
📈 Swap Details:
   Input: 0.1 SOL
   Slippage: 5%
   `)
    
    // Calculate output
    console.log('🔄 Computing swap amount...')
    const { amountOut, minAmountOut, priceImpact } = raydium.liquidity.computeAmountOut({
      poolInfo,
      amountIn: inputAmount,
      mintIn: inputMint,
      mintOut: pool.mintB.address,
      slippage: 0.05,
    })
    
    const expectedTokens = new Decimal(amountOut.toString()).div(10 ** 6)
    const minTokens = new Decimal(minAmountOut.toString()).div(10 ** 6)
    
    console.log(`✅ Computation Done:
   Expected Output: ${expectedTokens.toString()} tokens
   Min Output (5% slippage): ${minTokens.toString()} tokens
   Price Impact: ${priceImpact.toFixed(4)}%
    `)
    
    // Execute swap
    console.log('💱 Creating swap instruction...')
    const { execute } = await raydium.liquidity.swap({
      poolInfo,
      poolKeys,
      inputMint,
      amountIn: inputAmount,
      amountOut: minAmountOut,
      fixedSide: 'in',
      txVersion,
      config: {
        inputUseSolBalance: true,
        outputUseSolBalance: false,
      },
      computeBudgetConfig: {
        units: 600000,
        microLamports: 100000000,
      },
    })
    
    console.log('🚀 Executing transaction...\n')
    const { txId } = await execute({ sendAndConfirm: true })
    
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                      ✅ BUY SUCCESSFUL!                        ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Transaction Hash:                                            ║
║  ${txId}
║                                                                ║
║  You received: ~${minTokens.toString()} tokens                 ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `)
    
    return txId
    
  } catch (error) {
    console.error(`
╔════════════════════════════════════════════════════════════════╗
║                    ❌ BUY FAILED!                              ║
╚════════════════════════════════════════════════════════════════╝
    `)
    if (error instanceof Error) {
      console.error('Error:', error.message)
    } else {
      console.error(error)
    }
    throw error
  }
}

buyTokens()
  .then((txHash) => {
    if (txHash) {
      console.log('\n📋 Save this transaction hash for records!')
    }
    process.exit(0)
  })
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })

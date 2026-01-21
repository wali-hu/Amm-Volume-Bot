import { initSdk, txVersion } from '../config'
import BN from 'bn.js'
import Decimal from 'decimal.js'

/**
 * SELL Script: Swap Custom Token  SOL
 * This script swaps custom tokens (quote token) for SOL (base token)
 */

const sellTokens = async () => {
  const raydium = await initSdk({ loadToken: true })
  const poolId = 'DdsMQzVueB5L7Rn5hMkzSz2BFCnQyVXbnA5cMUimT92C'
  
  console.log(`

                    SELL TOKENS (Token  SOL)                

  `)
  
  try {
    // Fetch pool data
    console.log(' Fetching pool information...')
    const poolData = await raydium.api.fetchPoolById({ ids: poolId })
    
    if (!poolData || poolData.length === 0) {
      console.error(' Pool not found')
      return
    }
    
    const pool = poolData[0]
    console.log(' Pool found!')
    console.log(`   Base Token: ${pool.mintA.symbol} (${pool.mintA.address})`)
    console.log(`   Quote Token: ${pool.mintB.symbol || 'Custom'} (${pool.mintB.address})`)
    
    // Get pool info from RPC
    const rpcData = await raydium.liquidity.getPoolInfoFromRpc({ poolId })
    const poolInfo = rpcData.poolInfo
    const poolKeys = rpcData.poolKeys
    
    // Sell 10 tokens (6 decimals)
    const inputAmount = new BN('10000000') // 10 tokens (10 * 1e6)
    const inputMint = pool.mintB.address // Custom Token
    
    console.log(`
 Swap Details:
   Input: 10 Custom Tokens
   Slippage: 5%
   `)
    
    // Calculate output
    console.log(' Computing swap amount...')
    const { amountOut, minAmountOut, priceImpact } = raydium.liquidity.computeAmountOut({
      poolInfo,
      amountIn: inputAmount,
      mintIn: inputMint,
      mintOut: pool.mintA.address,
      slippage: 0.05,
    })
    
    const expectedSOL = new Decimal(amountOut.toString()).div(10 ** 9)
    const minSOL = new Decimal(minAmountOut.toString()).div(10 ** 9)
    
    console.log(` Computation Done:
   Expected Output: ${expectedSOL.toString()} SOL
   Min Output (5% slippage): ${minSOL.toString()} SOL
   Price Impact: ${priceImpact.toFixed(4)}%
    `)
    
    // Execute swap
    console.log(' Creating swap instruction...')
    const { execute } = await raydium.liquidity.swap({
      poolInfo,
      poolKeys,
      inputMint,
      amountIn: inputAmount,
      amountOut: minAmountOut,
      fixedSide: 'in',
      txVersion,
      config: {
        inputUseSolBalance: false,
        outputUseSolBalance: true,
      },
      computeBudgetConfig: {
        units: 600000,
        microLamports: 100000000,
      },
    })
    
    console.log(' Executing transaction...\n')
    const { txId } = await execute({ sendAndConfirm: true })
    
    console.log(`

                      SELL SUCCESSFUL!                        

                                                                
  Transaction Hash:                                            
  ${txId}
                                                                
  You received: ~${minSOL.toString()} SOL                        
                                                                

    `)
    
    return txId
    
  } catch (error) {
    console.error(`

                    SELL FAILED!                              

    `)
    if (error instanceof Error) {
      console.error('Error:', error.message)
    } else {
      console.error(error)
    }
    throw error
  }
}

sellTokens()
  .then((txHash) => {
    if (txHash) {
      console.log('\n Save this transaction hash for records!')
    }
    process.exit(0)
  })
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })

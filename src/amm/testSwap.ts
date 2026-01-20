import { initSdk, txVersion } from '../config'
import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import Decimal from 'decimal.js'

const performSwap = async () => {
  const raydium = await initSdk({ loadToken: true })
  const poolId = 'DdsMQzVueB5L7Rn5hMkzSz2BFCnQyVXbnA5cMUimT92C'
  
  console.log('🔍 Fetching pool information...')
  
  try {
    // Fetch pool data via API
    const poolData = await raydium.api.fetchPoolById({ ids: poolId })
    
    if (!poolData || poolData.length === 0) {
      console.error('❌ Pool not found')
      return
    }
    
    const pool = poolData[0]
    console.log('✅ Pool found!')
    console.log('Pool ID:', pool.id)
    console.log('TVL:', pool.tvl)
    console.log('Base Token:', pool.mintA.symbol, '-', pool.mintA.address)
    console.log('Quote Token:', pool.mintB.symbol, '-', pool.mintB.address)
    
    // Get pool info from RPC
    const rpcData = await raydium.liquidity.getPoolInfoFromRpc({ poolId })
    const poolInfo = rpcData.poolInfo
    const poolKeys = rpcData.poolKeys
    
    // Input amount: 0.1 SOL
    const inputAmount = new BN('100000000')
    const inputMint = pool.mintA.address // SOL
    
    console.log('\n📊 Computing swap amount...')
    
    // Calculate output amount with slippage
    const { amountOut, minAmountOut, priceImpact } = raydium.liquidity.computeAmountOut({
      poolInfo,
      amountIn: inputAmount,
      mintIn: inputMint,
      mintOut: pool.mintB.address,
      slippage: 0.05,
    })
    
    console.log('Input: 0.1 SOL')
    console.log('Expected Output:', new Decimal(amountOut.toString()).div(10 ** 6).toString(), 'tokens')
    console.log('Min Output (5% slippage):', new Decimal(minAmountOut.toString()).div(10 ** 6).toString(), 'tokens')
    console.log('Price Impact:', priceImpact.toFixed(4), '%')
    
    console.log('\n💱 Setting up swap...')
    
    // Now perform the swap with computed amountOut
    const { execute } = await raydium.liquidity.swap({
      poolInfo,
      poolKeys,
      inputMint,
      amountIn: inputAmount,
      amountOut: minAmountOut, // Use min amount with slippage
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
    
    console.log('✅ Swap instruction prepared')
    console.log('🚀 Executing transaction...')
    
    const { txId } = await execute({ sendAndConfirm: true })
    
    console.log('\n🎉 SWAP SUCCESSFUL!')
    console.log('Transaction Hash:', txId)
    
    return txId
    
  } catch (error) {
    console.error('❌ Swap failed:')
    if (error instanceof Error) {
      console.error('Error:', error.message)
      if (error.stack) console.error('Stack:', error.stack.split('\n').slice(0, 5).join('\n'))
    } else {
      console.error(error)
    }
    throw error
  }
}

performSwap()
  .then((txHash) => {
    if (txHash) {
      console.log('\n✅ Complete! Transaction:', txHash)
    }
  })
  .catch(console.error)

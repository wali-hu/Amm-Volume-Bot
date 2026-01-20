import { initSdk, txVersion } from '../config'
import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

export const addLiquiditySimple = async () => {
  console.log('Adding Liquidity to Existing Pool...')
  
  const raydium = await initSdk()
  
  // Our existing pool details
  const poolId = 'D869DJYsXgyQrBCoc8CEfehwc7jy7MRCKog4L4RA637E'
  
  console.log('Pool ID:', poolId)
  
  try {
    // Get pool info via RPC (this works from our previous tests)
    console.log('Getting pool info from RPC...')
    const poolData = await raydium.liquidity.getPoolInfoFromRpc({ poolId })
    
    console.log('Pool data retrieved successfully')
    console.log('Pool keys available:', Object.keys(poolData))
    
    // Use the poolInfo from RPC data
    const poolInfo = poolData.poolInfo
    const poolKeys = poolData.poolKeys
    
    console.log('Pool Info ID:', poolInfo.id)
    console.log('Pool Type:', poolInfo.type)
    
    // Define amounts to add (smaller amounts to avoid issues)
    const baseAmountBN = new BN('100000000') // 0.1 SOL
    const quoteAmountBN = new BN('100000000') // 100 tokens (6 decimals)
    
    console.log('Adding liquidity:')
    console.log('Base amount:', baseAmountBN.div(new BN(10**9)).toString(), 'SOL')
    console.log('Quote amount:', quoteAmountBN.div(new BN(10**6)).toString(), 'tokens')
    
    // Create the add liquidity transaction
    const { execute, extInfo } = await raydium.liquidity.addLiquidity({
      poolInfo: poolInfo as any, // Type assertion to bypass strict typing
      poolKeys,
      amountInA: {
        token: poolInfo.mintA,
        amount: baseAmountBN
      } as any,
      amountInB: {
        token: poolInfo.mintB, 
        amount: quoteAmountBN
      } as any,
      otherAmountMin: {
        token: poolInfo.mintB,
        amount: new BN('90000000') // 90 tokens minimum (10% slippage)
      } as any,
      fixedSide: 'a' as any,
      txVersion,
      computeBudgetConfig: {
        units: 600000,
        microLamports: 100000000,
      },
    })
    
    console.log('Executing add liquidity transaction...')
    
    // Execute the transaction
    const result = await execute({ sendAndConfirm: true })
    
    console.log('SUCCESS!')
    console.log('Add Liquidity Transaction Hash:', result.txId)
    
    if (extInfo?.lpAmount) {
      console.log('LP Tokens Received:', extInfo.lpAmount.toString())
    }
    
    return {
      txId: result.txId,
      poolId: poolId,
      lpAmount: extInfo?.lpAmount?.toString() || 'Unknown'
    }
    
  } catch (error: any) {
    console.error('Add liquidity failed:', error)
    
    // If it's a transaction error, try to get more details
    if (error.txId) {
      console.log('Transaction ID for debugging:', error.txId)
    }
    
    throw error
  }
}

// Execute the function
addLiquiditySimple()
  .then((result) => {
    console.log('\n=== FINAL RESULT ===')
    console.log('Pool ID:', result.poolId)
    console.log('Transaction Hash:', result.txId)
    console.log('LP Tokens:', result.lpAmount)
    console.log('===================')
  })
  .catch((error) => {
    console.error('\n=== FAILED ===')
    console.error('Error:', error.message)
    console.error('=============')
  })

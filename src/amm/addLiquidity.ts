import { initSdk, txVersion } from '../config'
import BN from 'bn.js'

export const addLiquidity = async () => {
  console.log('Adding Liquidity to Pool...')
  
  const raydium = await initSdk()
  
  // Pool ID from previous creation
  const poolId = 'D869DJYsXgyQrBCoc8CEfehwc7jy7MRCKog4L4RA637E'
  
  console.log('Pool ID:', poolId)
  
  try {
    // Get pool info first
    const data = await raydium.api.fetchPoolById({ ids: poolId })
    const poolInfo = data[0]
    
    if (!poolInfo) {
      throw new Error('Pool not found')
    }
    
    console.log('Pool found:', poolInfo.id)
    
    // Add liquidity amounts (smaller amounts)
    const baseAmount = new BN(500000000) // 0.5 SOL
    const quoteAmount = new BN(500000000) // 500 tokens
    
    console.log('Adding liquidity amounts:')
    console.log('Base (SOL):', baseAmount.div(new BN(10**9)).toString())
    console.log('Quote (Token):', quoteAmount.div(new BN(10**6)).toString())
    
    // Use liquidity module
    const { execute } = await raydium.liquidity.addLiquidity({
      poolInfo,
      amountInA: baseAmount,
      amountInB: quoteAmount,
      fixedSide: 'a',
      txVersion,
    })
    
    console.log('Executing transaction...')
    const { txId } = await execute({ sendAndConfirm: true })
    
    console.log('SUCCESS!')
    console.log('Transaction ID:', txId)
    
    return txId
    
  } catch (error) {
    console.error('Failed:', error)
    throw error
  }
}

addLiquidity().catch(console.error)

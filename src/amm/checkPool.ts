import { initSdk } from '../config'
import { PublicKey } from '@solana/web3.js'

export const checkPoolLiquidity = async () => {
  console.log('Checking Pool Liquidity...')
  
  const raydium = await initSdk()
  
  // Our new pool ID
  const poolId = 'DdsMQzVueB5L7Rn5hMkzSz2BFCnQyVXbnA5cMUimT92C'
  
  try {
    // Method 1: Check via API
    console.log('Fetching pool data via API...')
    const poolData = await raydium.api.fetchPoolById({ ids: poolId })
    
    if (poolData && poolData.length > 0) {
      const pool = poolData[0]
      console.log('Pool found!')
      console.log('Pool ID:', pool.id)
      console.log('Pool Type:', pool.type)
      console.log('TVL:', pool.tvl)
      console.log('Volume 24h:', pool.day?.volume)
      
      if (pool.type === 'Standard') {
        console.log('Base Token:', pool.mintA.symbol, pool.mintA.address)
        console.log('Quote Token:', pool.mintB.symbol, pool.mintB.address)
        console.log('LP Amount:', pool.lpAmount)
        console.log('LP Price:', pool.lpPrice)
      }
    } else {
      console.log('Pool not found in API')
    }
    
    // Method 2: Check via RPC
    console.log('\nFetching pool data via RPC...')
    const rpcData = await raydium.liquidity.getPoolInfoFromRpc({ poolId })
    console.log('RPC Pool Keys:', Object.keys(rpcData))
    
    if (rpcData.poolInfo) {
      console.log('Pool Info available via RPC')
    }
    
  } catch (error) {
    console.error('Error checking pool:', error)
  }
}

checkPoolLiquidity().catch(console.error)

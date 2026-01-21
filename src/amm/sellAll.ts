import { initSdk, fetchTokenAccountData, txVersion, owner } from '../config'
import Decimal from 'decimal.js'

/**
 * SELL ALL Script: Sell all tokens in wallet
 * This script checks wallet balance and sells all tokens for SOL
 */

const sellAllTokens = async () => {
  const raydium = await initSdk({ loadToken: true })
  const poolId = 'DdsMQzVueB5L7Rn5hMkzSz2BFCnQyVXbnA5cMUimT92C'
  
  console.log(`

               WALLET BALANCE CHECK & SELL ALL                

  `)
  
  try {
    // Fetch token account data
    console.log(' Fetching wallet balances...')
    const tokenAccountData = await fetchTokenAccountData()
    
    console.log(` Wallet: ${owner.publicKey.toBase58()}`)
    console.log(`\n Token Balances:`)
    
    if (tokenAccountData.tokenAccounts.length === 0) {
      console.log('   No token accounts found!')
      return
    }
    
    console.log(`   Token Accounts (${tokenAccountData.tokenAccounts.length}):`)
    tokenAccountData.tokenAccounts.forEach((token, index) => {
      const isSOL = token.isNative
      const symbol = isSOL ? 'SOL' : 'Custom'
      const decimals = isSOL ? 9 : 6
      const displayAmount = new Decimal(token.amount.toString()).div(10 ** decimals).toString()
      console.log(`   ${index + 1}. ${symbol} - ${displayAmount} (Mint: ${token.mint.toBase58()})`)
    })
    
    // Fetch pool data
    console.log('\n Fetching pool information...')
    const poolData = await raydium.api.fetchPoolById({ ids: poolId })
    
    if (!poolData || poolData.length === 0) {
      console.error(' Pool not found')
      return
    }
    
    const pool = poolData[0]
    console.log(' Pool found!')
    console.log(`   Base Token: ${pool.mintA.symbol} (${pool.mintA.address})`)
    console.log(`   Quote Token: ${pool.mintB.symbol || 'Custom'} (${pool.mintB.address})`)
    
    // Find the custom token (not SOL)
    const customToken = tokenAccountData.tokenAccounts.find(
      token => !token.isNative
    )
    
    if (!customToken || customToken.amount.isZero?.() || customToken.amount.toNumber?.() === 0) {
      console.log('\n No custom tokens to sell!')
      return
    }
    
    // Get pool info from RPC
    const rpcData = await raydium.liquidity.getPoolInfoFromRpc({ poolId })
    const poolInfo = rpcData.poolInfo
    const poolKeys = rpcData.poolKeys
    
    const inputAmount = customToken.amount
    const decimals = 6 // Custom token decimals
    
    console.log(`
 Swap Details:
   Input: ${new Decimal(customToken.amount.toString()).div(10 ** decimals).toString()} Custom Tokens
   Token Mint: ${customToken.mint.toBase58()}
   Slippage: 5%
    `)
    
    // Calculate output
    console.log(' Computing swap amount...')
    const { amountOut, minAmountOut, priceImpact } = raydium.liquidity.computeAmountOut({
      poolInfo,
      amountIn: inputAmount,
      mintIn: customToken.mint.toBase58(),
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
      inputMint: customToken.mint.toBase58(),
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

                   SELL ALL SUCCESSFUL!                       

                                                                
  Transaction Hash:                                            
  ${txId}
                                                                
  Tokens Sold: ${new Decimal(customToken.amount.toString()).div(10 ** decimals).toString()}
  You received: ~${minSOL.toString()} SOL                        
                                                                

    `)
    
    return txId
    
  } catch (error) {
    console.error(`

                OPERATION FAILED!                             

    `)
    if (error instanceof Error) {
      console.error('Error:', error.message)
    } else {
      console.error(error)
    }
    throw error
  }
}

sellAllTokens()
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

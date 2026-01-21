import { 
  DEVNET_PROGRAM_ID,
  WSOLMint,
} from '@raydium-io/raydium-sdk-v2'
import { 
  createMint,
  TOKEN_PROGRAM_ID 
} from '@solana/spl-token'
import { initSdk, txVersion, owner, connection } from '../config'

export const createMarketOnly = async () => {
  console.log(' Creating Market on Devnet...')
  console.log('Wallet:', owner.publicKey.toBase58())
  
  const raydium = await initSdk()

  // Step 1: Create a simple token
  console.log(' Creating custom token...')
  const customMint = await createMint(
    connection,
    owner,
    owner.publicKey,
    null, // No freeze authority
    6 // 6 decimals
  )
  
  console.log(' Custom token created:', customMint.toBase58())

  // Step 2: Create market
  console.log(' Creating market...')
  try {
    const { execute, extInfo } = await raydium.marketV2.create({
      baseInfo: {
        mint: WSOLMint,
        decimals: 9,
      },
      quoteInfo: {
        mint: customMint,
        decimals: 6,
      },
      lotSize: 1,
      tickSize: 0.01,
      dexProgramId: DEVNET_PROGRAM_ID.OPEN_BOOK_PROGRAM,
      txVersion,
      computeBudgetConfig: {
        units: 600000,
        microLamports: 100000000, // Higher priority fee
      },
    })

    const txIds = await execute({ sequentially: true })
    console.log(' Market created successfully!')
    console.log(' Market ID:', extInfo.address.marketId.toBase58())
    console.log(' Transaction Hashes:', txIds)
    console.log(' Custom Token:', customMint.toBase58())
    
    return {
      marketId: extInfo.address.marketId.toBase58(),
      txHashes: txIds,
      customToken: customMint.toBase58()
    }

  } catch (error) {
    console.error(' Error:', error)
    throw error
  }
}

// Execute
createMarketOnly()
  .then((result) => {
    console.log('\n SUCCESS! Market Created:')
    console.log('Market ID:', result.marketId)
    console.log('Transaction Hashes:', result.txHashes)
    console.log('Custom Token:', result.customToken)
    console.log('\n Next Steps:')
    console.log('1. Use this Market ID to create an AMM pool')
    console.log('2. Market ID:', result.marketId)
  })
  .catch((error) => {
    console.error(' Failed to create market:', error.message || error)
  })

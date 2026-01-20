import { 
  getOrCreateAssociatedTokenAccount, 
  mintTo,
  createMint,
  getAccount
} from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { owner, connection } from '../config'

export const setupTokenAccount = async () => {
  console.log('🔧 Setting up token account...')
  
  // New custom token from market creation
  const customToken = new PublicKey('8XG9JQF5ajQB3DXC2ANMJyo9QBzSovwEorH9EeRzzCgo')
  
  try {
    console.log('📍 Token mint:', customToken.toString())
    
    // Check if mint exists first
    const mintInfo = await connection.getAccountInfo(customToken)
    if (!mintInfo) {
      throw new Error('Token mint does not exist')
    }
    console.log('✅ Token mint exists')
    
    // Create associated token account (will create if doesn't exist)
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      owner, // payer
      customToken, // mint
      owner.publicKey // owner
    )
    
    console.log('✅ Token account:', tokenAccount.address.toBase58())
    
    // Mint tokens to the account (increase amount for pool)
    const mintAmount = 10000 * 10 ** 6 // 10,000 tokens with 6 decimals
    
    console.log('Creating token account...')
    const mintTx = await mintTo(
      connection,
      owner, // payer
      customToken, // mint
      tokenAccount.address, // destination
      owner, // mint authority (wallet is the authority)
      mintAmount
    )
    
    console.log(`✅ Minted ${mintAmount / 10**6} tokens`)
    console.log('🔗 Mint transaction:', mintTx)
    
    // Verify balance
    const accountInfo = await getAccount(connection, tokenAccount.address)
    console.log('💰 Token balance:', accountInfo.amount.toString())
    
    return {
      tokenAccount: tokenAccount.address.toBase58(),
      mintTx: mintTx,
      balance: accountInfo.amount.toString()
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  }
}

// Execute
setupTokenAccount()
  .then((result) => {
    console.log('\n🎉 Token account setup complete!')
    console.log('Token Account:', result.tokenAccount)
    console.log('Balance:', result.balance)
    console.log('Mint Transaction:', result.mintTx)
  })
  .catch((error) => {
    console.error('❌ Failed:', error.message)
  })

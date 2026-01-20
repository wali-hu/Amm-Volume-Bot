import {
  MARKET_STATE_LAYOUT_V3,
  DEVNET_PROGRAM_ID,
} from '@raydium-io/raydium-sdk-v2'
import { initSdk, txVersion } from '../config'
import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

export const createAmmPoolFinal = async () => {
  const raydium = await initSdk()
  const marketId = new PublicKey('J6WDEkge8i4Nir99odM2wkC86AquYHBgmcqqUVPVV8wc') // New market

  const marketBufferInfo = await raydium.connection.getAccountInfo(marketId)
  const { baseMint, quoteMint } = MARKET_STATE_LAYOUT_V3.decode(marketBufferInfo!.data)

  const baseMintInfo = await raydium.token.getTokenInfo(baseMint)
  const quoteMintInfo = await raydium.token.getTokenInfo(quoteMint)
  
  console.log('Base mint:', baseMint.toBase58(), 'decimals:', baseMintInfo.decimals)
  console.log('Quote mint:', quoteMint.toBase58(), 'decimals:', quoteMintInfo.decimals)

  const { execute, extInfo } = await raydium.liquidity.createPoolV4({
    programId: DEVNET_PROGRAM_ID.AMM_V4,
    marketInfo: {
      marketId,
      programId: DEVNET_PROGRAM_ID.OPEN_BOOK_PROGRAM,
    },
    baseMintInfo: {
      mint: baseMint,
      decimals: baseMintInfo.decimals,
    },
    quoteMintInfo: {
      mint: quoteMint,
      decimals: quoteMintInfo.decimals,
    },
    baseAmount: new BN('5000000000'), // 5 SOL (5e9 lamports)
    quoteAmount: new BN('5000000000'), // 5000 tokens (5e9 units for 6 decimals)

    startTime: new BN(0),
    ownerInfo: {
      useSOLBalance: true,
    },
    associatedOnly: false,
    txVersion,
    feeDestinationId: DEVNET_PROGRAM_ID.FEE_DESTINATION_ID,
    computeBudgetConfig: {
      units: 600000,
      microLamports: 100000000,
    },
  })

  const { txId } = await execute({ sendAndConfirm: true })
  console.log('🎉 AMM pool created! txId:', txId)
  console.log('💰 Pool ID:', extInfo.address.ammId.toBase58())
  
  return {
    poolId: extInfo.address.ammId.toBase58(),
    txHash: txId
  }
}

createAmmPoolFinal()
  .then((result) => {
    console.log('\n🏁 SUCCESS!')
    console.log('Pool ID:', result.poolId)
    console.log('Transaction Hash:', result.txHash)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
  })

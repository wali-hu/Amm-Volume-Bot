import { initSdk, fetchTokenAccountData } from '../config'

const inspect = async () => {
  await initSdk({ loadToken: true })
  const data = await fetchTokenAccountData()
  console.log('Token Accounts:')
  data.tokenAccounts.forEach((token, i) => {
    console.log(`\n${i}. Mint: ${token.mint.toBase58()}`)
    console.log(`   Amount: ${token.amount.toString()}`)
    console.log(`   Is Native: ${token.isNative}`)
    console.log(`   Is Associated: ${token.isAssociated}`)
  })
}

inspect().catch(console.error)

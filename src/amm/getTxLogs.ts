import { connection } from '../config'

const getTxLogs = async () => {
  const txId = 'M79Pmys4UUjNwheHEe8JTjYQ4CYWyqwcQH6Fg7PHwZ3ocgnGgaNV378yVMY7twL5j3KvR8qV14QxqJGx1rmnFPi'
  
  const txDetails = await connection.getTransaction(txId, { 
    commitment: 'confirmed',
    maxSupportedTransactionVersion: 0
  })
  console.log(' Transaction Error:', txDetails?.meta?.err)
  console.log(' Log Messages:')
  txDetails?.meta?.logMessages?.forEach((log, i) => {
    console.log(`${i}: ${log}`)
  })
}

getTxLogs().catch(console.error)

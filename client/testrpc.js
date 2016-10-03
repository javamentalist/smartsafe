import TestRPC from 'ethereumjs-testrpc'
import accounts from './accounts.json'

const PORT = 8545
const server = TestRPC.server({ accounts })

server.listen(PORT, (err, blockchain) => {
  if (err) console.log(err)
  Object.keys(blockchain.accounts).forEach(address => {
    const account = blockchain.accounts[address]
    console.log(address)
    console.log(account.secretKey.toString('hex'))
  })
})

export const migrate = async (contract, account) => {
  return contract.methods
    .migrateRewardToken()
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export default migrate

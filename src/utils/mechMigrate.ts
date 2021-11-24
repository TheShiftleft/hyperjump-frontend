export const mechMigrate = async (contract, account) => {
  return contract.methods
    .migrateMechToken()
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export default mechMigrate

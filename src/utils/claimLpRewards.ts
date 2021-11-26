export const claimLpRewards = async (contract, account) => {
  return contract.methods
    .claim()
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export default claimLpRewards

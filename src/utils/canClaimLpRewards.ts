export const canClaimLpRewards = async (contract, account) => {
  return contract.methods
    .canClaim()
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export default canClaimLpRewards

/*
export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
} 
*/

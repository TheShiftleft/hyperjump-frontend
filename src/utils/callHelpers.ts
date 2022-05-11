import { ChainId, Network } from '@hyperjump-defi/sdk'
import getNetwork from 'utils/getNetwork'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { ethers } from 'ethers'
import { Contract } from 'web3-eth-contract'
import { BIG_TEN, BIG_ZERO } from './bigNumber'
import { getMasterchef20Contract } from './contractHelpers'
import { getWeb3NoAccount } from './web3'

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const isWithdrawInitiator = async (actionInitiatorsContract, withdrawInitiator, account) => {
  return actionInitiatorsContract.methods.withdrawInitiator(withdrawInitiator, account).call()
}

export const setWithdrawInitiator = async (actionInitiatorsContract, withdrawInitiator, account) => {
  const web3 = getWeb3NoAccount()
  const gas = await web3.eth.getGasPrice()
  return actionInitiatorsContract.methods
    .registerWithdrawInitiator(withdrawInitiator, true)
    .send({ from: account, gasPrice: gas })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const getFarm20MigrationPoolInfo = async (pid: number): Promise<BigNumber[]> => {
  const contract = getMasterchef20Contract()
  try {
    const poolInfo: BigNumber[] = contract.methods.poolInfo(pid).call()
    return poolInfo
  } catch (e) {
    return []
  }
}

export const getMasterChef20UserInfos = async (poolLength: number, owner: string): Promise<any> => {
  const contract = getMasterchef20Contract()
  let promises = []
  for (let pid = 0; pid < poolLength; pid++) {
    promises.push(contract.methods.userInfo(pid, owner).call())
  }
  try {
    const poolsInfo = await Promise.all(promises)
    return poolsInfo
  } catch (e) {
    return []
  }
}

export const stake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .deposit(pid, new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousStake = async (sousChefContract, amount, decimals = 18, account) => {
  const web3 = getWeb3NoAccount()
  const gas = await web3.eth.getGasPrice()
  return sousChefContract.methods
    .deposit(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString())
    .send({ from: account, gasPrice: gas })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousStakeBnb = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .deposit()
    .send({
      from: account,
      value: new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString(),
    })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .withdraw(pid, new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousUnstake = async (sousChefContract, amount, decimals = 18, account) => {
  return sousChefContract.methods
    .withdraw(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousEmergencyUnstake = async (sousChefContract, account) => {
  const web3 = getWeb3NoAccount()
  const gas = await web3.eth.getGasPrice()
  return sousChefContract.methods
    .emergencyWithdraw()
    .send({ from: account, gasPrice: gas })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const harvest = async (masterChefContract, pid, account) => {
  return masterChefContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const soushHarvest = async (sousChefContract, account) => {
  const web3 = getWeb3NoAccount()
  const gas = await web3.eth.getGasPrice()
  return sousChefContract.methods
    .deposit('0')
    .send({ from: account, gasPrice: gas })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const soushHarvestBnb = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit()
    .send({ from: account, value: BIG_ZERO })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

// Vaults
export const depositVault = async (
  account: string,
  isMax: boolean,
  amount: string,
  contract: Contract,
): Promise<any> => {
  if (isMax) {
    return contract.methods.depositAll().send({ from: account })
  }
  return contract.methods.deposit(new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL)).send({ from: account })
}

export const withdrawVault = async (
  account: string,
  isMax: boolean,
  amount: BigNumber,
  contract: Contract,
): Promise<any> => {
  if (isMax) {
    return contract.methods.withdrawAll().send({ from: account })
  }
  return contract.methods.withdraw(amount.times(DEFAULT_TOKEN_DECIMAL).integerValue()).send({ from: account })
}

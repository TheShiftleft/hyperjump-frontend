import { ChainId, Network } from '@hyperjump-defi/sdk'
import getNetwork from 'utils/getNetwork'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { ethers } from 'ethers'
import { Contract } from 'web3-eth-contract'
import { BIG_TEN, BIG_ZERO } from './bigNumber'

const { config } = getNetwork()

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

/* const stakingMethod: Record<Network, string> = {
  [Network.BSC]: 'deposit',
  [Network.BSC_TESTNET]: 'depost',
  [Network.FANTOM]: 'deposit',
} */

export const stake = async (masterChefContract, pid, amount, account) => {
  if (pid === 0) {
    return masterChefContract.methods
      .deposit(0, new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString())
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  return masterChefContract.methods
    .deposit(pid, new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousStake = async (sousChefContract, amount, decimals = 18, account) => {
  return sousChefContract.methods
    .deposit(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString())
    .send({ from: account })
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

const leaveStakingMethod: Record<Network, string> = {
  [Network.BSC]: 'leaveMechs',
  [Network.BSC_TESTNET]: 'leaveStaking',
  [Network.FANTOM]: 'leaveMechs',
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  /*  if (pid === 0) {
    return masterChefContract.methods
      .withdraw('0', new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString())
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  } */
  return masterChefContract.methods
    .withdraw(pid, new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousUnstake = async (sousChefContract, amount, decimals, account) => {
  return sousChefContract.methods
    .withdraw(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousEmergencyUnstake = async (sousChefContract, account) => {
  return sousChefContract.methods
    .emergencyWithdraw()
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const harvest = async (masterChefContract, pid, account) => {
  if (pid === 0) {
    return masterChefContract.methods
      .withdraw('0', '0')
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  return masterChefContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const soushHarvest = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit('0')
    .send({ from: account })
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

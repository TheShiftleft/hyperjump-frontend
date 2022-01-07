import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import web3NoAccount from 'utils/web3'

// Addresses
import {
  getAddress,
  getMasterChefAddress,
  getGovTokenAddress,
  getFarmingTokenAddress,
  getMulticallAddress,
  getLotteryAddress,
  getRewardMigratorAddress,
  getMechMigratorAddress,
  getOldFarmingTokenAddress,
  getXJumpAddress,
  getMechAddress,
  getClaimLpRewardsMigratorAddress,
  getSynapseBridgeAddress,
} from 'utils/addressHelpers'

// ABI
import bep20Abi from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import {SYNAPSE_BRIDGE_ABI} from 'config/abi/synapseBridge'
import { DEFAULT_GAS_PRICE } from 'config'
import {
  getFarmingTokenABI,
  getGovTokenABI,
  getMasterChefABI,
  getMulticallABI,
  getPoolABI,
  getVaultABI,
  getLotteryABI,
  getRewardMigratorABI,
  getClaimLpRewardsMigratorABI,
  getMechMigratorABI,
  getXJumpABI,
  getMechABI,
} from 'config/abi'
import { Pool } from 'state/types'
import getNetwork from './getNetwork'

export const getAllowance = async (contract: Contract, owner: string, spender: string): Promise<string> => {
  try {
    const allowance: string = await contract.methods.allowance(owner, spender).call()
    return allowance
  } catch (e) {
    return '0'
  }
}

export const getClaim = async (owner: string): Promise<string> => {
  const contract = getClaimLpRewardsMigratorContract()
  try {
    const claim: string = await contract.methods.canClaim().call({ from: owner })
    return claim
  } catch (e) {
    return 'false'
  }
}

export const getDefaultGasPrice = () => {
  const { config } = getNetwork()
  return DEFAULT_GAS_PRICE[config.network]
}

const getContract = (abi: any, address: string, web3?: Web3, account?: string) => {
  const _web3 = web3 ?? web3NoAccount

  return new _web3.eth.Contract(abi as unknown as AbiItem, address) // , {
}

export const getXJumpContract = (web3?: Web3) => {
  return getContract(getXJumpABI(), getXJumpAddress(), web3)
}

export const getMigratorContract = (web3?: Web3) => {
  return getContract(getRewardMigratorABI(), getRewardMigratorAddress(), web3)
}

export const getClaimLpRewardsMigratorContract = (web3?: Web3) => {
  return getContract(getClaimLpRewardsMigratorABI(), getClaimLpRewardsMigratorAddress(), web3)
}

export const getMechMigratorContract = (web3?: Web3) => {
  return getContract(getMechMigratorABI(), getMechMigratorAddress(), web3)
}

export const getBep20Contract = (address: string, web3?: Web3) => {
  return getContract(bep20Abi, address, web3)
}
export const getErc721Contract = (address: string, web3?: Web3) => {
  return getContract(erc721Abi, address, web3)
}
export const getLpContract = (address: string, web3?: Web3) => {
  return getContract(lpTokenAbi, address, web3)
}
export const getPoolContract = (pool: Pool, web3?: Web3) => {
  return getContract(getPoolABI(), getAddress(pool.contractAddress), web3)
}
export const getFarmingTokenContract = (web3?: Web3) => {
  return getContract(getFarmingTokenABI(), getFarmingTokenAddress(), web3)
}
export const getOldFarmingTokenContract = (web3?: Web3) => {
  return getContract(getFarmingTokenABI(), getOldFarmingTokenAddress(), web3)
}
export const getMechContract = (web3?: Web3) => {
  return getContract(getMechABI(), getMechAddress(), web3)
}
export const getMasterchefContract = (web3?: Web3) => {
  return getContract(getMasterChefABI(), getMasterChefAddress(), web3)
}
export const getGovTokenContract = (web3?: Web3) => {
  return getContract(getGovTokenABI(), getGovTokenAddress(), web3)
}
export const getVaultContract = (address: string, web3?: Web3) => {
  return getContract(getVaultABI(), address, web3)
}
export const getMulticallContract = (web3?: Web3) => {
  return getContract(getMulticallABI(), getMulticallAddress(), web3)
}
export const getLotteryContract = (web3?: Web3) => {
  return getContract(getLotteryABI(), getLotteryAddress(), web3)
}

export const getSynapseBridgeContract = (web3?: Web3) => {
  return getContract(SYNAPSE_BRIDGE_ABI.abi, getSynapseBridgeAddress(), web3)
}

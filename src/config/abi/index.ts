import { ChainId } from '@hyperjump-defi/sdk'
import getNetwork from 'utils/getNetwork'
import masterChefABI from './masterchef.json'
import masterChef20ABI from './masterchefv2.json'
import bscMulticallABI from './bsc-multicall.json'
import ftmMulticallABI from './ftm-multicall.json'
import bscPoolABI from './bsc-pool.json'
import ftmPoolABI from './ftm-pool.json'
import alloyABI from './alloy.json'
import xjumpABI from './xjump.json'
import jumpABI from './jump.json'
import oriABI from './ori.json'
import hyprABI from './hypr.json'
import auroraABI from './aurora.json'
import thugSwapRouterABI from './IThugswapRouter02.json'
import hyperSwapRouterABI from './IHyperswapRouter02.json'
import wethABI from './weth.json'
import wftmABI from './wftm.json'
import bscVaultABI from './bsc-vault.json'
import ftmVaultABI from './ftm-vault.json'
import bscLotteryABI from './bsc-lottery.json'
import rewardMigratorABI from './RewardMigrator.json'
import mechABI from './mechs.json'
import mechMigratorABI from './mechMigrator.json'
import claimLpRewardMigratorABI from './claimLpRewards.json'
import zapABI from './zap.json'
import actionInitiatorsABI from './actionInitiators.json'

const multicallABIs = {
  [ChainId.BSC_MAINNET]: bscMulticallABI,
  [ChainId.BSC_TESTNET]: bscMulticallABI,
  [ChainId.FTM_MAINNET]: ftmMulticallABI,
}

const poolABIs = {
  [ChainId.BSC_MAINNET]: bscPoolABI,
  [ChainId.BSC_TESTNET]: bscPoolABI,
  [ChainId.FTM_MAINNET]: ftmPoolABI,
}

const farmTokenABIs = {
  [ChainId.BSC_MAINNET]: jumpABI,
  [ChainId.BSC_TESTNET]: jumpABI,
  [ChainId.FTM_MAINNET]: jumpABI,
}

const govTokenABIs = {
  [ChainId.BSC_MAINNET]: hyprABI,
  [ChainId.BSC_TESTNET]: hyprABI,
  [ChainId.FTM_MAINNET]: auroraABI,
}

const routerABIs = {
  [ChainId.BSC_MAINNET]: thugSwapRouterABI.abi,
  [ChainId.BSC_TESTNET]: thugSwapRouterABI.abi,
  [ChainId.FTM_MAINNET]: hyperSwapRouterABI.abi,
}

const wrappedABIs = {
  [ChainId.BSC_MAINNET]: wethABI,
  [ChainId.BSC_TESTNET]: wethABI,
  [ChainId.FTM_MAINNET]: wftmABI,
}

const vaultABIs = {
  [ChainId.BSC_MAINNET]: bscVaultABI,
  [ChainId.BSC_TESTNET]: bscVaultABI,
  [ChainId.FTM_MAINNET]: ftmVaultABI,
}

const lotteryABIs = {
  [ChainId.BSC_MAINNET]: bscLotteryABI,
  [ChainId.BSC_TESTNET]: bscLotteryABI,
  [ChainId.FTM_MAINNET]: bscLotteryABI,
}

export const getActionInitiatorsABI = () => {
  return actionInitiatorsABI
}

export const getRewardMigratorABI = () => {
  return rewardMigratorABI
}

export const getClaimLpRewardsMigratorABI = () => {
  return claimLpRewardMigratorABI
}

export const getMechMigratorABI = () => {
  return mechMigratorABI
}

export const getXJumpABI = () => {
  return xjumpABI
}

export const getMasterChefABI = () => {
  return masterChefABI
}

export const getMasterChef20ABI = () => {
  return masterChef20ABI
}


export const getMulticallABI = () => {
  const { chainId } = getNetwork()
  return multicallABIs[chainId]
}

export const getPoolABI = () => {
  const { chainId } = getNetwork()
  return poolABIs[chainId]
}

export const getFarmingTokenABI = () => {
  const { chainId } = getNetwork()
  return farmTokenABIs[chainId]
}

export const getGovTokenABI = () => {
  const { chainId } = getNetwork()
  return govTokenABIs[chainId]
}

export const getMechABI = () => {
  const { chainId } = getNetwork()
  return mechABI
}

export const getRouterABI = () => {
  const { chainId } = getNetwork()
  return routerABIs[chainId]
}

export const getWrappedABI = () => {
  const { chainId } = getNetwork()
  return wrappedABIs[chainId]
}

export const getVaultABI = () => {
  const { chainId } = getNetwork()
  return vaultABIs[chainId]
}

export const getLotteryABI = () => {
  const { chainId } = getNetwork()
  return lotteryABIs[chainId]
}

export const getZapABI = () => {
  return zapABI
}

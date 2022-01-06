import { ChainId, Network } from '@hyperjump-defi/sdk'
import addresses from 'config/constants/contracts'
import tokens from 'config/constants/tokens'
import { Address } from 'config/constants/types'
import getNetwork from './getNetwork'

export const getLotteryAddress = () => {
  const { config } = getNetwork()
  return getAddress(addresses.lottery)
}

export const getAddress = (address: Address): string => {
  const { chainId } = getNetwork()
  return address[chainId] ? address[chainId] : address[ChainId.BSC_MAINNET]
}

export const getAddressMulti = (address: Address, chainId: number): string => {
  return address[chainId] ? address[chainId] : address[ChainId.BSC_MAINNET]
}

export const getRewardMigratorAddress = () => {
  return getAddress(addresses.migrator)
}

export const getMechMigratorAddress = () => {
  return getAddress(addresses.mechmigrator)
}

export const getClaimLpRewardsMigratorAddress = () => {
  return getAddress(addresses.hyperJumpClaimLpRewards)
}

export const getMechAddress = () => {
  return getAddress(tokens.mech.address)
}
export const getFarmingTokenAddress = () => {
  const { config } = getNetwork()
  return getAddress(config.farmingToken.address)
}
export const getOldFarmingTokenAddress = () => {
  const { chainId } = getNetwork()
  const tokenAddress = chainId === 56 ? tokens.alloy.address : tokens.ori.address
  return getAddress(tokenAddress)
}
export const getMasterChefAddress = () => {
  return getAddress(addresses.masterChef)
}

export const getXJumpAddress = () => {
  return getAddress(addresses.xjump)
}
export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall)
}
export const getWrappedNetworkTokenAddress = () => {
  const { config } = getNetwork()
  return getAddress(config.wrappedNetworkToken.address)
}

export const getGovTokenAddress = () => {
  const { config } = getNetwork()
  return getAddress(config.govToken.address)
}

export const getSynapseBridgeAddress = () => {
  return getAddress(addresses.synapse)
}

export const getMainDistributorAddress = (chainId: number) => {
  return getAddressMulti(addresses.hyperJumpMainDistributor, chainId)
}

export const getBridgeDistributorAddress = (chainId: number) => {
  return getAddressMulti(addresses.hyperJumpBridgeDistributor, chainId)
}

export const getJumpAddress = (chainId: number) => {
  return getAddressMulti(addresses.jump, chainId)
}

const routerAddresses: Record<Network, string> = {
  [Network.BSC]: '0x3bc677674df90A9e5D741f28f6CA303357D0E4Ec',
  [Network.BSC_TESTNET]: '0x3bc677674df90A9e5D741f28f6CA303357D0E4Ec',
  [Network.FANTOM]: '0x53c153a0df7E050BbEFbb70eE9632061f12795fB',
}

export const getRouterAddress = () => {
  const { config } = getNetwork()
  return routerAddresses[config.network]
}

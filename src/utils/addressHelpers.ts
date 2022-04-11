import { ChainId, Network } from '@hyperjump-defi/sdk'
import addresses from 'config/constants/contracts'
import zapTokens from 'config/constants/zapTokens'
import warpTokens from 'config/constants/warpTokens'
import tokens from 'config/constants/tokens'
import { Address } from 'config/constants/types'
import getNetwork from './getNetwork'


export const getAddress = (address: Address): string => {
  const { chainId } = getNetwork()
  return address[chainId] ? address[chainId] : address[ChainId.BSC_MAINNET]
}

export const getActionInitiatorsAddress = () => {
  return getAddress(addresses.actionInitiators)
}

export const getLotteryAddress = () => {
  return getAddress(addresses.lottery)
}

export const getZapTokens = () => {
  const zap = Object.keys(zapTokens).map((key, index) => {
    return getAddress(zapTokens[key].address)
  })
  return zap
}

export const getWarpTokens = () => {
  const warp = Object.keys(warpTokens).map((key, index) => {
    return getAddress(warpTokens[key])
  })
  return warp
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
export const getMasterChef20Address = () => {
  return getAddress(addresses.masterChef20)
}
export const getXJumpAddress = () => {
  return getAddress(addresses.xjump)
}
export const getXJumpAddress20 = () => {
  return getAddress(addresses.xjump20)
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

export const getL2BridgeZapAddress = () => {
  return getAddress(addresses.l2BridgeZap)
}

export const getBroomAddress = () => {
  return getAddress(addresses.broom)
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

export const getZapAddress = () => {
  const { config } = getNetwork()
  return getAddress(addresses.zap)
}

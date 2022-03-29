import BigNumber from 'bignumber.js'
import { Network } from '@hyperjump-defi/sdk'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import { Pool } from 'state/types'
import getNetwork from 'utils/getNetwork'
import { getFarmingTokenABI, getPoolABI } from 'config/abi'

const limitMethods: Record<Network, any> = {
  [Network.BSC]: {
    start: 'startBlock',
    end: 'bonusEndBlock',
  },
  [Network.BSC_TESTNET]: {
    start: 'startBlock',
    end: 'bonusEndBlock',
  },
  [Network.FANTOM]: {
    start: 'startTime',
    end: 'bonusEndTime',
  },
}

export const fetchPoolsBlockLimits = async (pools: Pool[]) => {
  const { config } = getNetwork()
  const poolsWithEnd = pools.filter((p) => p.sousId !== 0)
  const callsStartBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: limitMethods[config.network].start,
    }
  })
  const callsEndBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: limitMethods[config.network].end,
    }
  })

  try {
    const [starts, ends] = await Promise.all([
      multicall(getPoolABI(), callsStartBlock),
      multicall(getPoolABI(), callsEndBlock),
    ])
    return poolsWithEnd.map((cakePoolConfig, index) => {
      const startBlock = starts[index]
      const endBlock = ends[index]
      return {
        sousId: cakePoolConfig.sousId,
        startBlock: new BigNumber(startBlock).toJSON(),
        endBlock: new BigNumber(endBlock).toJSON(),
      }
    })
  } catch (e) {
    return []
  }
}

export const fetchPoolsTotalStaking = async (pools: Pool[]) => {
  const poolCalls = pools.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.stakingToken.address),
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  try {
    const totalStaked = await multicall(getFarmingTokenABI(), poolCalls)

    return pools.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(totalStaked[index]).toJSON(),
    }))
  } catch (e) {
    return []
  }
}

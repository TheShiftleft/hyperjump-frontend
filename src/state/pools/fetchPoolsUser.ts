import { Network } from '@hyperjump-defi/sdk'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import { getPoolABI } from 'config/abi'
import { Pool } from 'state/types'
import { getMasterchefContract } from 'utils/contractHelpers'
import getNetwork from 'utils/getNetwork'

const rewardMethods: Record<Network, string> = {
  [Network.BSC]: 'pendingReward',
  [Network.BSC_TESTNET]: 'pendingReward',
  [Network.FANTOM]: 'pendingReward',
}

export const fetchPoolsAllowance = async (account: string, pools: Pool[]) => {
  const calls = pools.map((p) => ({
    address: getAddress(p.stakingToken.address),
    name: 'allowance',
    params: [account, getAddress(p.contractAddress)],
  }))

  try {
    const allowances = await multicall(erc20ABI, calls)
    return pools.reduce(
      (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(allowances[index]).toJSON() }),
      {},
    )
  } catch (e) {
    console.error(e)
    return []
  }
}

export const fetchUserBalances = async (account: string, pools: Pool[]) => {
  const calls = pools.map((p) => ({
    address: getAddress(p.stakingToken.address),
    name: 'balanceOf',
    params: [account],
  }))
  try {
    const tokenBalancesRaw = await multicall(erc20ABI, calls)

    const tokenBalances = pools.reduce(
      (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(tokenBalancesRaw[index]).toJSON() }),
      {},
    )

    return tokenBalances
  } catch (e) {
    console.error(e)
    return {}
  }
}

export const fetchUserStakeBalances = async (account: string, pools: Pool[]) => {
  const nonMasterPools = pools.filter((p) => p.sousId !== 0)
  const masterChefContract = getMasterchefContract()
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'userInfo',
    params: [account],
  }))
  try {
    const [userInfo, masterPoolAmount] = await Promise.all([
      multicall(getPoolABI(), calls),
      masterChefContract.methods.userInfo('0', account).call(),
    ])
    const stakedBalances = nonMasterPools.reduce(
      (acc, pool, index) => ({
        ...acc,
        [pool.sousId]: new BigNumber(userInfo[index].amount._hex).toJSON(),
      }),
      {},
    )

    return { ...stakedBalances, 0: new BigNumber(masterPoolAmount).toJSON() }
  } catch (e) {
    console.error(e)
    return {}
  }
}

export const fetchUserPendingRewards = async (account: string, pools: Pool[]) => {
  const { config } = getNetwork()
  const masterChefContract = getMasterchefContract()
  const nonMasterPools = pools.filter((p) => p.sousId !== 0)
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'pendingReward',
    params: [account],
  }))
  try {
    const [res, pendingReward] = await Promise.all([
      multicall(getPoolABI(), calls),
      masterChefContract.methods.pendingReward('0', account).call(),
    ])
    const pendingRewards = nonMasterPools.reduce(
      (acc, pool, index) => ({
        ...acc,
        [pool.sousId]: new BigNumber(res[index]).toJSON(),
      }),
      {},
    )

    return { ...pendingRewards, 0: new BigNumber(pendingReward).toJSON() }
  } catch (e) {
    console.error(e)
    return {}
  }
}

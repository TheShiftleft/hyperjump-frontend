/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ChainId, Network } from '@hyperjump-defi/sdk'
import BigNumber from 'bignumber.js'
import poolsConfig from 'config/constants/pools'
import tokens from 'config/constants/tokens'
import { ChainPoolsState, AppThunk, State } from 'state/types'
import { getPoolApr } from 'utils/apr'
import { getBalanceNumber } from 'utils/formatBalance'
import { getAddress } from 'utils/addressHelpers'
import getNetwork from 'utils/getNetwork'
import { fetchPoolsBlockLimits, fetchPoolsTotalStaking } from './fetchPools'
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserStakeBalances,
  fetchUserPendingRewards,
} from './fetchPoolsUser'
import { getTokenPricesFromFarm } from './helpers'

const initialChainPoolState: ChainPoolsState = {
  data: [],
  userDataLoaded: false,
}

const initialState: Record<ChainId, ChainPoolsState> = {
  [ChainId.BSC_MAINNET]: { ...initialChainPoolState, data: poolsConfig[Network.BSC] },
  [ChainId.BSC_TESTNET]: { ...initialChainPoolState, data: poolsConfig[Network.BSC_TESTNET] },
  [ChainId.FTM_MAINNET]: { ...initialChainPoolState, data: poolsConfig[Network.FANTOM] },
  [ChainId.FTM_TESTNET]: { ...initialChainPoolState, data: poolsConfig[Network.FANTOM] },
}

// Thunks

interface IFetchPoolsPublicDataResponse {
  chainId: ChainId
  liveData: any[]
}

export const fetchPoolsPublicDataAsync = createAsyncThunk<IFetchPoolsPublicDataResponse, number, { state: State }>(
  'pools/fetchPoolsPublicDataAsync',
  async (currentBlock, { getState }) => {
    const { config } = getNetwork()
    const { chainId } = getState().application
    const { farmingToken } = config
    const pools = getState().pools[chainId].data
    const [blockLimits, totalStakings] = await Promise.all([
      fetchPoolsBlockLimits(pools),
      fetchPoolsTotalStaking(pools),
    ])

    const prices = getTokenPricesFromFarm(getState().farms[chainId].data)

    const liveData = pools.map((pool) => {
      const blockLimit = blockLimits.find((entry) => entry.sousId === pool.sousId)
      const totalStaking = totalStakings.find((entry) => entry.sousId === pool.sousId)
      const isPoolEndBlockExceeded = currentBlock > 0 && blockLimit ? currentBlock > Number(blockLimit.endBlock) : false
      const isPoolFinished = pool.isFinished || isPoolEndBlockExceeded

      let stakingTokenPrice = 0
      if (pool.stakingToken.symbol === tokens.jump.symbol) {
        const stakingTokenAddress = farmingToken.address ? getAddress(farmingToken.address).toLowerCase() : null
        stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0
      } else {
        const stakingTokenAddress = pool.stakingToken.address
          ? getAddress(pool.stakingToken.address).toLowerCase()
          : null
        stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0
      }

      let earningTokenPrice = 0
      const earningTokenAddress = pool.earningToken.address ? getAddress(pool.earningToken.address).toLowerCase() : null
      earningTokenPrice = earningTokenAddress ? prices[earningTokenAddress] : 0

      const apr = !isPoolFinished
        ? getPoolApr(
            stakingTokenPrice,
            earningTokenPrice,
            getBalanceNumber(new BigNumber(totalStaking.totalStaked), pool.stakingToken.decimals),
            parseFloat(pool.tokenPerBlock),
          )
        : 0

      return {
        ...blockLimit,
        ...totalStaking,
        stakingTokenPrice,
        earningTokenPrice,
        apr,
        isFinished: isPoolFinished,
      }
    })

    return { chainId, liveData }
  },
)

interface IPoolsUserDataAsyncResponse {
  chainId: ChainId
  userData: any[] // TODO add type
}

export const fetchPoolsUserDataAsync = createAsyncThunk<IPoolsUserDataAsyncResponse, string, { state: State }>(
  'pools/fetchPoolsUserDataAsync',
  async (account, { getState }) => {
    const { chainId } = getState().application
    const pools = getState().pools[chainId].data
    const [allowances, stakingTokenBalances, stakedBalances, pendingRewards] = await Promise.all([
      fetchPoolsAllowance(account, pools),
      fetchUserBalances(account, pools),
      fetchUserStakeBalances(account, pools),
      fetchUserPendingRewards(account, pools),
    ])

    const userData = pools.map((pool) => ({
      sousId: pool.sousId,
      allowance: allowances[pool.sousId],
      stakingTokenBalance: stakingTokenBalances[pool.sousId],
      stakedBalance: stakedBalances[pool.sousId],
      pendingReward: pendingRewards[pool.sousId],
    }))

    return { chainId, userData }
  },
)

export const updateUserAllowance =
  (sousId: number, account: string): AppThunk =>
  async (dispatch, getState) => {
    const { chainId } = getNetwork()
    const pools = getState().pools[chainId].data
    const allowances = await fetchPoolsAllowance(account, pools)
    dispatch(updatePoolsUserData({ sousId, field: 'allowance', value: allowances[sousId] }))
  }

export const updateUserBalance =
  (sousId: number, account: string): AppThunk =>
  async (dispatch, getState) => {
    const { chainId } = getNetwork()
    const pools = getState().pools[chainId].data
    const tokenBalances = await fetchUserBalances(account, pools)
    dispatch(updatePoolsUserData({ sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] }))
  }

export const updateUserStakedBalance =
  (sousId: number, account: string): AppThunk =>
  async (dispatch, getState) => {
    const { chainId } = getNetwork()
    const pools = getState().pools[chainId].data
    const stakedBalances = await fetchUserStakeBalances(account, pools)
    dispatch(updatePoolsUserData({ sousId, field: 'stakedBalance', value: stakedBalances[sousId] }))
  }

export const updateUserPendingReward =
  (sousId: number, account: string): AppThunk =>
  async (dispatch, getState) => {
    const { chainId } = getNetwork()
    const pools = getState().pools[chainId].data
    const pendingRewards = await fetchUserPendingRewards(account, pools)
    dispatch(updatePoolsUserData({ sousId, field: 'pendingReward', value: pendingRewards[sousId] }))
  }

export const PoolsSlice = createSlice({
  name: 'Pools',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchPoolsPublicDataAsync.fulfilled, (state, action) => {
      const { chainId, liveData } = action.payload
      state[chainId].data = state[chainId].data.map((pool) => {
        const livePoolData = liveData.find((entry) => entry.sousId === pool.sousId)
        return { ...pool, ...livePoolData }
      })
    })
    builder.addCase(fetchPoolsUserDataAsync.fulfilled, (state, action) => {
      const { chainId, userData } = action.payload
      state[chainId].data = state[chainId].data.map((pool) => {
        const userPoolData = userData.find((entry) => entry.sousId === pool.sousId)
        return { ...pool, userData: userPoolData }
      })
      state[chainId].userDataLoaded = true
    })
  },
  reducers: {
    updatePoolsUserData: (state, action) => {
      const { chainId } = getNetwork() // FIXME hack
      const { field, value, sousId } = action.payload
      const index = state[chainId].data.findIndex((p) => p.sousId === sousId)

      if (index >= 0) {
        state[chainId].data[index] = {
          ...state[chainId].data[index],
          userData: { ...state[chainId].data[index].userData, [field]: value },
        }
      }
    },
  },
})

// Actions
export const { updatePoolsUserData } = PoolsSlice.actions

export default PoolsSlice.reducer

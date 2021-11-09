/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import farmsConfig from 'config/constants/farms'
import { ChainId, Network } from '@hyperjump-defi/sdk'
import priceHelperLpsConfig from 'config/constants/priceHelperLps'
import getNetwork from 'utils/getNetwork'
import fetchFarms from './fetchFarms'
import fetchFarmsPrices from './fetchFarmsPrices'
import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
} from './fetchFarmUser'
import { ChainFarmsState, Farm, State } from '../types'

const initChainFarms = (network: Network) => {
  return farmsConfig[network].map((farm) => ({
    ...farm,
    userData: {
      allowance: '0',
      tokenBalance: '0',
      stakedBalance: '0',
      earnings: '0',
    },
  }))
}

const initialChainFarmState: ChainFarmsState = {
  data: [],
  loadArchivedFarmsData: false,
  userDataLoaded: false,
}

const initialState: Record<ChainId, ChainFarmsState> = {
  [ChainId.BSC_MAINNET]: { ...initialChainFarmState, data: initChainFarms(Network.BSC) },
  [ChainId.BSC_TESTNET]: { ...initialChainFarmState, data: initChainFarms(Network.BSC_TESTNET) },
  [ChainId.FTM_MAINNET]: { ...initialChainFarmState, data: initChainFarms(Network.FANTOM) },
  [ChainId.FTM_TESTNET]: { ...initialChainFarmState, data: initChainFarms(Network.FTM_TESTNET) },
}

interface IFarmPublicDataResponse {
  chainId: ChainId
  farms: Farm[]
}

// Async thunks
export const fetchFarmsPublicDataAsync = createAsyncThunk<IFarmPublicDataResponse, number[], { state: State }>(
  'farms/fetchFarmsPublicDataAsync',
  async (pids, { getState }) => {
    const { chainId, config } = getNetwork()
    const farmsToFetch = getState().farms[chainId].data.filter((farmConfig) => pids.includes(farmConfig.pid))
    const farmsWithPriceHelpers = farmsToFetch.concat(priceHelperLpsConfig[config.network])
    const farms = await fetchFarms(farmsWithPriceHelpers)
    const farmsWithPrices = await fetchFarmsPrices(farms)
    const farmsWithoutUserData = farmsWithPrices.map((farm) => {
      const { userData, ...rest } = farm
      return rest
    })

    return { chainId, farms: farmsWithoutUserData }
  },
)

interface FarmUserDataResponseItem {
  pid: number
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
}

interface IFarmUserDataResponse {
  chainId: ChainId
  items: FarmUserDataResponseItem[]
}

export const fetchFarmUserDataAsync = createAsyncThunk<
  IFarmUserDataResponse,
  { account: string; pids: number[] },
  { state: State }
>('farms/fetchFarmUserDataAsync', async ({ account, pids }, { getState }) => {
  const { chainId } = getState().application
  const farmsToFetch = getState()
    .farms[chainId].data.filter((farmConfig) => farmConfig.pid !== null)
    .filter((farmConfig) => pids.includes(farmConfig.pid))
  const [userFarmAllowances, userFarmTokenBalances, userStakedBalances, userFarmEarnings] = await Promise.all([
    fetchFarmUserAllowances(account, farmsToFetch),
    fetchFarmUserTokenBalances(account, farmsToFetch),
    fetchFarmUserStakedBalances(account, farmsToFetch),
    fetchFarmUserEarnings(account, farmsToFetch),
  ])

  return {
    chainId,
    items: userFarmAllowances.map((farmAllowance, index) => {
      return {
        pid: farmsToFetch[index].pid,
        allowance: userFarmAllowances[index],
        tokenBalance: userFarmTokenBalances[index],
        stakedBalance: userStakedBalances[index],
        earnings: userFarmEarnings[index],
      }
    }),
  }
})

export const farmsSlice = createSlice({
  name: 'Farms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Update farms with live data
    builder.addCase(fetchFarmsPublicDataAsync.fulfilled, (state, action) => {
      const { chainId, farms } = action.payload
      const priceHelperFarms = farms.filter((farm) => farm.pid === null)

      state[chainId].data = state[chainId].data.map((farm) => {
        const liveFarmData = farms.find((farmData) => farmData.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
      state[chainId].data = state[chainId].data.concat(priceHelperFarms)
    })

    // Update farms with user data
    builder.addCase(fetchFarmUserDataAsync.fulfilled, (state, action) => {
      const { chainId, items } = action.payload
      items.forEach((userDataEl) => {
        const { pid } = userDataEl
        const index = state[chainId].data.findIndex((farm) => farm.pid === pid)
        state[chainId].data[index] = { ...state[chainId].data[index], userData: userDataEl }
      })
      state[chainId].userDataLoaded = true
    })
  },
})

export default farmsSlice.reducer

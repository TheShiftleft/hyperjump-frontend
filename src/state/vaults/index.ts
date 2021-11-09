/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ChainId, Network } from '@hyperjump-defi/sdk'
import {
  ChainVaultsState,
  State,
  Vault,
  VaultAllowanceData,
  VaultApyData,
  VaultBalanceData,
  VaultPriceData,
  VaultsState,
} from 'state/types'
import vaultsConfig from 'config/constants/vaults'
import getNetwork from 'utils/getNetwork'
import fetchVaultsData from './fetchVaults'
import fetchVaultApysData from './fetchVaultApys'
import fetchVaultPricesData from './fetchVaultPrices'
import fetchVaultBalancesData from './fetchVaultBalances'
import fetchVaultAllowancesData from './fetchVaultAllowances'

const initialiseVaultsForNetwork = (network: Network): ChainVaultsState => {
  const balances = {}
  const vaults = vaultsConfig[network]
  vaults.forEach(({ token, tokenAddress, earnedToken, earnedTokenAddress }) => {
    balances[token] = {
      tokenAddress,
      tokenBalance: 0,
    }
    balances[earnedToken] = {
      tokenAddress: earnedTokenAddress,
      tokenBalance: 0,
    }
  })

  return {
    vaults: vaults.map((v) => ({ ...v, allowance: '0', tvl: '0', pricePerFullShare: '0' })),
    apys: {},
    prices: { lps: {}, tokens: {} },
    balances,
    allowances: [],
  }
}

const initialState: VaultsState = {
  [ChainId.BSC_MAINNET]: initialiseVaultsForNetwork(Network.BSC),
  [ChainId.BSC_TESTNET]: initialiseVaultsForNetwork(Network.BSC),
  [ChainId.FTM_MAINNET]: initialiseVaultsForNetwork(Network.FANTOM),
  [ChainId.FTM_TESTNET]: initialiseVaultsForNetwork(Network.FTM_TESTNET),
}

export const fetchVaults = createAsyncThunk<Vault[], void, { state: State }>(
  'vaults/fetchVaults',
  async (_, { getState }) => {
    const { chainId } = getNetwork()
    const { vaults } = getState().vaults[chainId]
    const data = await fetchVaultsData(vaults)
    return data
  },
)

export const fetchVaultApys = createAsyncThunk<VaultApyData>('vaults/fetchApys', async () => {
  const data = await fetchVaultApysData()
  return data
})

export const fetchVaultAllowances = createAsyncThunk<VaultAllowanceData, string, { state: State }>(
  'vaults/fetchAllowances',
  async (account, { getState }) => {
    const { chainId } = getNetwork()
    const { vaults } = getState().vaults[chainId]
    const data = await fetchVaultAllowancesData(account, vaults)
    return data
  },
)

export const fetchVaultPrices = createAsyncThunk<VaultPriceData>('vaults/fetchVaultLpPrices', async () => {
  const data = await fetchVaultPricesData()
  return data
})

export const fetchVaultBalances = createAsyncThunk<VaultBalanceData, string, { state: State }>(
  'vaults/fetchVaultBalances',
  async (account: string, { getState }) => {
    const { chainId } = getNetwork()
    const state = getState()
    const data = await fetchVaultBalancesData(account, state.vaults[chainId].balances)
    return data
  },
)

export const VaultsSlice = createSlice({
  name: 'Vaults',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchVaultApys.fulfilled, (state, action) => {
      const { chainId } = getNetwork()
      state[chainId].apys = action.payload
    })
    builder.addCase(fetchVaultPrices.fulfilled, (state, action) => {
      const { chainId } = getNetwork()
      state[chainId].prices = action.payload
    })
    builder.addCase(fetchVaultBalances.fulfilled, (state, action) => {
      const { chainId } = getNetwork()
      state[chainId].balances = action.payload
    })
    builder.addCase(fetchVaultAllowances.fulfilled, (state, action) => {
      const { chainId } = getNetwork()
      state[chainId].allowances = action.payload
    })
    builder.addCase(fetchVaults.fulfilled, (state, action) => {
      const { chainId } = getNetwork()
      const liveVaultsData: Vault[] = action.payload
      // maybe unneeded
      state[chainId].vaults = state[chainId].vaults.map((vault) => {
        const liveVaultData = liveVaultsData.find((entry) => entry.id === vault.id)
        return { ...vault, ...liveVaultData }
      })
    })
  },
})

export default VaultsSlice.reducer

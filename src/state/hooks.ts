import { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { getWeb3NoAccount } from 'utils/web3'
import { getBalanceAmount } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import useRefresh from 'hooks/useRefresh'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import getNetwork from 'utils/getNetwork'
import {
  fetchFarmsPublicDataAsync,
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  setBlock,
  fetchVaults,
} from './actions'
import { State, Farm, Pool, ChainFarmsState, ChainVaultsState } from './types'
import { transformPool } from './pools/helpers'
import { fetchFarmUserDataAsync } from './farms'
import { fetchVaultAllowances, fetchVaultApys, fetchVaultBalances, fetchVaultPrices } from './vaults'

export const usePollFarmsData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const web3 = getWeb3NoAccount()
  const { account } = useWeb3React()
  const farmsConfig = useSelector((state: State) => state.farms[state.application.chainId].data)

  useEffect(() => {
    const pids = farmsConfig.filter((farmConfig) => farmConfig.pid !== null).map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchFarmsPublicDataAsync(pids))

    if (account) {
      dispatch(fetchFarmUserDataAsync({ account, pids }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, slowRefresh, web3, account])
}

/**
 * Fetches the "core" farm data used globally
 */
export const usePollCoreFarmData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const web3 = getWeb3NoAccount()
  const { config } = getNetwork()

  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync(config.coreFarms))
  }, [config.coreFarms, dispatch, slowRefresh, web3])
}

export const usePollBlockNumber = () => {
  const dispatch = useAppDispatch()
  const web3 = getWeb3NoAccount()

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const blockNumber = await web3.eth.getBlockNumber()
        dispatch(setBlock(blockNumber))
      } catch (e) {
        console.error(e)
      }
    }, 6000)

    return () => clearInterval(interval)
  }, [dispatch, web3])
}

// Farms

export const useFarms = (): ChainFarmsState => {
  const farms = useSelector((state: State) => state.farms[state.application.chainId])
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms[state.application.chainId].data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromLpSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) =>
    state.farms[state.application.chainId].data.find((f) => f.lpSymbol === lpSymbol),
  )
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  }
}

// Return a farm for a given token symbol. The farm is filtered based on attempting to return a farm with a quote token from an array of preferred quote tokens
export const useFarmFromTokenSymbol = (tokenSymbol: string, preferredQuoteTokens?: string[]): Farm => {
  const farms = useSelector((state: State) =>
    state.farms[state.application.chainId].data.filter((farm) => farm.token.symbol === tokenSymbol),
  )
  const filteredFarm = filterFarmsByQuoteToken(farms, preferredQuoteTokens)
  return filteredFarm
}

// Return the base token price for a farm, from a given pid
export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const farm = useFarmFromPid(pid)
  return farm && new BigNumber(farm.token.busdPrice)
}

export const useBusdPriceFromToken = (tokenSymbol: string): BigNumber => {
  const tokenFarm = useFarmFromTokenSymbol(tokenSymbol)
  const tokenPrice = useBusdPriceFromPid(tokenFarm?.pid)
  return tokenPrice
}

export const useLpTokenPrice = (symbol: string) => {
  let lpTokenPrice = BIG_ZERO
  const farm = useFarmFromLpSymbol(symbol)
  const farmTokenPriceInUsd = useBusdPriceFromPid(farm.pid)

  if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(farm.tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(new BigNumber(farm.lpTotalSupply))
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
  }

  return lpTokenPrice
}

// Pools

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const web3 = getWeb3NoAccount()
  const farmsConfig = useSelector((state: State) => state.farms[state.application.chainId].data)

  useEffect(() => {
    const fetchPoolsPublicData = async () => {
      try {
        const pids = farmsConfig.filter((farmConfig) => farmConfig.pid !== null).map((farmToFetch) => farmToFetch.pid)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, blockNumber] = await Promise.all([
          dispatch(fetchFarmsPublicDataAsync(pids)),
          web3.eth.getBlockNumber(),
        ])
        dispatch(fetchPoolsPublicDataAsync(blockNumber))
      } catch (e) {
        console.error(e)
      }
    }

    fetchPoolsPublicData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, slowRefresh, web3])
}

export const usePools = (account): { pools: Pool[]; userDataLoaded: boolean } => {
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])


  const { pools, userDataLoaded } = useSelector((state: State) => ({
    pools: state.pools[state.application.chainId].data,
    userDataLoaded: state.pools[state.application.chainId].userDataLoaded,
  }))
  return { pools: pools.map(transformPool), userDataLoaded }
}

export const usePoolFromPid = (sousId: number): Pool => {
  const pool = useSelector((state: State) =>
    state.pools[state.application.chainId].data.find((p) => p.sousId === sousId),
  )
  return transformPool(pool)
}

export const usePriceNetworkTokenUsd = (): BigNumber => {
  const { config } = getNetwork()
  const networkTokenUsdFarm = useFarmFromPid(config.networkTokenUsdFarmPid)
  return new BigNumber(networkTokenUsdFarm.quoteToken.busdPrice)
}

export const usePriceFarmingTokenUsd = (): BigNumber => {
  const { config } = getNetwork()
  const farmingTokenNetworkTokenFarm = useFarmFromPid(config.farmingTokenNetworkTokenFarmPid)
  const farmingTokenNetworkTokenUsd = farmingTokenNetworkTokenFarm.token.busdPrice
  return new BigNumber(farmingTokenNetworkTokenUsd)
}

export const usePriceGovTokenUsd = (): BigNumber => {
  const { config } = getNetwork()
  const networkTokenPriceUsd = usePriceNetworkTokenUsd()
  const farm = useFarmFromPid(config.govTokenNetworkTokenFarmPid)
  return farm.tokenPriceVsQuote ? networkTokenPriceUsd.times(farm.tokenPriceVsQuote) : BIG_ZERO
}
// Block
export const useBlock = () => {
  return useSelector((state: State) => state.block)
}

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock)
}

// Vaults
export const useVaults = (account?: string): ChainVaultsState => {
  const { slowRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  const { chainId } = getNetwork()

  useEffect(() => {
    dispatch(fetchVaults())
    dispatch(fetchVaultApys())
    dispatch(fetchVaultPrices())
    if (account) {
      dispatch(fetchVaultAllowances(account))
      dispatch(fetchVaultBalances(account))
    }
  }, [account, dispatch, slowRefresh])

  const { vaults, apys, prices, balances, allowances } = useSelector((state: State) => ({
    vaults: state.vaults[chainId].vaults,
    apys: state.vaults[chainId].apys,
    prices: state.vaults[chainId].prices,
    balances: state.vaults[chainId].balances,
    allowances: state.vaults[chainId].allowances,
  }))

  return { vaults, apys, prices, balances, allowances }
}

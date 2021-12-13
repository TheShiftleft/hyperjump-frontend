import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { FarmConfig } from 'config/constants/types'
import { State } from 'state/types'
import { useSelector } from 'react-redux'
import getNetwork from 'utils/getNetwork'
import { getMasterChefAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'
import { formatNumber, getBalanceNumber } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { usePriceFarmingTokenUsd, useFetchPublicPoolsData, usePools } from 'state/hooks'
import { getMasterChefABI } from 'config/abi'
import useRefresh from './useRefresh'

export interface PoolWithBalance extends FarmConfig {
  balance: BigNumber
}

const usePoolsWithBalance = () => {
  useFetchPublicPoolsData()

  const [poolsWithBalances, setPoolsWithBalances] = useState<PoolWithBalance[]>([])
  const { account } = useWeb3React()
  const { config } = getNetwork()
  const { fastRefresh } = useRefresh()
  const poolsConfig = useSelector((state: State) => state.pools[state.application.chainId].data)
  const poolsToFetch = poolsConfig.filter((poolConfig) => poolConfig.sousId !== null)  
  
  return poolsToFetch
}

export default usePoolsWithBalance

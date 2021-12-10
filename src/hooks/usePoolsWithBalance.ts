import { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { FarmConfig } from 'config/constants/types'
import { State } from 'state/types'
import { useSelector } from 'react-redux'
import getNetwork from 'utils/getNetwork'
import { formatNumber, getBalanceNumber } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { usePriceFarmingTokenUsd, useFetchPublicPoolsData, usePools } from 'state/hooks'
import useRefresh from './useRefresh'

export interface PoolWithBalance extends FarmConfig {
  balance: BigNumber
}

const usePoolsWithBalance = () => {
  useFetchPublicPoolsData()

  const [poolsWithBalances, setPoolsWithBalances] = useState<PoolWithBalance[]>([])
  const { account } = useWeb3React()
  
  const poolsConfig = useSelector((state: State) => state.pools[state.application.chainId].data)
  const poolsToFetch = poolsConfig.filter((poolConfig) => poolConfig.sousId !== null)  

  const earnings  = poolsToFetch[0]?.userData ? new BigNumber(poolsToFetch[0].userData.pendingReward) : BIG_ZERO
  const earningToken = poolsToFetch[0]?.earningToken ? poolsToFetch[0]?.earningToken : BIG_ZERO
  const earningTokenPrice = poolsToFetch[0]?.earningTokenPrice ? poolsToFetch[0]?.earningTokenPrice : BIG_ZERO

  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), 18)
  const earningsDollarValue = new BigNumber(formatNumber(earningTokenDollarBalance)).toNumber()


  return earningsDollarValue
}

export default usePoolsWithBalance

import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Network } from '@hyperjump-defi/sdk'
import { useWeb3React } from '@web3-react/core'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { FarmConfig } from 'config/constants/types'
import { State } from 'state/types'
import { useSelector } from 'react-redux'
import { getMasterChefABI } from 'config/abi'
import getNetwork from 'utils/getNetwork'
import { usePriceFarmingTokenUsd, useFetchPublicPoolsData, usePools } from 'state/hooks'
import useRefresh from './useRefresh'

export interface FarmWithBalance extends FarmConfig {
  balance: BigNumber
}

/* const pendingRewardsMethod: Record<Network, string> = {
  [Network.BSC]: 'pendingReward',
  [Network.BSC_TESTNET]: 'pendingReward',
  [Network.FANTOM]: 'pendingReward',
} */

const useFarmsWithBalance = () => {
  useFetchPublicPoolsData()

  const [farmsWithBalances, setFarmsWithBalances] = useState<FarmWithBalance[]>([])
  const { config } = getNetwork()
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const farmsConfig = useSelector((state: State) => state.farms[state.application.chainId].data)
  const farmsToFetch = farmsConfig.filter((farmConfig) => farmConfig.pid !== null)

  useEffect(() => {
    let isMounted = true
    const fetchBalances = async () => {
      const calls = farmsToFetch.map((farm) => ({
        address: getMasterChefAddress(),
        name: 'pendingReward',
        params: [farm.pid, account],
      }))

      try {
        const rawResults = await multicall(getMasterChefABI(), calls)
        const results = farmsToFetch.map((farm, index) => ({ ...farm, balance: new BigNumber(rawResults[index]) }))

        if (isMounted) {
          setFarmsWithBalances(results)
        }
      } catch (e) {
        console.error(e)
      }
    }

    if (account) {
      fetchBalances()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      isMounted = false
    }
  }, [account, config.network, fastRefresh, farmsToFetch])

  return farmsWithBalances
}

export default useFarmsWithBalance

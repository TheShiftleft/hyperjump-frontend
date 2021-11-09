import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Network } from '@hyperjump-defi/sdk'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { useSelector } from 'react-redux'
import { State } from 'state/types'
import { getMasterChefABI } from 'config/abi'
import getNetwork from 'utils/getNetwork'
import useRefresh from './useRefresh'

const pendingRewardsMethod: Record<Network, string> = {
  [Network.BSC]: 'pendingReward',
  [Network.BSC_TESTNET]: 'pendingReward',
  [Network.FANTOM]: 'pendingReward',
}

const useAllEarnings = () => {
  const [balances, setBalance] = useState([])
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const farmConfig = useSelector((state: State) => state.farms[state.application.chainId].data)
  const farmsToFetch = farmConfig.filter((farm) => farm.pid !== null)
  const { config } = getNetwork()

  useEffect(() => {
    const fetchAllBalances = async () => {
      const calls = farmsToFetch.map((farm) => ({
        address: getMasterChefAddress(),
        name: pendingRewardsMethod[config.network],
        params: [farm.pid, account],
      }))

      try {
        const res = await multicall(getMasterChefABI(), calls)
        setBalance(res)
      } catch (e) {
        console.error(e)
      }
    }

    if (account) {
      fetchAllBalances()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, config.network, fastRefresh])

  return balances
}

export default useAllEarnings

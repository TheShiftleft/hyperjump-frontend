import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useOldFarmingToken } from './useContract'
import { getAllowance } from '../utils/contractHelpers'
import { getRewardMigratorAddress } from '../utils/addressHelpers'

const useMigratorAllowance = () => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const oldFarmingToken = useOldFarmingToken()
  const rewardMigratorAddress = getRewardMigratorAddress()

  const fetchAllowance = useCallback(async () => {
    const allowed = await getAllowance(oldFarmingToken, account, rewardMigratorAddress)
    setAllowance(new BigNumber(allowed))
  }, [account, rewardMigratorAddress, oldFarmingToken])

  useEffect(() => {
    let isMounted = true
    if (isMounted && account && rewardMigratorAddress && oldFarmingToken) {
      fetchAllowance()
    }
    return () => {
      isMounted = false
    }
  }, [account, rewardMigratorAddress, oldFarmingToken, fetchAllowance])

  return allowance
}

export default useMigratorAllowance

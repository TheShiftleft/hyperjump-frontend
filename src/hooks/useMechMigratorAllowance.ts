import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useMechToken, useOldFarmingToken } from './useContract'
import { getAllowance } from '../utils/contractHelpers'
import { getMechMigratorAddress } from '../utils/addressHelpers'

const useMigratorAllowance = () => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const mechToken = useMechToken()
  const mechMigratorAddress = getMechMigratorAddress()

  const fetchAllowance = useCallback(async () => {
    const allowed = await getAllowance(mechToken, account, mechMigratorAddress)
    setAllowance(new BigNumber(allowed))
  }, [account, mechMigratorAddress, mechToken])

  useEffect(() => {
    if (account && mechMigratorAddress && mechToken) {
      fetchAllowance()
    }
    let refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, mechMigratorAddress, mechToken, fetchAllowance])

  return allowance
}

export default useMigratorAllowance

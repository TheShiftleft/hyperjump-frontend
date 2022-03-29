import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getAllowance } from '../utils/contractHelpers'

const useGeneralMigratorAllowance = (lpTokenContract, migratorAddress) => {
  const { account } = useWeb3React()
  const [allowance, setAllowance] = useState<BigNumber>()

  useEffect(() => {
    let isMounted = true

    if (account) {
      const fetchAllowance = async () => {
        const allowed = await getAllowance(lpTokenContract, account, migratorAddress) // contract, owner, spender
        if (isMounted) {
          setAllowance(new BigNumber(allowed))
        }
      }
      fetchAllowance()
    }

    return () => {
      isMounted = false
    }
  }, [account, migratorAddress, lpTokenContract])

  return allowance
}

export default useGeneralMigratorAllowance

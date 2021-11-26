import { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getClaim } from '../utils/contractHelpers'

const useClaimLpRewardsCanClaim = () => {
  const [canClaim, setCanClaim] = useState('')
  const { account } = useWeb3React()

  const fetchClaim = useCallback(async () => {
    const claim = await getClaim(account)
    setCanClaim(claim)
  }, [account])

  useEffect(() => {
    if (account) {
      fetchClaim()
    }
  }, [account, fetchClaim])

  return canClaim
}

export default useClaimLpRewardsCanClaim

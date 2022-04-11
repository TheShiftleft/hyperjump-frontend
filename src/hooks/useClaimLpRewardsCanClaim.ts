import { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getClaim } from '../utils/contractHelpers'

const useClaimLpRewardsCanClaim = () => {
  const [canClaim, setCanClaim] = useState('')
  const { account } = useWeb3React()

  const fetchClaim = useCallback(async () => {
    let isMounted = true
    const claim = await getClaim(account)
    if (isMounted) {
      setCanClaim(claim)
    }
    return () => {
      isMounted = false
    }
  }, [account])

  useEffect(() => {
    let isMounted = true
    if (account && isMounted) {
      fetchClaim()
    }
    return () => {
      isMounted = false
    }
  }, [account, fetchClaim])

  return canClaim
}

export default useClaimLpRewardsCanClaim

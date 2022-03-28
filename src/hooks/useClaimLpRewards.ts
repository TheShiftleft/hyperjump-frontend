import { useCallback } from 'react'
import { claimLpRewards } from 'utils/claimLpRewards'
import { useClaimLpRewardsMigrator } from './useContract'

export const useClaimLpRewards = (account) => {
  const claimLpRewardsMigratorContract = useClaimLpRewardsMigrator()

  const handleClaim = useCallback(async () => {
    await claimLpRewards(claimLpRewardsMigratorContract, account)
  }, [account, claimLpRewardsMigratorContract])

  return { onClaim: handleClaim }
}

export default useClaimLpRewards

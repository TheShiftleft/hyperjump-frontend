import { useCallback } from 'react'
import { claimLpRewards } from 'utils/claimLpRewards'
import { useClaimLpRewardsMigrator } from './useContract'

export const useClaimLpRewards = (account) => {
  const claimLpRewardsMigratorContract = useClaimLpRewardsMigrator()

  const handleClaim = useCallback(async () => {
    const txHash = await claimLpRewards(claimLpRewardsMigratorContract, account)
    return txHash
  }, [account, claimLpRewardsMigratorContract])

  return { onClaim: handleClaim }
}

export default useClaimLpRewards

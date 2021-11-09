import { useCallback } from 'react'
import { migrate } from 'utils/migrate'
import { useRewardMigrator } from './useContract'

export const useMigrate = (account) => {
  const rewardMigratorContract = useRewardMigrator()

  const handleMigrate = useCallback(async () => {
    const txHash = await migrate(rewardMigratorContract, account)
    return txHash
  }, [account, rewardMigratorContract])

  return { onMigrate: handleMigrate }
}

export default useMigrate

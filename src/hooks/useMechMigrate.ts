import { useCallback } from 'react'
import { mechMigrate } from 'utils/mechMigrate'
import { useMechMigrator } from './useContract'

export const useMechMigrate = (account) => {
  const mechMigratorContract = useMechMigrator()

  const handleMigrate = useCallback(async () => {
    const txHash = await mechMigrate(mechMigratorContract, account)
    return txHash
  }, [account, mechMigratorContract])

  return { onMigrate: handleMigrate }
}

export default useMechMigrate

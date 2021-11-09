import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { depositVault } from 'utils/callHelpers'
import { useStarVaultContract } from './useContract'

const useVaultDeposit = (vaultAddress: string) => {
  const { account } = useWeb3React()
  const vaultContract = useStarVaultContract(vaultAddress)

  const handleVaultDeposit = useCallback(
    async (amount: string, isMax: boolean) => {
      try {
        const tx = await depositVault(account, isMax, amount, vaultContract)
        console.info(tx)
      } catch (e) {
        console.error(e)
      }
    },
    [account, vaultContract],
  )

  return { onVaultDeposit: handleVaultDeposit }
}

export default useVaultDeposit

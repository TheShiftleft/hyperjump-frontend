import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { withdrawVault } from 'utils/callHelpers'
import BigNumber from 'bignumber.js'
import { useStarVaultContract } from './useContract'

const useVaultWithdraw = (vaultAddress: string) => {
  const { account } = useWeb3React()
  const vaultContract = useStarVaultContract(vaultAddress)

  const handleVaultWithdraw = useCallback(
    async (amount: BigNumber, isMax: boolean) => {
      try {
        const tx = await withdrawVault(account, isMax, amount, vaultContract)
        console.info(tx)
      } catch (e) {
        console.error(e)
      }
    },
    [account, vaultContract],
  )

  return { onVaultWithdraw: handleVaultWithdraw }
}

export default useVaultWithdraw

import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { ethers } from 'ethers'
import { useAppDispatch } from 'state'
import { updateUserAllowance } from 'state/actions'
import { approve } from 'utils/callHelpers'
import { useTranslation } from 'contexts/Localization'
import { useMasterchef, usePoolContract, useERC20, useRewardMigrator, useMechMigrator } from './useContract'
import useToast from './useToast'

// Approve migrator
export const useRewardMigratorApprove = (rewardTokencontract: Contract) => {
  const { account } = useWeb3React()
  const rewardMigratorContract = useRewardMigrator()

  const handleApprove = useCallback(async () => {
    const tx = await approve(rewardTokencontract, rewardMigratorContract, account)
    return tx
  }, [account, rewardTokencontract, rewardMigratorContract])

  return { onApprove: handleApprove }
}

// Approve  mech migrator
export const useMechMigratorApprove = (mechTokencontract: Contract) => {
  const { account } = useWeb3React()
  const mechMigratorContract = useMechMigrator()

  const handleApprove = useCallback(async () => {
    const tx = await approve(mechTokencontract, mechMigratorContract, account)
    return tx
  }, [account, mechTokencontract, mechMigratorContract])

  return { onApprove: handleApprove }
}
// Approve a Farm
export const useApprove = (lpContract: Contract) => {
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterChefContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, lpContract, masterChefContract])

  return { onApprove: handleApprove }
}

// Approve a Pool
export const useSousApprove = (lpContract: Contract, sousId, earningTokenSymbol) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const sousChefContract = usePoolContract(sousId)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const tx = await approve(lpContract, sousChefContract, account)
      dispatch(updateUserAllowance(sousId, account))
      if (tx) {
        toastSuccess(
          t('Contract Enabled'),
          t('You can now stake in the %symbol% pool!', { symbol: earningTokenSymbol }),
        )
        setRequestedApproval(false)
      } else {
        // user rejected tx or didn't go thru
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
      toastError(t('Error'), e?.message)
    }
  }, [account, dispatch, lpContract, sousChefContract, sousId, earningTokenSymbol, t, toastError, toastSuccess])

  return { handleApprove, requestedApproval }
}

// Approve a Vault
export const useStarVaultApprove = (vaultAddress: string, tokenAddress: string) => {
  const { account } = useWeb3React()
  const contract = useERC20(vaultAddress)
  const onApprove = useCallback(async () => {
    const tx = await contract.methods.approve(tokenAddress, ethers.constants.MaxUint256).send({ from: account })
    return tx
  }, [account, contract.methods, tokenAddress])

  return onApprove
}

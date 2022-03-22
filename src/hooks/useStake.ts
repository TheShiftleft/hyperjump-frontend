import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import getNetwork from 'utils/getNetwork'
import { useAppDispatch } from 'state'
import { updateUserStakedBalance, updateUserBalance } from 'state/actions'
import { stake, sousStake, sousStakeBnb } from 'utils/callHelpers'
import { useMasterchef, usePoolContract } from './useContract'

const useStake = (pid: number) => {
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const handleStake = useCallback(
    async (amount: string) => {
      await stake(masterChefContract, pid, amount, account)
    },
    [account, masterChefContract, pid],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId: number, isUsingBnb = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { config } = getNetwork()
  const masterChefContract = useMasterchef()
  const sousChefContract = usePoolContract(sousId)

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account)
      } else {
        await sousStake(sousChefContract, amount, decimals, account)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, isUsingBnb, sousChefContract, sousId],
  )

  return { onStake: handleStake }
}

export default useStake

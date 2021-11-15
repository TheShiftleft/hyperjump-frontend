import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { updateUserStakedBalance, updateUserBalance, updateUserPendingReward } from 'state/actions'
import { unstake, sousUnstake, sousEmergencyUnstake } from 'utils/callHelpers'
import getNetwork from 'utils/getNetwork'
import { useMasterchef, usePoolContract, useXJump } from './useContract'

const useUnstake = (pid: number) => {
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleUnstake = useCallback(
    async (amount: string) => {
      await unstake(masterChefContract, pid, amount, account)
    },
    [account, masterChefContract, pid],
  )

  return { onUnstake: handleUnstake }
}

export const useSousUnstake = (sousId, enableEmergencyWithdraw = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { chainId, config } = getNetwork()
  const sousChefContract = usePoolContract(sousId)
  const xjumpContract = useXJump()
  const masterChefContract = useMasterchef()
  // xjump needs withdraw from xjump conttract
  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === config.wrappedFarmingTokenPid) {
        // check if withdraw initiator is set
        const initiatorIsSet = await masterChefContract.methods
          .withdrawInitiator(config.wrappedFarmingToken.address[chainId], account)
          .call()
        // if not set
        if (!initiatorIsSet) {
          await masterChefContract.methods
            .registerWithdrawInitiator(config.wrappedFarmingToken.address[chainId], true)
            .send({ from: account })
            .on('transactionHash', (tx) => {
              return tx.transactionHash
            })
        }
        //   await farm.registerWithdrawInitiator(xjumpToken.address, true);
        // if yes continue
        await sousUnstake(xjumpContract, amount, '18', account)
      } else if (enableEmergencyWithdraw) {
        await sousEmergencyUnstake(sousChefContract, account)
      } else {
        await sousUnstake(sousChefContract, amount, decimals, account)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
    },
    [
      account,
      dispatch,
      enableEmergencyWithdraw,
      masterChefContract,
      xjumpContract,
      sousChefContract,
      sousId,
      config.wrappedFarmingTokenPid,
      config.wrappedFarmingToken,
      chainId,
    ],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake

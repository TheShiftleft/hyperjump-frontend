import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { updateUserStakedBalance, updateUserBalance, updateUserPendingReward } from 'state/actions'
import {
  unstake,
  sousUnstake,
  sousEmergencyUnstake,
  isWithdrawInitiator,
  setWithdrawInitiator,
} from 'utils/callHelpers'
import getNetwork from 'utils/getNetwork'
import {
  useMasterchef,
  useMasterchef20,
  usePoolContract,
  useXJump,
  useXJump20,
  useActionInitiators,
} from './useContract'

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

export const useUnstake20 = (pid: number) => {
  const { account } = useWeb3React()
  const masterChef20Contract = useMasterchef20()
  const handleUnstake20 = useCallback(
    async (amount: string) => {
      await unstake(masterChef20Contract, pid, amount, account)
    },
    [account, masterChef20Contract, pid],
  )
  return { onUnstake20: handleUnstake20 }
}

export const useSousUnstake = (sousId, enableEmergencyWithdraw = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { chainId, config } = getNetwork()
  const sousChefContract = usePoolContract(sousId)
  const xjumpContract = useXJump()
  const actionInitiatorsContract = useActionInitiators()
  const xJumpAddress = config.wrappedFarmingToken.address[chainId]

  // xjump needs withdraw from xjump contract
  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      // only xJump pool
      if (sousId === config.wrappedFarmingTokenPid) {
        // check if withdraw initiator is set
        const initiatorIsSet = await isWithdrawInitiator(actionInitiatorsContract, xJumpAddress, account)
        // if not set
        if (!initiatorIsSet) {
          await setWithdrawInitiator(actionInitiatorsContract, xJumpAddress, account)
        }
        // if yes continue to unstake from xJump
        await sousUnstake(xjumpContract, amount, decimals, account)
      }
      // emergencyWithdraw - does not exist on xJump!
      else if (enableEmergencyWithdraw && !(sousId === config.wrappedFarmingTokenPid)) {
        await sousEmergencyUnstake(sousChefContract, account)
      } else {
        // the rest
        await sousUnstake(sousChefContract, amount, decimals, account)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
    },
    [
      account,
      dispatch,
      xjumpContract,
      sousChefContract,
      sousId,
      config.wrappedFarmingTokenPid,
      actionInitiatorsContract,
      xJumpAddress,
      enableEmergencyWithdraw,
    ],
  )

  return { onUnstake: handleUnstake }
}

// only for jump pool20 unstaking
export const useSousUnstake20 = (sousId, enableEmergencyWithdraw = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { chainId, config } = getNetwork()
  const xjumpContract20 = useXJump20()
  const masterChefContract20 = useMasterchef20()

  const handleSousUnstake = useCallback(
    async (amount: string, decimals: number) => {
      // check if withdraw initiator is set
      const initiatorIsSet = await masterChefContract20.methods
        .withdrawInitiator(config.wrappedFarmingToken.address[chainId], account)
        .call()
      // if not set
      if (!initiatorIsSet) {
        await masterChefContract20.methods
          .registerWithdrawInitiator(config.wrappedFarmingToken.address[chainId], true)
          .send({ from: account })
          .on('transactionHash', (tx) => {
            return tx.transactionHash
          })
      }
      //   await farm.registerWithdrawInitiator(xjumpToken.address, true);
      // if yes continue
      await sousUnstake(xjumpContract20, amount, decimals, account)

      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
    },
    [account, dispatch, masterChefContract20, xjumpContract20, sousId, config.wrappedFarmingToken, chainId],
  )

  return { onSousUnstake: handleSousUnstake }
}

export default useUnstake

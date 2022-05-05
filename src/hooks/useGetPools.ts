import { getMasterChefABI } from "config/abi"
import { useActiveWeb3React } from "hooks"
import { useMemo, useState, useEffect, useCallback } from "react"
import { getContract, isAddress } from "utils"
import multicall from "utils/multicall"
import lpTokenAbi from 'config/abi/lpToken.json'
import { BIG_ZERO } from "utils/bigNumber"
import { getLpContract, getMasterchefContract } from "utils/contractHelpers"
import BigNumber from "bignumber.js"

export enum GetPoolsStatus {
  VALID,
  INVALID
}

interface UserInfo {
  amount: BigNumber,
  rewardDebt: BigNumber,
  tradeAmount: BigNumber,
  tradeRewardDebt: BigNumber
}

export const useGetPools = (masterChef: string) => {
  const { library, account } = useActiveWeb3React()
  const address = isAddress(masterChef)
  if(!masterChef) return {
    status: GetPoolsStatus.INVALID,
    callback: null,
    error : null
  }
  if(address){
    const abi = getMasterChefABI()
    return {
      status: GetPoolsStatus.VALID,
      callback: async () => {
        const contract = getContract(address, abi, library, account)
        let length = 0
        try{
          length = await contract.poolLength()
        }catch(e){
          return false
        }
        const calls = []
        if(length) {
          for(let i = 0; i < length; i++){
            calls.push({
              address,
              name: 'poolInfo',
              params: [i]
            })
          }
        }
        const data = await multicall(abi, calls)
        return data.map((d, index) => {
          return {
            pid: index, 
            address: d.token,
          }
        })
      },
      error: null
    }
  }
  return {
    status: GetPoolsStatus.INVALID,
    callback: null,
    error : 'Entered masterchef address is not an address.'
  }
}

export const useGetLPTokens = (address: string) => {
  const [tokens, setTokens] = useState([[''],['']])
  useMemo(() => {
    let isMounted = true
    if(address){
      const calls = [
        {
          address,
          name: 'token0',
          params: []
        },
        {
          address,
          name: 'token1',
          params: []
        },
      ]
    
      multicall(lpTokenAbi, calls)
      .then(result => {
        if(isMounted){
          setTokens(result)
        }
      })
      .catch(e => {
        console.error(e)
      })
    }
      
    

    return () => {
      isMounted = false
    }
  }, [address])

  return tokens
}

export const useGetPoolBalance = (pid: number, address: string): UserInfo => {
  const { library, account } = useActiveWeb3React()
  const [ balance, setBalance ] = useState<UserInfo>({
    amount: BIG_ZERO,
    rewardDebt: BIG_ZERO,
    tradeAmount: BIG_ZERO,
    tradeRewardDebt: BIG_ZERO
  })

  useMemo(() => {
    let isMounted = true
    if(!account || pid === null || !address ){
      if(isMounted) {
        setBalance({
          amount: BIG_ZERO,
          rewardDebt: BIG_ZERO,
          tradeAmount: BIG_ZERO,
          tradeRewardDebt: BIG_ZERO
        })
      }
    }

    const fetchBalance = async () => {
      const contract = getContract(address, getMasterChefABI(), library)
      if(contract){
        const result: UserInfo = await contract.userInfo(pid, account)
        if(isMounted) {
          setBalance({
            amount: new BigNumber(result.amount.toString()), 
            rewardDebt: new BigNumber(result.rewardDebt.toString()), 
            tradeAmount: new BigNumber(result.tradeAmount.toString()),
            tradeRewardDebt: new BigNumber(result.tradeRewardDebt.toString())
          })
        }
      }
    }

    fetchBalance()
    return () => {
      isMounted = false
    }
  }, [pid, address, account, library])

  return balance
}

export const useEmergencyWithdraw = (pid: number, masterChef: string) => {
  const { library, account } = useActiveWeb3React()
  return useCallback(async () => {
    const contract = getContract(masterChef, getMasterChefABI(), library, account)
    if(contract) {
      try{
        const result = await contract.emergencyWithdraw(pid)
        return result
      }catch(e) {
        console.error(e)
        return false
      }
    }
    return false
  },[pid, masterChef, library, account])
}
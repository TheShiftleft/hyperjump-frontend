import { getMasterChefABI } from "config/abi"
import { useActiveWeb3React } from "hooks"
import { useMemo, useState, useEffect } from "react"
import { getContract, isAddress } from "utils"
import multicall from "utils/multicall"

export enum GetPoolsStatus {
  VALID,
  INVALID
}

const useGetPools = (masterChef: string) => {
  const { library, account } = useActiveWeb3React()
  // const [ length, setLength ] = useState()
  const address = isAddress(masterChef)
  if(!masterChef) return {
    status: GetPoolsStatus.INVALID,
    callback: null,
    error : null
  }
  if(address){
    const abi = getMasterChefABI()
    // const contract = getContract(address, abi, library, account)
    // const getLength = async () => {
    //   const l = await contract.poolLength()
    //   setLength(l.toString())
    // }
    // getLength()
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

export default useGetPools
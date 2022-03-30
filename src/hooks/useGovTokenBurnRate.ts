import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { getGovTokenContract } from 'utils/contractHelpers'
import useRefresh from './useRefresh'
import useWeb3 from './useWeb3'

const useGovTokenBurnRate = () => {
  const [burnRate, setBurnRate] = useState(new BigNumber(0))
  const { slowRefresh } = useRefresh()
  const web3 = useWeb3()

  useEffect(() => {
    let mounted = true
    const govTokenContract = getGovTokenContract(web3)
    const fetchBurnRate = async () => {
      const res = await govTokenContract.methods.currentBurnPercent().call()
      if(mounted){
        setBurnRate(new BigNumber(res))
      }
    }

    fetchBurnRate()
    return () => {
      mounted = false
    }
  }, [slowRefresh, web3])

  return burnRate
}

export default useGovTokenBurnRate

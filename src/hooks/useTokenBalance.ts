import { useEffect, useState } from 'react'
import { Network } from '@hyperjump-defi/sdk'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getBep20Contract, getFarmingTokenContract, getGovTokenContract } from 'utils/contractHelpers'
import { getJumpAddress, getMainDistributorAddress, getBridgeDistributorAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import getNetwork from 'utils/getNetwork'
import addresses from 'config/constants/contracts'
import useWeb3 from './useWeb3'
import useRefresh from './useRefresh'
import useLastUpdated from './useLastUpdated'

type UseTokenBalanceState = {
  balance: BigNumber
  fetchStatus: FetchStatus
}

export enum FetchStatus {
  NOT_FETCHED = 'not-fetched',
  SUCCESS = 'success',
  FAILED = 'failed',
}

const useTokenBalance = (tokenAddress: string) => {
  const { NOT_FETCHED, SUCCESS, FAILED } = FetchStatus
  const [balanceState, setBalanceState] = useState<UseTokenBalanceState>({
    balance: BIG_ZERO,
    fetchStatus: NOT_FETCHED,
  })
  const web3 = useWeb3()
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      try {
        const res = await contract.methods.balanceOf(account).call()
        setBalanceState({ balance: new BigNumber(res), fetchStatus: SUCCESS })
      } catch (e) {
        console.error(e)
        setBalanceState((prev) => ({
          ...prev,
          fetchStatus: FAILED,
        }))
      }
    }

    if (account) {
      fetchBalance()
    }
  }, [account, tokenAddress, web3, fastRefresh, SUCCESS, FAILED])

  return balanceState
}

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const farmingTokenContract = getFarmingTokenContract()
      try {
        const supply = await farmingTokenContract.methods.totalSupply().call()
        setTotalSupply(new BigNumber(supply))
      } catch (e) {
        console.error(e)
      }
    }

    fetchTotalSupply()
  }, [slowRefresh])

  return totalSupply
}

export const useBridgeDistributorBalance = (chainId: number) => {
  const { NOT_FETCHED, SUCCESS, FAILED } = FetchStatus
  const [balanceState, setBalanceState] = useState<UseTokenBalanceState>({
    balance: BIG_ZERO,
    fetchStatus: NOT_FETCHED,
  })
  
  const web3 = useWeb3()

  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(getJumpAddress(chainId), web3)
      try {
        const res = await contract.methods.balanceOf(getBridgeDistributorAddress(chainId)).call()
        setBalanceState({ balance: new BigNumber(res), fetchStatus: SUCCESS })
      } catch (e) {
        console.error("e", e)
        setBalanceState((prev) => ({
          ...prev,
          fetchStatus: FAILED,
        }))
      }
    }
    fetchBalance()
  }, [ chainId, web3, fastRefresh, SUCCESS, FAILED])

  return balanceState
}

export const useMainDistributorBalance = (chainId: number) => {
  const { NOT_FETCHED, SUCCESS, FAILED } = FetchStatus
  const [balanceState, setBalanceState] = useState<UseTokenBalanceState>({
    balance: BIG_ZERO,
    fetchStatus: NOT_FETCHED,
  })
  const web3 = useWeb3()

  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(getJumpAddress(chainId), web3)
      try {
        const res = await contract.methods.balanceOf(getMainDistributorAddress(chainId)).call()
        setBalanceState({ balance: new BigNumber(res), fetchStatus: SUCCESS })
      } catch (e) {
        console.error(e)
        setBalanceState((prev) => ({
          ...prev,
          fetchStatus: FAILED,
        }))
      }
    }
    fetchBalance()
  }, [ chainId, web3, fastRefresh, SUCCESS, FAILED])

  return balanceState
}

export const useGovTokenTotalSupply = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const govTokenContract = getGovTokenContract()
      try {
        const supply = await govTokenContract.methods.totalSupply().call()
        setTotalSupply(new BigNumber(supply))
      } catch (e) {
        console.error(e)
      }
    }

    fetchTotalSupply()
  }, [slowRefresh])

  return totalSupply
}

const totalBurnedMethod: Record<Network, string> = {
  [Network.BSC]: 'totalBurned',
  [Network.BSC_TESTNET]: 'totalBurned',
  [Network.FANTOM]: 'totalBurned',
}

export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(BIG_ZERO)
  const { slowRefresh } = useRefresh()
  const { config } = getNetwork()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getFarmingTokenContract(web3)
      const res = await contract.methods[totalBurnedMethod[config.network]]().call()
      setBalance(new BigNumber(res))
    }

    fetchBalance()
  }, [web3, tokenAddress, slowRefresh, config.network])
  return balance
}

export const useGovTokenBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(BIG_ZERO)
  const { slowRefresh } = useRefresh()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getGovTokenContract(web3)
      const res = await contract.methods.totalBurn().call()
      setBalance(new BigNumber(res))
    }

    fetchBalance()
  }, [web3, tokenAddress, slowRefresh])

  return balance
}

export const useGovTokenBurnRate = (tokenAddress: string) => {
  const [rate, setRate] = useState(BIG_ZERO)
  const { slowRefresh } = useRefresh()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getGovTokenContract(web3)
      const res = await contract.methods.currentBurnPercent().call()
      setRate(new BigNumber(res))
    }

    fetchBalance()
  }, [web3, tokenAddress, slowRefresh])

  return rate
}

export const useGetNetworkTokenBalance = () => {
  const [balance, setBalance] = useState(BIG_ZERO)
  const { account } = useWeb3React()
  const { lastUpdated, setLastUpdated } = useLastUpdated()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchBalance = async () => {
      const walletBalance = await web3.eth.getBalance(account)
      setBalance(new BigNumber(walletBalance))
    }

    if (account) {
      fetchBalance()
    }
  }, [account, web3, lastUpdated, setBalance])

  return { balance, refresh: setLastUpdated }
}

export default useTokenBalance

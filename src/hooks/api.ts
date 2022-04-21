import { VAULTS_API_URL } from 'config'
import { useActiveWeb3React } from 'hooks'
import { useEffect, useMemo, useState } from 'react'
import getNetwork from 'utils/getNetwork'
import useWeb3 from './useWeb3'

/* eslint-disable camelcase */
export interface ApiResponse {
  tvl: number
}

export interface CirculatingSupplyApiResponse {
  totalCirculatingSupply: number
  ftm: any
  bsc: any
}

export interface TransactionResponse {
  blockHash: string
  blockNumber: number
  confirmations: number
  contractAddress: string
  cumulativeGasUsed: number
  from: string
  gas: number
  gasPrice: number
  gasUsed: number
  hash: string
  input: string
  isError: number
  nonce: number
  timeStamp: string
  to: string
  transactionIndex: number
  value: number
}

export const useGetBscStats = () => {
  const [data, setData] = useState<ApiResponse | null>(null)
  const { config } = getNetwork()

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        const response = await fetch(`https://vaultsapi.hyperjump.app/tvl`)
        const responseData: ApiResponse = await response.json()
        if (isMounted) {
          setData(responseData)
        }
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
    return () => {
      isMounted = false
    }
  }, [config.network, setData])

  return data
}

export const useGetFtmStats = () => {
  const [ftmData, setFtmData] = useState<ApiResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ftmResponse = await fetch('https://ftmvaultsapi.hyperjump.app/tvl')
        const ftmResponseData: ApiResponse = await ftmResponse.json()

        setFtmData(ftmResponseData)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setFtmData])

  return ftmData
}

export const useGetCirculatingSupplyStats = () => {
  const [data, setData] = useState<CirculatingSupplyApiResponse | null>(null)
  const { config } = getNetwork()

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        const response = await fetch(`https://vaultsapi.hyperjump.app/circulating_supply`)
        const responseData: CirculatingSupplyApiResponse = await response.json()

        if (isMounted) {
          setData(responseData)
        }
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
    return () => {
      isMounted = false
    }
  }, [config.network, setData])

  return data
}

export const useGetLpPrices = () => {
  const [data, setData] = useState()
  const { config } = getNetwork()

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        const response = await fetch(`https://vaultsapi.hyperjump.app/lps`)
        const responseData = await response.json()
        if(mounted){
          setData(responseData)
        }
      }catch(e) {
        console.error('Unable to fetch data:', e)
      }
    }

    fetchData()
    return () => {
      mounted = false
    }
  }, [config.network, setData])

  return data
}

export const useApprovedTransaction = () => {
  const { account, chainId } = useActiveWeb3React()
  const web3 = useWeb3()
  const query = chainId === 250 ? `https://api.ftmscan.com/api?module=account&action=txlist&address=${account}` : `https://api.bscscan.com/api?module=account&action=txlist&address=${account}`

  const [data, setData] = useState()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      const approvalHash = "0x095ea7b3";
      const unlimitedAllowance =
          "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      const response = await fetch(query)
      const responseData = await response.json()
      if(responseData.status === '1'){
        const transactions = responseData.result
        .filter((tx: TransactionResponse) => tx.input.includes(approvalHash))
        .map((tx: TransactionResponse) => {
            const contractAddress = web3.utils.toChecksumAddress(tx.to)
            const approved = web3.utils.toChecksumAddress(`0x${tx.input.substring(34,74)}`)
            const allowanceAmount = tx.input.substring(74)
            const allowance = allowanceAmount.includes(unlimitedAllowance) ? 'Unlimited' : 'Limited'
            if(parseInt(allowanceAmount, 16) !== 0) {
              return {
                contract: contractAddress,
                approved,
                allowance
              }
            }
            return {}
        })
        if(isMounted){
          setData(transactions)
        }
      }
    }
    if(account){
      fetchData()
    }
    return () => {
      isMounted = false
    }
  })
  return data
}

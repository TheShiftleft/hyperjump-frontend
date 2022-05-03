import { VAULTS_API_URL } from 'config'
import { useActiveWeb3React } from 'hooks'
import { useEffect, useMemo, useState } from 'react'
import getNetwork from 'utils/getNetwork'
import { ApprovedTransaction } from 'views/Tools/Unrekt'
import allExtraRpcs from 'config/constants/extraRpcs.json'
import chainIds from 'config/constants/chains'
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

  const [data, setData] = useState<[ApprovedTransaction] | []>()

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
            return {
              contract: contractAddress,
              approved,
              allowance,
              allowanceAmount: parseInt(allowanceAmount, 16)
            }
        })
        .reduce((prev, current) => {
          if(Array.isArray(prev)){
            if(current.allowanceAmount === 0){
              const newArray = prev.filter((element) => !(element.approved === current.approved && element.contract === current.contract))
              return newArray
            }
            return [...prev, current]
          }
          return [prev, current]
        })
        if(isMounted){
          setData(transactions)
        }
      }else if(responseData.result.length === 0){
        setData([])
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

function removeEndingSlash(rpc) {
  return rpc.endsWith('/') ? rpc.substr(0, rpc.length - 1) : rpc;
}

function populateChain(chain, responseTvls) {

  const extraRpcs = allExtraRpcs[chain.chainId]?.rpcs;
  if (extraRpcs !== undefined) {
    const rpcs = new Set(chain.rpc.map(removeEndingSlash).filter((rpc) => !rpc.includes('{INFURA_API_KEY}')));
    extraRpcs.forEach((rpc) => rpcs.add(removeEndingSlash(rpc)));
    chain.rpc = Array.from(rpcs);
  }
  const chainSlug = chainIds[chain.chainId];
  if (chainSlug !== undefined) {
    const defiChain = responseTvls.find((c) => c.name.toLowerCase() === chainSlug);
    return defiChain === undefined
      ? chain
      : {
          ...chain,
          tvl: defiChain.tvl,
          chainSlug,
        };
  }
  return chain;

  
}

export const useChains = () => {
  const [data, setData] = useState()
  useMemo(() => {
    let isMounted = true
    const fetchData = async () => {
      const chains = await fetch('https://chainid.network/chains.json');
      const chainTvls = await fetch('https://api.llama.fi/chains');
      const responseTvls = await chainTvls.json()
      const responseData = await chains.json()
      const sortedChains = responseData
        .filter((c) => c.name !== '420coin') // same chainId as ronin
        .map((chain) => populateChain(chain, responseTvls))
        .sort((a, b) => {
          return (b.tvl ?? 0) - (a.tvl ?? 0);
      });
      const filtered = sortedChains.filter((item) => {
          const testnet =
            item.name?.toLowerCase().includes('test') ||
            item.title?.toLowerCase().includes('test') ||
            item.network?.toLowerCase().includes('test');
          return !testnet;
        })
     
      if(isMounted){
        setData(filtered)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  },[])

  return data
}

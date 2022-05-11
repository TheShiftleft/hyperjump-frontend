import { useEffect, useState } from 'react'
import getNetwork from 'utils/getNetwork'
import { Token } from '@hyperjump-defi/sdk'
import { getAddress } from '@ethersproject/address'
import { isAddress } from 'utils'
import { useTokenBalance, useCurrencyBalance } from 'state/wallet/hooks'
import { useTokenPrice } from './api'
import tokens from '../config/constants/tokens'
import { useAllTokens } from './Tokens'

export interface TokenProps {
  tokenObj: Token
  logo: string
  amount: number
  volume: number
  price: number
}

/* eslint-disable import/prefer-default-export */
export const useGetTokensList = (account) => {
  const [data, setData] = useState([])
  const { config } = getNetwork()
  const [isLoading, setIsLoading] = useState(false)
  const tokenPrices: any = useTokenPrice()
  const alltokens = useAllTokens()
 
    
  useEffect(() => {
    let isMounted = true

    function getTokenPriceviaVault(symbol) {
      if (tokenPrices) {
        const element = Object.keys(tokenPrices).filter((key) => {
          return key === symbol
        })

        return tokenPrices[element[0]]
      }
      return 0
    }

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const network = config.name === 'BSC' ? 'bsc' : 'fantom'
        const tokenslist = []
        const results = Object.values(alltokens)
        results.forEach(async (result) => {
          if (result.chainId === config.id) {
            const tokenAddress = isAddress(result.address)
            let price = 0
            let volume = 0
            let amount = 0
            const tokenPrice = getTokenPriceviaVault(result.symbol.toUpperCase())
            if (tokenPrice) {
              price = tokenPrice
              volume = price * amount
            }

            const tokenObj = new Token(
              config.id,
              getAddress(result.address),
              result.decimals,
              result.symbol,
              result.name,
            )
            const newToken: TokenProps = {
              tokenObj,
              logo: null,
              amount,
              volume: Number.isNaN(volume) ? 0 : volume,
              price,
            }

            tokenslist.push(newToken)
          }
        })

        if (isMounted) {
          setData(tokenslist)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Unable to fetch data:', error)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [config.name, account, config.id, tokenPrices, alltokens])


  return { data, isLoading }
}

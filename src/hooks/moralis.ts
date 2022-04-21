import { useEffect, useState } from 'react'
import getNetwork from 'utils/getNetwork'
import { MORALIS_API_URL, MORALIS_API_KEY } from 'config'
import Moralis from 'moralis'
import { Token } from '@hyperjump-defi/sdk'
import { getAddress } from '@ethersproject/address'
import { getLpContract } from 'utils/contractHelpers'
import { isAddress } from 'utils'
import getChainSupportedTokens from 'config/constants/bridgeTokens'
import { useTokenPrice } from './api'

export interface TokenProps {
  tokenObj: Token
  logo: string
  tokenPairs: any[]
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
        const chainSupportedTokens = getChainSupportedTokens(config.id)
        const result = await Moralis.Web3API.account.getTokenBalances({ chain: network, address: account })

        const tokens = []

        result.forEach(async (token) => {
          if (!token.name.includes('.')) {
            const { name, logo, symbol, balance, token_address, decimals } = token
            const tokenAddress = isAddress(token_address)
            let price = 0
            const lpToken = await checkLpToken(token_address, network)
            const amount = parseInt(balance) / 10 ** parseInt(decimals)
            let volume = 0
            let newLogo = logo
            let pair = []

            if (!lpToken) {
              if (logo === null) {
                const tokenPrice = getTokenPriceviaVault(symbol.toUpperCase())
                if (tokenPrice) {
                  price = tokenPrice
                  volume = price * amount
                } else {
                  const altprice = await getTokenPrice(tokenAddress, network)
                  price = altprice.usdPrice
                  volume = altprice.usdPrice ? altprice.usdPrice * amount : 0
                }

                chainSupportedTokens.forEach((chaintoken) => {
                  if (chaintoken.address === tokenAddress) {
                    newLogo = chaintoken.logoURI
                  }
                })
              }
            } else {
              newLogo = null
              lpToken.forEach(async (tokenpair) => {
                pair.push(tokenpair)
              })
            }

            const tokenObj = new Token(config.id, getAddress(token_address), parseInt(decimals), symbol, name)
            const newToken: TokenProps = {
              tokenObj,
              tokenPairs: pair,
              logo: newLogo,
              amount,
              volume: Number.isNaN(volume) ? 0 : volume,
              price,
            }

            tokens.push(newToken)
          }
        })

        if (isMounted) {
          setData(tokens)
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
  }, [config.name, account, config.id, tokenPrices])

  async function checkLpToken(address, network) {
    let tokenpair = []
    try {
      const lpToken = await getLpContract(getAddress(address))

      if (lpToken) {
        const token0Address = (await lpToken.methods.token0().call()).toLowerCase()
        const token1Address = (await lpToken.methods.token1().call()).toLowerCase()

        tokenpair.push(token0Address, token1Address)
      }

      return tokenpair
    } catch (error) {
      console.error('Unable to fetch data:', error)
      return null
    }
  }

  async function getTokenPrice(address, network) {
    let price
    try {
      const response = await fetch(`${MORALIS_API_URL}/erc20/${address}/price?chain=${network}`, {
        headers: { 'X-API-Key': MORALIS_API_KEY },
      })
      if (response) {
        price = await response.json()
      }
      return price
    } catch (error) {
      console.error('Unable to fetch data:', error)
      return 0
    }
  }

  async function getTokenLogoImage(address) {
    let logoUrl = ''
    try {
      await fetch(`https://tokens.hyperjump.app/images/${address}.png`).then((response) => {
        if (response.ok) {
          logoUrl = response.url
        }
      })
      return logoUrl
    } catch (error) {
      console.error('Unable to fetch data:', error)
      return null
    }
  }

  return { data, isLoading }
}

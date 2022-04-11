import { useEffect, useState } from 'react'
import getNetwork from 'utils/getNetwork'
import { MORALIS_API_URL, MORALIS_API_KEY } from 'config'
import Moralis from 'moralis'
import { Token } from '@hyperjump-defi/sdk'
import { getAddress } from '@ethersproject/address'
import { isAddress } from 'utils'
import getChainSupportedTokens from 'config/constants/bridgeTokens'

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

  useEffect(() => {
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

            let newLogo = logo
            if (logo === null) {
              chainSupportedTokens.forEach((chaintoken) => {
                if (chaintoken.address === tokenAddress) {
                  newLogo = chaintoken.logoURI
                }
              })
              if (newLogo === null) {
                newLogo = await getTokenLogoImage(tokenAddress)
                if (newLogo === null) {
                  let coinid = await searchToken(name)
                  newLogo = await getTokenLogo(coinid)
                }
              }
            }

            const price = await getTokenPrice(tokenAddress, network)
            const amount = parseInt(balance) / 10 ** parseInt(decimals)
            const volume = price.usdPrice ? price.usdPrice * amount : 0
            const tokenObj = new Token(config.id, getAddress(token_address), parseInt(decimals), symbol, name)
            const newToken: TokenProps = {
              tokenObj,
              logo: newLogo,
              amount,
              volume,
              price: price.usdPrice ? price.usdPrice : 0,
            }
            tokens.push(newToken)
          }
        })

        setData(tokens)
        setIsLoading(false)
      } catch (error) {
        console.error('Unable to fetch data:', error)
        setIsLoading(false)
      }
    }

    if (account) {
      fetchData()
    }
  }, [config.name, config.network, account, setData, config.id, setIsLoading])

  async function getTokenPrice(address, network) {
    try {
      const response = await fetch(`${MORALIS_API_URL}/erc20/${address}/price?chain=${network}`, {
        headers: { 'X-API-Key': MORALIS_API_KEY },
      })
      const price = await response.json()

      return price
    } catch (error) {
      console.error('Unable to fetch data:', error)

      return 0
    }
  }

  async function getTokenLogo(name) {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${name.toLowerCase().replace(' token', '').replace(/\s/g, '-')}`,
        {
          headers: { 'X-API-Key': MORALIS_API_KEY },
        },
      )

      const responseData = await response.json()

      return responseData.image.thumb
        ? responseData.image.thumb
        : responseData.image.small
        ? responseData.image.small
        : responseData.image.large
        ? responseData.image.large
        : null
    } catch (error) {
      console.error('Unable to fetch data:', error)
      return ''
    }
  }

  async function searchToken(name) {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${name.toLowerCase().trim().replace(/-/g, ' ').split(' ')[0]}`,

        {
          headers: { 'X-API-Key': MORALIS_API_KEY },
        },
      )
      const responseData = await response.json()
      let responseId = ''
      responseData.coins.forEach((coin) => {
        if (coin.name.toLowerCase() === name.toLowerCase()) {
          responseId = coin.id
        }
      })

      return responseId
    } catch (error) {
      console.error('Unable to fetch data:', error)
      return ''
    }
  }

  async function getTokenLogoImage(address) {
    try {
      const getTokenLogoURL = await fetch(`https://tokens.hyperjump.app/images/${address}.png`)
      return getTokenLogoURL.status === 200 ? getTokenLogoURL.url : null
    } catch (error) {
      console.error('Unable to fetch data:', error)
      return null
    }
  }

  return { data, isLoading }
}

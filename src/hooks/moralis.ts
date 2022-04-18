import { useEffect, useState } from 'react'
import getNetwork from 'utils/getNetwork'
import { MORALIS_API_URL, MORALIS_API_KEY } from 'config'
import Moralis from 'moralis'
import { Token, Pair } from '@hyperjump-defi/sdk'
import { getAddress } from '@ethersproject/address'
import { getLpContract } from 'utils/contractHelpers'
import { isAddress } from 'utils'
import getChainSupportedTokens from 'config/constants/bridgeTokens'

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
            const price = await getTokenPrice(tokenAddress, network)
            const lpToken = await checkLpToken(token_address, network)
            const amount = parseInt(balance) / 10 ** parseInt(decimals)
            const volume = price.usdPrice ? price.usdPrice * amount : 0
            let newLogo = logo
            let pair = []

            if (!lpToken) {
              if (logo === null) {
                chainSupportedTokens.forEach((chaintoken) => {
                  if (chaintoken.address === getAddress(token_address)) {
                    newLogo = chaintoken.logoURI
                  }
                })
                if (newLogo === null) {
                  newLogo = await getTokenLogoImage(getAddress(token_address))
                  if (newLogo === null) {
                    let coinid = await searchToken(name)
                    newLogo = await getTokenLogo(coinid)
                  }
                }
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

    fetchData()
  }, [config.name, account, config.id])

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

  async function getTokenLogo(name) {
    let logoUrl = ''
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${name.toLowerCase().replace(' token', '').replace(/\s/g, '-')}`,
        {
          headers: { 'X-API-Key': MORALIS_API_KEY },
        },
      )

      const responseData = await response.json()
      if (responseData.image.small) {
        logoUrl = responseData.image.small
      }
      if (responseData.image.thumb) {
        logoUrl = responseData.image.thumb
      }
      if (responseData.image.large) {
        logoUrl = responseData.image.large
      }

      return logoUrl
    } catch (error) {
      console.error('Unable to fetch data:', error)
      return null
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
      return null
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

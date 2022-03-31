import { useEffect, useState } from 'react'

import { useMoralis } from 'react-moralis'
import getNetwork from 'utils/getNetwork'
import { MORALIS_API_URL, MORALIS_API_KEY } from 'config'
import Moralis from 'moralis'
import { ChainId, Token, Pair } from '@hyperjump-defi/sdk'
import { getAddress } from '@ethersproject/address'
import { chain } from 'lodash'
import { usePair, usePairs } from '../data/Reserves'
import { isAddress } from '../utils'

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const network = config.name === 'BSC' ? 'bsc' : 'fantom'

        const result = await Moralis.Web3API.account.getTokenBalances({ chain: network, address: account })

        const tokens = []
        result.forEach(async (token) => {
          if (!token.name.includes('.')) {
            const { name, logo, symbol, balance, token_address, decimals } = token
            // const price = await Moralis.Web3API.token.getTokenPrice({
            //   chain: network,
            //   address: token_address,
            // })

            // const tokenAddress = isAddress(token_address)

            const price = await getTokenPrice(token_address, config.network)
            let newLogo = logo
            if (logo === null) {
              newLogo = await getTokenLogoImage(getAddress(token_address))
            }

            const amount = parseInt(balance) / 10 ** parseInt(decimals)
            const volume = price.usdPrice * amount
            const tokenObj = new Token(config.id, getAddress(token_address), parseInt(decimals), symbol, name)
            const newToken: TokenProps = { tokenObj, logo: newLogo, amount, volume, price: price.usdPrice }

            tokens.push(newToken)
          }
        })

        setData(tokens)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    if (account) {
      fetchData()
    }
  }, [config.name, config.network, account, setData, config.id])

  return data
}

async function getTokenPrice(address, network) {
  try {
    const response = await fetch(`${MORALIS_API_URL}/erc20/${address}/price?chain=${network}`, {
      headers: { 'X-API-Key': MORALIS_API_KEY },
    })
    const price = await response.json()
    return price.usdPrice || 0
  } catch (error) {
    console.error('Unable to fetch data:', error)
    return 0
  }
}

async function getTokenLogoImage(address) {
  try {
    const getTokenLogoURL = await fetch(`https://tokens.hyperjump.app/images/${address}.png`)
    return getTokenLogoURL.status === 200 ? getTokenLogoURL.url : null
  } catch (error) {
    return null
  }
}

export async function getTokenLogo(name, network) {
  try {
    console.log(name)
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${name.toLowerCase().replace(' token', '').replace(/\s/g, '-')}`,
      {
        headers: { 'X-API-Key': MORALIS_API_KEY },
      },
    )

    const responseData = await response.json()

    return responseData.image.small ? responseData.image.small : responseData.image.large
  } catch (error) {
    console.error('Unable to fetch data:', error)
    return ''
  }
}

export async function searchToken(name) {
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
      if (coin.symbol.toLowerCase() === name.toLowerCase()) {
        responseId = coin.id
      }
    })

    return responseId
  } catch (error) {
    console.error('Unable to fetch data:', error)
    return ''
  }
}

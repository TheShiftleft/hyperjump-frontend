import { useEffect, useState } from 'react'

import { useMoralis } from "react-moralis";

import getNetwork from 'utils/getNetwork'
import { MORALIS_API_URL, MORALIS_API_KEY } from 'config';
import Moralis from 'moralis';
import { ChainId, Token } from '@hyperjump-defi/sdk';

export interface TokenProps {
  tokenObj: Token
  logo: string,
  amount: number,
  volume: number,
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
        const result = await Moralis.Web3API.account.getTokenBalances({chain: network, address: account})

        const tokens = []
        result.forEach(async token => {
          const { name, logo, symbol, balance, token_address, decimals } = token
          const price = await Moralis.Web3API.token.getTokenPrice({chain: network, address: token_address});
          let newLogo = logo;
          if (!newLogo) {
            newLogo = await getTokenLogo(name, config.network)
          }
          const amount = parseInt(balance) / 10 ** parseInt(decimals)
          const volume = price.usdPrice * amount
          const tokenObj = new Token(
            ChainId.BSC_MAINNET,
            token_address,
            parseInt(decimals),
            symbol,
            name,
          )
          const newToken : TokenProps = { tokenObj, logo: newLogo, amount, volume, price: price.usdPrice };
          tokens.push(newToken)
        })
        // const nativeBalance = await Moralis.Web3API.account.getNativeBalance({chain: 'bsc', address: account})
        // const nativePrice = await Moralis.Web3API.token.getTokenPrice({chain: network});
        // tokens.push({
        //   name: network === 'bsc' ? 'BNB' : 'FTM',
        //   symbol: network === 'bsc' ? 'BNB' : 'FTM',
        //   balance: nativeBalance.balance,
        //   token_address: null,
        //   decimals: 18,
        //   amount: parseInt(nativeBalance.balance) / 10 ** 18,
        //   volume: 
        // })

        setData(tokens)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    if (account) {
      fetchData()
    }
  }, [config.name, config.network, account, setData])

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

async function getTokenLogo(name, network) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${name.toLowerCase().replace(' token', '').replace(/\s/g, '-')}`,
      {
        headers: { 'X-API-Key': MORALIS_API_KEY },
      },
    )
    const responseData = await response.json()
    return responseData.image.small
  } catch (error) {
    console.error('Unable to fetch data:', error)
    return ''
  }
}

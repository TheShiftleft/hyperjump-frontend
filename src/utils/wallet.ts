// Set of helper functions to facilitate wallet setup

import { ChainId } from '@hyperjump-defi/sdk'
import { BASE_BSC_SCAN_URL, BASE_METIS_SCAN_URL } from 'config'

const chainParams: Record<ChainId, any> = {
  [ChainId.METIS]: {
    chainId: '0x440',
    chainName: 'Metis Andromeda Mainnet',
    nativeCurrency: {
      name: 'METIS',
      symbol: 'metis',
      decimals: 18,
    },
    rpcUrls: [process.env.REACT_APP_METIS_NETWORK_URL],
    blockExplorerUrls: [`${BASE_METIS_SCAN_URL}/`],
  },
  [ChainId.BSC_MAINNET]: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain Mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'bnb',
      decimals: 18,
    },
    rpcUrls: [process.env.REACT_APP_BSC_NETWORK_URL],
    blockExplorerUrls: [`${BASE_BSC_SCAN_URL}/`],
  },
  [ChainId.BSC_TESTNET]: {
    chainId: '0x61',
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'bnb',
      decimals: 18,
    },
    rpcUrls: [process.env.REACT_APP_BSC_NETWORK_URL],
    blockExplorerUrls: [`${BASE_BSC_SCAN_URL}/`],
  },
  [ChainId.FTM_MAINNET]: {
    chainId: '0xFA',
    chainName: 'Fantom Mainnet',
    nativeCurrency: {
      name: 'FTM',
      symbol: 'ftm',
      decimals: 18,
    },
    rpcUrls: [process.env.REACT_APP_FTM_NETWORK_URL],
    blockExplorerUrls: ['https://ftmscan.com/'],
  },
  [ChainId.FTM_TESTNET]: {
    chainId: '0xFA2',
    chainName: 'Fantom Testnet',
    nativeCurrency: {
      name: 'tFTM',
      symbol: 'tFtm',
      decimals: 18,
    },
    rpcUrls: [process.env.REACT_APP_FTM_NETWORK_URL],
    blockExplorerUrls: ['https://testnet.ftmscan.com/'],
  },
}
/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
  const provider = (window as WindowChain).ethereum
  if (provider) {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [chainParams[chainId]],
      })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  } else {
    console.error("Can't setup the network on metamask because window.ethereum is undefined")
    return false
  }
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImage
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenImage: string,
) => {
  const tokenAdded = await (window as WindowChain).ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImage,
      },
    },
  })

  return tokenAdded
}

/**
 * Add selected network in to metamask
 * @param account
 * @param chain
 * @param rpc
 */
export const addToNetwork = async (account: string, chain, rpc = null) => {
  if (!account) return

  const params = {
    chainId: `0x${chain.chainId.toString(16)}`, // A 0x-prefixed hexadecimal string
    chainName: chain.name,
    nativeCurrency: {
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol, // 2-6 characters long
      decimals: chain.nativeCurrency.decimals,
    },
    rpcUrls: rpc ? [rpc] : chain.rpc,
    blockExplorerUrls: [
      chain.explorers && chain.explorers.length > 0 && chain.explorers[0].url ? chain.explorers[0].url : chain.infoURL,
    ],
  }
  await (window as WindowChain).ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [params, account],
  })
}

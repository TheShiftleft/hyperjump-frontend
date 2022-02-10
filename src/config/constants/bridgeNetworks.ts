import { Network } from '@hyperjump-defi/sdk'
import ChainId from 'utils/getChain';
import getChainSupportedTokens from 'config/constants/bridgeTokens'

const bridgeSwappableTypePoolsByChain = {
  [ChainId.ETH]: {
    "DAI": "USD",
    "USDC": "USD",
    "USDT": "USD",
    "ETH": "USD",
    "SYN": "SYN",
    "HIGH": "HIGH",
    "DOG": "DOG",
    "FRAX": "FRAX",
  },
  [ChainId.FTM_MAINNET]: {
    "nUSD": "USD",
    "MIM": "USD",
    "USDC": "USD",
    "USDT": "USD",
    "SYN": "SYN",
    "JUMP": "JUMP",
  },
  [ChainId.BSC_MAINNET]: {
    "nUSD": "USD",
    "BUSD": "USD",
    "USDC": "USD",
    "USDT": "USD",
    "SYN": "SYN",
    "HIGH": "HIGH",
    "DOG": "DOG",
    "JUMP": "JUMP",
  },
  [ChainId.HARMONY]: {
    "nUSD": "USD",
    "DAI": "USD",
    "USDC": "USD",
    "USDT": "USD",
    "SYN": "SYN",
  },
}

const bridgeNetworks = [
    {
      'name': 'Binance Smart Chain',
      'chainId': ChainId.BSC_MAINNET,
      'chainCurrency': 'BNB',
      'tokens': getChainSupportedTokens(ChainId.BSC_MAINNET),
      'redirect_url': 'https://bsc.hyperjump.app/bridge/',
      'swappablePools': (bridgeSwappableTypePoolsByChain[ChainId.BSC_MAINNET] ? bridgeSwappableTypePoolsByChain[ChainId.BSC_MAINNET] : undefined)
    },
    {
      'name': 'Fantom',
      'chainId': ChainId.FTM_MAINNET,
      'chainCurrency': 'FTM',
      'tokens': getChainSupportedTokens(ChainId.FTM_MAINNET),
      'redirect_url': 'https://ftm.hyperjump.app/bridge/',
      'swappablePools': (bridgeSwappableTypePoolsByChain[ChainId.FTM_MAINNET] ? bridgeSwappableTypePoolsByChain[ChainId.FTM_MAINNET] : undefined)
    },
    {
      'name': 'Ethereum Mainnet',
      'chainId': ChainId.ETH,
      'chainCurrency': 'ETH',
      'tokens': getChainSupportedTokens(ChainId.ETH),
      'redirect_url': '',
      'swappablePools': (bridgeSwappableTypePoolsByChain[ChainId.ETH] ? bridgeSwappableTypePoolsByChain[ChainId.ETH] : undefined)
    },
    {
      'name': 'Polygon',
      'chainId': 137,
      'chainCurrency': 'MATIC',
      'tokens': getChainSupportedTokens(137),
      'redirect_url': '',
      'swappablePools': (bridgeSwappableTypePoolsByChain[ChainId.FTM_MAINNET] ? bridgeSwappableTypePoolsByChain[ChainId.FTM_MAINNET] : undefined)
    },
    {
      'name': 'Boba Network',
      'chainId': ChainId.BOBA,
      'chainCurrency': 'ETH',
      'tokens': getChainSupportedTokens(ChainId.BOBA),
      'redirect_url': '',
      'swappablePools': (bridgeSwappableTypePoolsByChain[ChainId.FTM_MAINNET] ? bridgeSwappableTypePoolsByChain[ChainId.FTM_MAINNET] : undefined)
    },
    {
      'name': 'Moonriver',
      'chainId': ChainId.MOONRIVER,
      'chainCurrency': 'MOVR',
      'tokens': getChainSupportedTokens(ChainId.MOONRIVER),
      'redirect_url': '',
      'swappablePools': (bridgeSwappableTypePoolsByChain[ChainId.FTM_MAINNET] ? bridgeSwappableTypePoolsByChain[ChainId.FTM_MAINNET] : undefined)
    },
    {
      'name': 'Arbitrum',
      'chainId': ChainId.ARBITRUM,
      'chainCurrency': 'ETH',
      'tokens': getChainSupportedTokens(ChainId.ARBITRUM),
      'redirect_url': '',
      'swappablePools': (bridgeSwappableTypePoolsByChain[ChainId.FTM_MAINNET] ? bridgeSwappableTypePoolsByChain[ChainId.FTM_MAINNET] : undefined)
    },
    {
      'name': 'Avalanche C-Chain',
      'chainId': ChainId.AVALANCHE,
      'chainCurrency': 'AVAX',
      'tokens': getChainSupportedTokens(ChainId.AVALANCHE),
      'redirect_url': '',
      'swappablePools': (bridgeSwappableTypePoolsByChain[ChainId.FTM_MAINNET] ? bridgeSwappableTypePoolsByChain[ChainId.FTM_MAINNET] : undefined)
    },
    {
      'name': 'Harmony',
      'chainId': ChainId.HARMONY,
      'chainCurrency': 'ONE',
      'tokens': getChainSupportedTokens(ChainId.HARMONY),
      'redirect_url': '',
      'swappablePools': (bridgeSwappableTypePoolsByChain[ChainId.HARMONY] ? bridgeSwappableTypePoolsByChain[ChainId.HARMONY] : undefined),
      
    }
]

export default bridgeNetworks

import { Network } from '@hyperjump-defi/sdk'
import ChainId from 'utils/getChain';
import getChainSupportedTokens from 'config/constants/bridgeTokens'

// KEEP THE ORDER INTACT AS IT IS USE TO GET TOKENINDEX
const bridgeSwappableTypePoolsByChain = {
  [ChainId.ETH]: {
    "DAI": "USD",
    "USDC": "USD",
    "USDT": "USD",
    "nUSD": "USD",
    "nETH": "ETH",
    "WETH": "ETH",
    "SYN": "SYN",
    "HIGH": "HIGH",
    "DOG": "DOG",
  },
  [ChainId.FTM_MAINNET]: {
    "nUSD": "USD",
    "MIM": "USD",
    "USDC": "USD",
    "USDT": "USD",
    "nETH": "ETH",
    "ETH": "ETH",
    "SYN": "SYN",
    "JUMP": "JUMP",
    "WETH": "ETH",
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
    "UST": "USD",
  },
  [ChainId.POLYGON]: {
    "nUSD": "USD",
    "DAI": "USD",
    "USDC": "USD",
    "USDT": "USD",
    "SYN": "SYN",
  },
  [ChainId.BOBA]: {
    "nUSD": "USD",
    "DAI": "USD",
    "USDC": "USD",
    "USDT": "USD",
    "nETH": "ETH",
    "ETH": "ETH",
    "SYN": "SYN",
  },
  [ChainId.MOONRIVER]: {
    "SYN": "SYN",
  },
  [ChainId.ARBITRUM]: {
    "nUSD": "USD",
    "DAI": "USD",
    "USDC": "USD",
    "USDT": "USD",
    "nETH": "ETH",
    "ETH": "ETH",
    "SYN": "SYN",
  },
  [ChainId.AVALANCHE]: {
    "nUSD": "USD",
    "DAI": "USD",
    "USDC": "USD",
    "USDT": "USD",
    "SYN": "SYN",
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
      'swappablePools': bridgeSwappableTypePoolsByChain[ChainId.BSC_MAINNET]
    },
    {
      'name': 'Fantom',
      'chainId': ChainId.FTM_MAINNET,
      'chainCurrency': 'FTM',
      'tokens': getChainSupportedTokens(ChainId.FTM_MAINNET),
      'redirect_url': 'https://ftm.hyperjump.app/bridge/',
      'swappablePools': bridgeSwappableTypePoolsByChain[ChainId.FTM_MAINNET]
    },
    {
      'name': 'Ethereum Mainnet',
      'chainId': ChainId.ETH,
      'chainCurrency': 'ETH',
      'tokens': getChainSupportedTokens(ChainId.ETH),
      'redirect_url': '',
      'swappablePools': bridgeSwappableTypePoolsByChain[ChainId.ETH]
    },
    {
      'name': 'Polygon',
      'chainId': 137,
      'chainCurrency': 'MATIC',
      'tokens': getChainSupportedTokens(137),
      'redirect_url': '',
      'swappablePools': bridgeSwappableTypePoolsByChain[ChainId.POLYGON]
    },
    {
      'name': 'Boba Network',
      'chainId': ChainId.BOBA,
      'chainCurrency': 'ETH',
      'tokens': getChainSupportedTokens(ChainId.BOBA),
      'redirect_url': '',
      'swappablePools': bridgeSwappableTypePoolsByChain[ChainId.BOBA]
    },
    {
      'name': 'Moonriver',
      'chainId': ChainId.MOONRIVER,
      'chainCurrency': 'MOVR',
      'tokens': getChainSupportedTokens(ChainId.MOONRIVER),
      'redirect_url': '',
      'swappablePools': bridgeSwappableTypePoolsByChain[ChainId.MOONRIVER]
    },
    {
      'name': 'Arbitrum',
      'chainId': ChainId.ARBITRUM,
      'chainCurrency': 'ETH',
      'tokens': getChainSupportedTokens(ChainId.ARBITRUM),
      'redirect_url': '',
      'swappablePools': bridgeSwappableTypePoolsByChain[ChainId.ARBITRUM]
    },
    {
      'name': 'Avalanche C-Chain',
      'chainId': ChainId.AVALANCHE,
      'chainCurrency': 'AVAX',
      'tokens': getChainSupportedTokens(ChainId.AVALANCHE),
      'redirect_url': '',
      'swappablePools': bridgeSwappableTypePoolsByChain[ChainId.AVALANCHE]
    },
    {
      'name': 'Harmony',
      'chainId': ChainId.HARMONY,
      'chainCurrency': 'ONE',
      'tokens': getChainSupportedTokens(ChainId.HARMONY),
      'redirect_url': '',
      'swappablePools': bridgeSwappableTypePoolsByChain[ChainId.HARMONY]
      
    }
]

export default bridgeNetworks

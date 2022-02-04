import { Network } from '@hyperjump-defi/sdk'
import ChainId from 'utils/getChain';
import getChainSupportedTokens from 'config/constants/bridgeTokens'

const bridgeNetworks = [
    {
      'name': 'Binance Smart Chain',
      'chainId': ChainId.BSC_MAINNET,
      'chainCurrency': 'BNB',
      'tokens': getChainSupportedTokens(ChainId.BSC_MAINNET),
      'redirect_url': 'https://bsc.hyperjump.app/bridge/'
    },
    {
      'name': 'Fantom',
      'chainId': ChainId.FTM_MAINNET,
      'chainCurrency': 'FTM',
      'tokens': getChainSupportedTokens(ChainId.FTM_MAINNET),
      'redirect_url': 'https://ftm.hyperjump.app/bridge/'
    },
    {
      'name': 'Ethereum Mainnet',
      'chainId': ChainId.ETH,
      'chainCurrency': 'ETH',
      'tokens': getChainSupportedTokens(ChainId.ETH),
      'redirect_url': ''
    },
    {
      'name': 'Polygon',
      'chainId': 137,
      'chainCurrency': 'MATIC',
      'tokens': getChainSupportedTokens(137),
      'redirect_url': ''
    },
    {
      'name': 'Boba Network',
      'chainId': ChainId.BOBA,
      'chainCurrency': 'ETH',
      'tokens': getChainSupportedTokens(ChainId.BOBA),
      'redirect_url': ''
    },
    {
      'name': 'Moonriver',
      'chainId': ChainId.MOONRIVER,
      'chainCurrency': 'MOVR',
      'tokens': getChainSupportedTokens(ChainId.MOONRIVER),
      'redirect_url': ''
    },
    {
      'name': 'Arbitrum',
      'chainId': ChainId.ARBITRUM,
      'chainCurrency': 'ETH',
      'tokens': getChainSupportedTokens(ChainId.ARBITRUM),
      'redirect_url': ''
    },
    {
      'name': 'Avalanche C-Chain',
      'chainId': ChainId.AVALANCHE,
      'chainCurrency': 'AVAX',
      'tokens': getChainSupportedTokens(ChainId.AVALANCHE),
      'redirect_url': ''
    },
    {
      'name': 'Harmony',
      'chainId': ChainId.HARMONY,
      'chainCurrency': 'ONE',
      'tokens': getChainSupportedTokens(ChainId.HARMONY),
      'redirect_url': ''
    }
]

export default bridgeNetworks

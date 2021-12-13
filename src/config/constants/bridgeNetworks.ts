import { Network } from '@hyperjump-defi/sdk'
import bridgeTokens from 'config/constants/bridgeTokens'

const bridgeNetworks = [
    {
      'name': 'Binance Smart Chain',
      'chainId': 56,
      'chainCurrency': 'BNB',
      'tokens': bridgeTokens[Network.BSC]
    },
    {
      'name': 'Fantom',
      'chainId': 250,
      'chainCurrency': 'FTM',
      'tokens': bridgeTokens[Network.FTM]
    }
]

export default bridgeNetworks

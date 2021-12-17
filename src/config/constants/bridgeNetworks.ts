import { Network } from '@hyperjump-defi/sdk'
import bridgeTokens from 'config/constants/bridgeTokens'

const bridgeNetworks = [
    {
      'name': 'Binance Smart Chain',
      'chainId': 56,
      'chainCurrency': 'BNB',
      'tokens': bridgeTokens[Network.BSC],
      'redirect_url': 'https://bsc.hyperjump.app/bridge/?outputChainId=250' // might remove later on if we add more chains
    },
    {
      'name': 'Fantom',
      'chainId': 250,
      'chainCurrency': 'FTM',
      'tokens': bridgeTokens[Network.FTM],
      'redirect_url': 'https://ftm.hyperjump.app/bridge/?outputChainId=56'
    }
]

export default bridgeNetworks

import { Network } from '@hyperjump-defi/sdk'
import tokens from 'config/constants/tokens'

const bridgeTokens = {
  [Network.BSC]: [
    {
      name: 'JUMP',
      symbol: 'JUMP',
      address: '0x130025eE738A66E691E6A7a62381CB33c6d9Ae83',
      decimals: 18,
      chainId: 56,
      logoURI: "https://tokens.hyperswap.fi/images/0x78DE9326792ce1d6eCA0c978753c6953Cdeedd73.png"
    },
    {
      name: 'BUSD',
      symbol: 'BUSD',
      address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      decimals: 18,
      chainId: 56,
      logoURI: "https://tokens.hyperswap.fi/images/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56.png"
    },
  ],
  [Network.FTM]: [
    {
      name: 'JUMP',
      symbol: 'JUMP',
      address: '0x78DE9326792ce1d6eCA0c978753c6953Cdeedd73',
      decimals: 18,
      chainId: 250
    },
  ],
}

export default bridgeTokens

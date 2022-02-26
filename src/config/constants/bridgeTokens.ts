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
      logoURI: 'https://tokens.hyperjump.app/images/0x78DE9326792ce1d6eCA0c978753c6953Cdeedd73.png',
    },
  ],
  [Network.FTM]: [
    {
      name: 'JUMP',
      symbol: 'JUMP',
      address: '0x78DE9326792ce1d6eCA0c978753c6953Cdeedd73',
      decimals: 18,
      chainId: 250,
      logoURI: 'https://tokens.hyperjump.app/images/0x78DE9326792ce1d6eCA0c978753c6953Cdeedd73.png',
    },
  ],
}

export default bridgeTokens

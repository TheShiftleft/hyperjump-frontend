import { Network } from '@hyperjump-defi/sdk'
import tokens from 'config/constants/tokens'

const bridgeTokens = {
  [Network.BSC]: [
    {
      lpSymbol: 'JUMP',
      token: tokens.jump,
    },
    {
      lpSymbol: 'BNB',
      token: tokens.jump,
    },
  ],
  [Network.FTM]: [
    {
      lpSymbol: 'ETH',
      token: tokens.jump,
    },
  ],
}

export default bridgeTokens

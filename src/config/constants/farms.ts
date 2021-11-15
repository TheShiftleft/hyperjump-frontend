import { Network } from '@hyperjump-defi/sdk'
import tokens from './tokens'
import { FarmConfig } from './types'

const farms: Record<Network, FarmConfig[]> = {
  [Network.BSC_TESTNET]: [
    {
      pid: 0,
      lpSymbol: 'JUMP',
      lpAddresses: {
        97: '0x2c9a2fA5d93c7A4CFfBB45e94f05Fd9eF58A5CE2',
      },
      token: tokens.jump,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 1,
      lpSymbol: 'JUMP-BNB',
      lpAddresses: {
        97: '0x68ed8ec86a1d0d367f7462dc9ea1644970160376',
      },
      token: tokens.jump,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 2,
      lpSymbol: 'JUMP-BUSD',
      lpAddresses: {
        97: '0xA49c5526225034214AD8fC3b19Dc6bDcf58B487C',
      },
      token: tokens.jump,
      quoteToken: tokens.busd,
    },
    {
      pid: 3,
      lpSymbol: 'BUSD-BNB',
      lpAddresses: {
        97: '0x81aca0c535bb13e0cd2f10a3c6e4dc1b9bbe6c0e',
      },
      token: tokens.busd,
      quoteToken: tokens.wbnb,
    },
  ],
  [Network.BSC]: [
    /**
     * These 3 farms (PID 0, 1, 3) should always be at the top of the list.
     */
    {
      pid: 0,
      lpSymbol: 'JUMP',
      lpAddresses: {
        56: '0x130025eE738A66E691E6A7a62381CB33c6d9Ae83',
      },
      token: tokens.jump,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 1,
      lpSymbol: 'JUMP-BNB',
      lpAddresses: {
        56: '0x13F5088D69b0c417C376747a75c57aABD75e9551',
      },
      token: tokens.jump,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 2,
      lpSymbol: 'JUMP-BUSD',
      lpAddresses: {
        56: '0x2ed207F0f273A773A890F74Dc17DEf2E6E1f42e3',
      },
      token: tokens.jump,
      quoteToken: tokens.busd,
    },
    {
      pid: 3,
      lpSymbol: 'HYPR-BNB',
      lpAddresses: {
        56: '0x3701cfe08a3f0b629dbcaeceba773a8b4f0044e3',
      },
      token: tokens.hypr,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 4,
      lpSymbol: 'BUSD-BNB',
      lpAddresses: {
        56: '0xf2e4e3f9b58b3edac88ad11d689a23f3119a782d',
      },
      token: tokens.busd,
      quoteToken: tokens.wbnb,
    },
  ],
  [Network.FANTOM]: [
    {
      pid: 0,
      lpSymbol: 'JUMP',
      lpAddresses: {
        250: '0x78DE9326792ce1d6eCA0c978753c6953Cdeedd73',
      },
      token: tokens.jump,
      quoteToken: tokens.wftm,
    },
    {
      pid: 1,
      lpSymbol: 'JUMP-FTM',
      lpAddresses: {
        250: '0x5448a3B93731e7C1d6e6310Cb614843FbaC21f69',
      },
      token: tokens.jump,
      quoteToken: tokens.wftm,
    },
    {
      pid: 2,
      lpSymbol: 'JUMP-USDC',
      lpAddresses: {
        250: '0x33685A26B47a1778B412Df224e99964Ca87C59BD',
      },
      token: tokens.usdc,
      quoteToken: tokens.jump,
    },
    {
      pid: 3,
      lpSymbol: 'AURORA-FTM',
      lpAddresses: {
        250: '0x483d07bc99cdd1df66f64ae0a769a70725c46fa4',
      },
      token: tokens.aurora,
      quoteToken: tokens.wftm,
    },
    {
      pid: 4,
      lpSymbol: 'FTM-USDC',
      lpAddresses: {
        250: '0x50cc648e45b84d68405ba0707e94c507b08e593d',
      },
      token: tokens.usdc,
      quoteToken: tokens.wftm,
    },
    /* {
      pid: 5,
      lpSymbol: 'JUMP',
      lpAddresses: {
        250: '0x5621Ca989428CF105784164b84D500f4a6bEc889',
      },
      token: tokens.jump,
      quoteToken: tokens.jump,
    }, */
  ],
}

export default farms

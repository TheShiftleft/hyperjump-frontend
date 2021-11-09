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
      lpSymbol: 'ALLOY',
      lpAddresses: {
        56: '0x5eF5994fA33FF4eB6c82d51ee1DC145c546065Bd',
      },
      token: tokens.alloy,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 1,
      lpSymbol: 'ALLOY-BNB',
      lpAddresses: {
        97: '0xd94966164b5247A202c98C64F0B929715D6c1916',
        56: '0xf0696E201D20b553792ac2578429B791625308A0',
      },
      token: tokens.alloy,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 3,
      lpSymbol: 'BUSD-BNB',
      lpAddresses: {
        97: '0x81aCa0c535bb13e0cD2F10A3c6E4DC1b9Bbe6c0e',
        56: '0xf2e4e3f9b58b3edac88ad11d689a23f3119a782d',
      },
      token: tokens.busd,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 2,
      lpSymbol: 'HYPR-BNB',
      lpAddresses: {
        97: '0x2Ca6FC658b4ca5Ea03b488C77D00DD5a746B9A6a',
        56: '0x3701cfe08a3f0b629dbcaeceba773a8b4f0044e3',
      },
      token: tokens.hypr,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 27,
      lpSymbol: 'ALLOY-BUSD',
      lpAddresses: {
        56: '0x6e94fb9c08f7e651bf0ed732708e5f148db061c6',
      },
      quoteToken: tokens.alloy,
      token: tokens.busd,
    },
    {
      pid: 4,
      lpSymbol: 'ETH-BNB',
      lpAddresses: {
        97: '0x8963301c9e34d10c4f33f8930e0fae4473a7d3b2',
        56: '0x75115c644f9661a761a333ba0a38e42b1649f143',
      },
      token: tokens.eth,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 5,
      lpSymbol: 'BTC-BNB',
      lpAddresses: {
        97: '0xdfb193940e1317f38e91568fdb05efe18ee4a3c7',
        56: '0xdfb193940e1317f38e91568fdb05efe18ee4a3c7',
      },
      token: tokens.btcb,
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
      lpSymbol: 'USDC-FTM',
      lpAddresses: {
        250: '0x50cc648e45b84d68405ba0707e94c507b08e593d',
      },
      token: tokens.usdc,
      quoteToken: tokens.wftm,
    },
  ],
}

export default farms

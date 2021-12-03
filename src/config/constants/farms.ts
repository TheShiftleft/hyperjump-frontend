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
    // pid 6 is xjump, 5 is wrong deployment
    {
      pid: 7,
      lpSymbol: 'BNB-ADA',
      lpAddresses: {
        56: '0x700693fbfb05ac9ee4928959591f38490711539c',
      },
      token: tokens.ada,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 8,
      lpSymbol: 'BNB-BTCB',
      lpAddresses: {
        56: '0xdfb193940e1317f38e91568fdb05efe18ee4a3c7',
      },
      token: tokens.btcb,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 9,
      lpSymbol: 'BUSD-BTCB',
      lpAddresses: {
        56: '0x10ee95172e77069Cf8B72bc9ae0eEa1661F6015D',
      },
      token: tokens.btcb,
      quoteToken: tokens.busd,
    },
    {
      pid: 10,
      lpSymbol: 'BNB-ETH',
      lpAddresses: {
        56: '0x75115c644f9661a761a333ba0a38e42b1649f143',
      },
      token: tokens.eth,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 11,
      lpSymbol: 'BUSD-ETH',
      lpAddresses: {
        56: '0x6407f7a9b9e6c1e398c10a20da2fe17f89131cf0',
      },
      token: tokens.eth,
      quoteToken: tokens.busd,
    },
    {
      pid: 12,
      lpSymbol: 'BNB-FTM',
      lpAddresses: {
        56: '0xC6CA7790B1fB1f2d8097dC429c31Ca150A2762d8',
      },
      token: tokens.wftm,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 13,
      lpSymbol: 'BNB-GLCH',
      lpAddresses: {
        56: '0xBe9F5945606fae18D64348E64435D4CC49d3eBCe',
      },
      token: tokens.glch,
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
      jump staking pool using xjump
      pid: 5,
      lpSymbol: 'JUMP',
      lpAddresses: {
        250: '0x5621Ca989428CF105784164b84D500f4a6bEc889',
      },
      token: tokens.jump,
      quoteToken: tokens.jump,
    }, */
    {
      pid: 6,
      lpSymbol: 'USDC-DAI',
      lpAddresses: {
        250: '0xD7Ee3fd59a2d8082B56319f858fceaD9a902C0A1',
      },
      token: tokens.dai,
      quoteToken: tokens.usdc,
    },
    {
      pid: 7,
      lpSymbol: 'FTM-CRV',
      lpAddresses: {
        250: '0x7785698f2aa354558c77a0186be0dfd2a9b2452d',
      },
      token: tokens.curve,
      quoteToken: tokens.wftm,
    },
    {
      pid: 8,
      lpSymbol: 'FTM-BNB',
      lpAddresses: {
        250: '0x55c5B2868eae98f38C8c6b84435eD90B400466f9',
      },
      token: tokens.bnb,
      quoteToken: tokens.wftm,
    },
    {
      pid: 9,
      lpSymbol: 'FTM-DAI',
      lpAddresses: {
        250: '0x6d898d98818e670c695e374ed77cd1753cf109dd',
      },
      token: tokens.dai,
      quoteToken: tokens.wftm,
    },
    {
      pid: 10,
      lpSymbol: 'FTM-ICE',
      lpAddresses: {
        250: '0x3d7bc2ee79a21e56dc52b874de3ad5c341f6d888',
      },
      token: tokens.ice,
      quoteToken: tokens.wftm,
    },
    // 11 is mim error
    {
      pid: 12,
      lpSymbol: 'FTM-SUSHI',
      lpAddresses: {
        250: '0xf9f979b0283031c4afa4d668626779363b5fe510',
      },
      token: tokens.sushi,
      quoteToken: tokens.wftm,
    },
    {
      pid: 13,
      lpSymbol: 'USDC-ICE',
      lpAddresses: {
        250: '0x2e037324b04043e80ca788e0c008bfc772b5ee32',
      },
      token: tokens.ice,
      quoteToken: tokens.usdc,
    },
    {
      pid: 14,
      lpSymbol: 'JUMP-DAI',
      lpAddresses: {
        250: '0x60529abad498054eacaaca1b7ffed2ce4cfcb10b',
      },
      token: tokens.dai,
      quoteToken: tokens.jump,
    },
    {
      pid: 15,
      lpSymbol: 'FTM-MIM',
      lpAddresses: {
        250: '0x90b28d674e53860ba1d560180cd7f561341ebc45',
      },
      token: tokens.mim,
      quoteToken: tokens.wftm,
    },
  ],
}

export default farms

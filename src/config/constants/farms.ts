import { Network } from '@hyperjump-defi/sdk'
import tokens from './tokens'
import { FarmConfig } from './types'

const farms: Record<Network, FarmConfig[]> = {
  [Network.BSC_TESTNET]: [
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
      pid: 6,
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
     * These 3 farms (PID  1,2, 3) should always be at the top of the list.
     */
    {
      pid: 0,
      lpSymbol: 'xJUMP',
      lpAddresses: {
        56: '0x522650de53e79ead931e4eb3537b12d7fe06697d',
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
      lpSymbol: 'HYPR-BNB',
      lpAddresses: {
        56: '0x3701cfe08a3f0b629dbcaeceba773a8b4f0044e3',
      },
      token: tokens.hypr,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 3,
      lpSymbol: 'BUSD-BNB',
      lpAddresses: {
        56: '0xf2e4e3f9b58b3edac88ad11d689a23f3119a782d',
      },
      token: tokens.busd,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 4,
      lpSymbol: 'ADA-BNB',
      lpAddresses: {
        56: '0x700693fbfb05ac9ee4928959591f38490711539c',
      },
      token: tokens.ada,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 5,
      lpSymbol: 'BTCB-BNB',
      lpAddresses: {
        56: '0xdfb193940e1317f38e91568fdb05efe18ee4a3c7',
      },
      token: tokens.btcb,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 6,
      lpSymbol: 'ETH-BNB',
      lpAddresses: {
        56: '0x75115c644f9661a761a333ba0a38e42b1649f143',
      },
      token: tokens.eth,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 7,
      lpSymbol: 'FTM-BNB',
      lpAddresses: {
        56: '0xC6CA7790B1fB1f2d8097dC429c31Ca150A2762d8',
      },
      token: tokens.wftm,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 8,
      lpSymbol: 'GLCH-BNB',
      lpAddresses: {
        56: '0xBe9F5945606fae18D64348E64435D4CC49d3eBCe',
      },
      token: tokens.glch,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 9,
      lpSymbol: 'AVAX-BNB',
      lpAddresses: {
        56: '0x92265995F20747e55B8d6d6FBEcf5dF507447c83',
      },
      token: tokens.avax,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 12,
      lpSymbol: 'SOL-BNB',
      lpAddresses: {
        56: '0xC30011d6dd82E9980004565C53c186D0a1a96017',
      },
      token: tokens.sol,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 13,
      lpSymbol: 'DAI-BUSD',
      lpAddresses: {
        56: '0xF0945Bb76B23BE86021197A8C555d5967b574d32',
      },
      token: tokens.dai,
      quoteToken: tokens.busd,
    },
  ],
  [Network.FANTOM]: [
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
      lpSymbol: 'AURORA-FTM',
      lpAddresses: {
        250: '0x483d07bc99cdd1df66f64ae0a769a70725c46fa4',
      },
      token: tokens.aurora,
      quoteToken: tokens.wftm,
    },

    {
      pid: 3,
      lpSymbol: 'USDC-FTM',
      lpAddresses: {
        250: '0x50cc648e45b84d68405ba0707e94c507b08e593d',
      },
      token: tokens.usdc,
      quoteToken: tokens.wftm,
    },
    {
      pid: 4,
      lpSymbol: 'USDC-DAI',
      lpAddresses: {
        250: '0xD7Ee3fd59a2d8082B56319f858fceaD9a902C0A1',
      },
      token: tokens.dai,
      quoteToken: tokens.usdc,
    },
    {
      pid: 5,
      lpSymbol: 'CRV-FTM',
      lpAddresses: {
        250: '0x7785698f2aa354558c77a0186be0dfd2a9b2452d',
      },
      token: tokens.curve,
      quoteToken: tokens.wftm,
    },
    {
      pid: 6,
      lpSymbol: 'BNB-FTM',
      lpAddresses: {
        250: '0x55c5B2868eae98f38C8c6b84435eD90B400466f9',
      },
      token: tokens.bnb,
      quoteToken: tokens.wftm,
    },
    {
      pid: 7,
      lpSymbol: 'SUSHI-FTM',
      lpAddresses: {
        250: '0xf9f979b0283031c4afa4d668626779363b5fe510',
      },
      token: tokens.sushi,
      quoteToken: tokens.wftm,
    },
    {
      pid: 8,
      lpSymbol: 'MIM-FTM',
      lpAddresses: {
        250: '0x90b28d674e53860ba1d560180cd7f561341ebc45',
      },
      token: tokens.mim,
      quoteToken: tokens.wftm,
    },
    {
      pid: 9,
      lpSymbol: 'AVAX-FTM',
      lpAddresses: {
        250: '0x37cC74ACd40569f0B639bfb4cdA0Fea07a21F3E0',
      },
      token: tokens.avax,
      quoteToken: tokens.wftm,
    },
    {
      pid: 10,
      lpSymbol: 'ICE-FTM',
      lpAddresses: {
        250: '0x3d7bc2ee79a21e56dc52b874de3ad5c341f6d888',
      },
      token: tokens.ice,
      quoteToken: tokens.wftm,
    },
    {
      pid: 13,
      lpSymbol: 'ETH-FTM',
      lpAddresses: {
        250: '0xc81a9cE5Be68dF6A52F82D83398420D8A1C245c2',
      },
      token: tokens.eth,
      quoteToken: tokens.wftm,
    },
    {
      pid: 14,
      lpSymbol: 'BTC-FTM',
      lpAddresses: {
        250: '0x9a2B08B7620B8c387d96f9C1DC315aFD93651F5e',
      },
      token: tokens.btc,
      quoteToken: tokens.wftm,
    },
  ],
}

export default farms

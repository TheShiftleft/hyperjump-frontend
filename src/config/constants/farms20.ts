import { Network } from '@hyperjump-defi/sdk'
import tokens from './tokens'
import { FarmConfig } from './types'

const farms: Record<Network, FarmConfig[]> = {
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
        56: '0x3701cFE08a3f0b629dBcaEcebA773A8B4f0044E3',
      },
      token: tokens.hypr,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 4,
      lpSymbol: 'BUSD-BNB',
      lpAddresses: {
        56: '0xf2e4E3F9B58b3eDaC88Ad11D689a23f3119a782D',
      },
      token: tokens.busd,
      quoteToken: tokens.wbnb,
    },
    // pid 6 is xjump, 5 is wrong deployment
    { pid: 5 },
    { pid: 6 },
    {
      pid: 7,
      lpSymbol: 'ADA-BNB',
      lpAddresses: {
        56: '0x700693fbfb05Ac9ee4928959591f38490711539C',
      },
      token: tokens.ada,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 8,
      lpSymbol: 'BTCB-BNB',
      lpAddresses: {
        56: '0xdFb193940E1317f38e91568fdb05EFE18ee4A3c7',
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
      lpSymbol: 'ETH-BNB',
      lpAddresses: {
        56: '0x75115C644F9661A761A333Ba0A38e42B1649f143',
      },
      token: tokens.eth,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 11,
      lpSymbol: 'ETH-BUSD',
      lpAddresses: {
        56: '0x6407f7A9B9e6c1e398c10a20Da2Fe17F89131CF0',
      },
      token: tokens.eth,
      quoteToken: tokens.busd,
    },
    {
      pid: 12,
      lpSymbol: 'FTM-BNB',
      lpAddresses: {
        56: '0xC6CA7790B1fB1f2d8097dC429c31Ca150A2762d8',
      },
      token: tokens.wftm,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 13,
      lpSymbol: 'GLCH-BNB',
      lpAddresses: {
        56: '0xBe9F5945606fae18D64348E64435D4CC49d3eBCe',
      },
      token: tokens.glch,
      quoteToken: tokens.wbnb,
    },
    {
      pid: 14,
      lpSymbol: 'AVAX-BNB',
      lpAddresses: {
        56: '0x92265995F20747e55B8d6d6FBEcf5dF507447c83',
      },
      token: tokens.avax,
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
        250: '0x483D07BC99CdD1DF66F64aE0A769A70725C46fA4',
      },
      token: tokens.aurora,
      quoteToken: tokens.wftm,
    },
    {
      pid: 4,
      lpSymbol: 'USDC-FTM',
      lpAddresses: {
        250: '0x50Cc648E45B84D68405BA0707e94c507b08e593d',
      },
      token: tokens.usdc,
      quoteToken: tokens.wftm,
    },
    // doesnt work but for iterations sake,       jump staking pool using xjump
    {
      pid: 5,
      lpSymbol: 'JUMP',
      lpAddresses: {
        250: '0x5621Ca989428CF105784164b84D500f4a6bEc889',
      },
      token: tokens.jump,
      quoteToken: tokens.jump,
    },
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
      lpSymbol: 'CRV-FTM',
      lpAddresses: {
        250: '0x7785698F2Aa354558C77a0186bE0dFD2a9B2452d',
      },
      token: tokens.curve,
      quoteToken: tokens.wftm,
    },
    {
      pid: 8,
      lpSymbol: 'BNB-FTM',
      lpAddresses: {
        250: '0x55c5B2868eae98f38C8c6b84435eD90B400466f9',
      },
      token: tokens.bnb,
      quoteToken: tokens.wftm,
    },
    {
      pid: 9,
      lpSymbol: 'DAI-FTM',
      lpAddresses: {
        250: '0x6D898d98818e670C695E374ED77cd1753cF109Dd',
      },
      token: tokens.dai,
      quoteToken: tokens.wftm,
    },
    {
      pid: 10,
      lpSymbol: 'ICE-FTM',
      lpAddresses: {
        250: '0x3D7bC2eE79a21e56dc52B874de3aD5c341f6D888',
      },
      token: tokens.ice,
      quoteToken: tokens.wftm,
    },
    // 11 is mim error
    { pid: 11 },
    {
      pid: 12,
      lpSymbol: 'SUSHI-FTM',
      lpAddresses: {
        250: '0xF9f979b0283031c4afA4d668626779363B5fE510',
      },
      token: tokens.sushi,
      quoteToken: tokens.wftm,
    },
    {
      pid: 13,
      lpSymbol: 'USDC-ICE',
      lpAddresses: {
        250: '0x2e037324b04043e80Ca788e0c008BFC772B5Ee32',
      },
      token: tokens.ice,
      quoteToken: tokens.usdc,
    },
    {
      pid: 14,
      lpSymbol: 'JUMP-DAI',
      lpAddresses: {
        250: '0x60529aBAD498054eAcaacA1b7ffeD2Ce4CfCB10b',
      },
      token: tokens.dai,
      quoteToken: tokens.jump,
    },
    {
      pid: 15,
      lpSymbol: 'MIM-FTM',
      lpAddresses: {
        250: '0x90B28d674E53860bA1D560180CD7f561341EBC45',
      },
      token: tokens.mim,
      quoteToken: tokens.wftm,
    },
    {
      pid: 16,
      lpSymbol: 'AVAX-FTM',
      lpAddresses: {
        250: '0x37cC74ACd40569f0B639bfb4cdA0Fea07a21F3E0',
      },
      token: tokens.avax,
      quoteToken: tokens.wftm,
    },
  ],
}

export default farms

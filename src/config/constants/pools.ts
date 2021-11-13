import { Network } from '@hyperjump-defi/sdk'
import tokens from './tokens'
import { PoolCategory, PoolConfig } from './types'

const pools: Record<Network, PoolConfig[]> = {
  [Network.BSC_TESTNET]: [
    {
      sousId: 0,
      stakingToken: tokens.jump,
      earningToken: tokens.jump,
      contractAddress: {
        97: '0x683fE36D7e543181ba19101283B7Ed3c2B3CD749',
      },
      poolCategory: PoolCategory.CORE,
      harvest: true,
      tokenPerBlock: '3.141592653589793238',
      sortOrder: 1,
      isFinished: false,
    },
  ],
  [Network.BSC]: [
    /*  {
      sousId: 0,
      stakingToken: tokens.jump,
      earningToken: tokens.jump,
      contractAddress: {
        56: '0x130025eE738A66E691E6A7a62381CB33c6d9Ae83',
      },
      poolCategory: PoolCategory.CORE,
      harvest: true,
      tokenPerBlock: '3.141592653589793238',
      sortOrder: 1,
      isFinished: false,
    }, */
    {
      sousId: 6,
      stakingToken: tokens.jump,
      earningToken: tokens.jump,
      contractAddress: {
        56: '0x522650de53e79ead931e4eb3537b12d7fe06697d', // '0x4F19004b7012035D1DDD30795860e44D79a59beA', // xjump contract
      },
      poolCategory: PoolCategory.CORE,
      harvest: true,
      tokenPerBlock: '1.583940258751902587',
      sortOrder: 1,
      isFinished: false,
    },
  ],
  [Network.FANTOM]: [
    // we dont use pid 0, instead use pid 5 for xjump
    /* {
      sousId: 0,
      stakingToken: tokens.jump,
      earningToken: tokens.jump,
      contractAddress: {
        250: '0x2E03284727Ff6E50BB00577381059a11e5Bb01dE', // farm contract
      },
      poolCategory: PoolCategory.CORE,
      harvest: true,
      tokenPerBlock: '1.585489599188229325',
      sortOrder: 1,
      isFinished: false,
    }, */
    {
      sousId: 5,
      stakingToken: tokens.jump,
      earningToken: tokens.jump,
      contractAddress: {
        250: '0x5621Ca989428CF105784164b84D500f4a6bEc889', // xjump contract
      },
      poolCategory: PoolCategory.CORE,
      harvest: true,
      tokenPerBlock: '1.585489599188229325',
      sortOrder: 1,
      isFinished: false,
    },
  ],
}

export default pools

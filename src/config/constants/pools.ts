import { Network } from '@hyperjump-defi/sdk'
import tokens from './tokens'
import { PoolCategory, PoolConfig } from './types'

const pools: Record<Network, PoolConfig[]> = {
  [Network.BSC]: [
    {
      sousId: 11,
      stakingToken: tokens.jump,
      earningToken: tokens.jump,
      contractAddress: {
        56: tokens.xjump.address[56], // xjump 2.1 contract
      },
      poolCategory: PoolCategory.CORE,
      harvest: true,
      tokenPerBlock: '1.583940258751902587',
      sortOrder: 1,
      isFinished: false,
    },
  ],
  [Network.FANTOM]: [
    {
      sousId: 12,
      stakingToken: tokens.jump,
      earningToken: tokens.jump,
      contractAddress: {
        250: tokens.xjump.address[250], // xjump 2.1 contract
      },
      poolCategory: PoolCategory.CORE,
      harvest: true,
      tokenPerBlock: '1.585489599188229325',
      sortOrder: 1,
      isFinished: false,
    },
  ],
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
}

export default pools

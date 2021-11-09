import { Network } from '@hyperjump-defi/sdk'
import tokens from './tokens'
import { FarmConfig } from './types'

const priceHelperLps: Record<Network, FarmConfig[]> = {
  [Network.BSC_TESTNET]: [],
  [Network.FANTOM]: [
    {
      pid: null,
      lpSymbol: 'CRV-FTM',
      lpAddresses: {
        97: '',
        250: '0x7785698f2aa354558c77a0186be0dfd2a9b2452d',
      },
      token: tokens.curve,
      quoteToken: tokens.wftm,
    },
    {
      pid: null,
      lpSymbol: 'BOO-FTM',
      lpAddresses: {
        97: '',
        250: '0x518cB777484b7CF2Ee2d22b9F11e149e1dDDbfE1',
      },
      token: tokens.boo,
      quoteToken: tokens.wftm,
    },
    {
      pid: null,
      lpSymbol: 'SCREAM-FTM',
      lpAddresses: {
        97: '',
        250: '0x30872e4fc4edbfd7a352bfc2463eb4fae9c09086',
      },
      token: tokens.scream,
      quoteToken: tokens.wftm,
    },
  ],

  [Network.BSC]: [
    /**
     * These LPs are just used to help with price calculation for MasterChef LPs (farms.ts).
     * This list is added to the MasterChefLps and passed to fetchFarm. The calls to get contract information about the token/quoteToken in the LP are still made.
     * The absense of a PID means the masterchef contract calls are skipped for this farm.
     * Prices are then fetched for all farms (masterchef + priceHelperLps).
     * Before storing to redux, farms without a PID are filtered out.
     */
    {
      pid: null,
      lpSymbol: 'CAKE-BNB',
      lpAddresses: {
        97: '',
        56: '0x15A94BC319058c6A3aE5B409c4aC017d06a80a75',
      },
      token: tokens.cake,
      quoteToken: tokens.wbnb,
    },
    {
      pid: null,
      lpSymbol: 'OIL-BNB',
      lpAddresses: {
        97: '',
        56: '0xb313143C448D5512a5Ddb1635CAc1a47755E6ACF',
      },
      token: tokens.oil,
      quoteToken: tokens.wbnb,
    },
    {
      pid: null,
      lpSymbol: 'ADA-BNB',
      lpAddresses: {
        97: '',
        56: '0x700693fbfb05ac9ee4928959591f38490711539c',
      },
      token: tokens.ada,
      quoteToken: tokens.wbnb,
    },
    {
      pid: null,
      lpSymbol: 'AXS-BNB',
      lpAddresses: {
        97: '',
        56: '0xa40e2f322512c6aba7d04a9d929599c52c23a3b6',
      },
      token: tokens.axs,
      quoteToken: tokens.wbnb,
    },
    {
      pid: null,
      lpSymbol: 'BAKE-BNB',
      lpAddresses: {
        97: '',
        56: '0x8d0aba2c48a0c478e9de6dc33b62bf7ae66ecdc0',
      },
      token: tokens.bake,
      quoteToken: tokens.wbnb,
    },
  ],
}

export default priceHelperLps

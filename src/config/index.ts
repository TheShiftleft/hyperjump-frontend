import BigNumber from 'bignumber.js/bignumber'
import { Network, ChainId, Token, WRAPPED, JSBI, Percent } from '@hyperjump-defi/sdk'
import { BIG_TEN } from 'utils/bigNumber'
import getNetwork from 'utils/getNetwork'
import BSC_TESTNET_SWAP_TOKEN_LIST from './constants/bsc-testnet-swap-tokens.json'
import BSC_SWAP_TOKEN_LIST from './constants/bsc-swap-tokens.json'
import FTM_SWAP_TOKEN_LIST from './constants/ftm-swap-tokens.json'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const { chainId, config } = getNetwork()

export const FARM_TOKEN_PER_BLOCK = new BigNumber(config.localEmissionRate)
// NOT IN USE ?? export const FARM_TOKEN_POOL_PID = 1

export const BSC_BLOCK_TIME = 3
export const BSC_BLOCKS_PER_YEAR = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24 * 365) // 10512000
export const FTM_BLOCKS_PER_YEAR = new BigNumber(60 * 60 * 24 * 365)

// TODO: move these into helper functions?
export const FARM_TOKEN_PER_YEAR: Record<Network, BigNumber> = {
  [Network.BSC]: FARM_TOKEN_PER_BLOCK.times(FTM_BLOCKS_PER_YEAR),
  [Network.BSC_TESTNET]: FARM_TOKEN_PER_BLOCK.times(BSC_BLOCKS_PER_YEAR),
  [Network.FANTOM]: FARM_TOKEN_PER_BLOCK.times(FTM_BLOCKS_PER_YEAR),
}

export const BLOCKS_PER_YEAR: Record<Network, BigNumber> = {
  [Network.BSC]: BSC_BLOCKS_PER_YEAR,
  [Network.BSC_TESTNET]: BSC_BLOCKS_PER_YEAR,
  [Network.FANTOM]: FTM_BLOCKS_PER_YEAR,
}

export const VAULTS_API_BASE: Record<Network, string> = {
  [Network.BSC_TESTNET]: 'https://vaults.hyperswap.info',
  [Network.BSC]: 'https://vaults.hyperswap.info',
  [Network.FANTOM]: 'https://ftmvaults.hyperswap.info',
}
export const VAULTS_API_URL = VAULTS_API_BASE[config.network]

const BSC_NETWORK_URL = process.env.REACT_APP_BSC_NETWORK_URL
const BSC_TESTNET_NETWORK_URL = process.env.REACT_APP_BSC_TESTNET_NETWORK_URL
const FTM_NETWORK_URL = process.env.REACT_APP_FTM_NETWORK_URL
const FTM_TESTNET_NETWORK_URL = process.env.REACT_APP_FTM_TESTNET_NETWORK_URL

const NETWORK_URLS = {
  [ChainId.BSC_MAINNET]: BSC_NETWORK_URL,
  [ChainId.BSC_TESTNET]: BSC_TESTNET_NETWORK_URL,
  [ChainId.FTM_MAINNET]: FTM_NETWORK_URL,
  [ChainId.FTM_TESTNET]: FTM_TESTNET_NETWORK_URL,
}
export const NETWORK_URL = NETWORK_URLS[chainId]

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`NETWORK_URL for chain ID ${chainId} must be a defined environment variable`)
}

export const BASE_EXCHANGE_URL = '/swap'
export const BASE_INFO_URL = config.infoLink
export const BASE_INFO_PAIR_URL = `${BASE_INFO_URL}/pair`
export const BASE_ADD_LIQUIDITY_URL = '/add'
export const BASE_LIQUIDITY_POOL_URL = '/pool'
// to be removed:
export const LOTTERY_MAX_NUMBER_OF_TICKETS = 50
export const LOTTERY_TICKET_PRICE = 1

export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
export const DEFAULT_GAS_LIMIT = 200000

export const DEFAULT_BSC_GAS_PRICE = 5
export const DEFAULT_FTM_GAS_PRICE = 80

export const DEFAULT_GAS_PRICE: Record<Network, number> = {
  [Network.BSC]: DEFAULT_BSC_GAS_PRICE,
  [Network.BSC_TESTNET]: DEFAULT_BSC_GAS_PRICE,
  [Network.FANTOM]: DEFAULT_FTM_GAS_PRICE,
}

// stuff from swap config

const SWAP_TOKEN_LISTS: Record<Network, any> = {
  [Network.BSC]: BSC_TESTNET_SWAP_TOKEN_LIST,
  [Network.BSC_TESTNET]: BSC_SWAP_TOKEN_LIST,
  [Network.FANTOM]: FTM_SWAP_TOKEN_LIST,
}
export const DEFAULT_SWAP_TOKEN_LIST = SWAP_TOKEN_LISTS[config.network]

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

// TODO DJ TJ move all this to SDK
export const ALLOY = new Token(
  ChainId.BSC_MAINNET,
  '0x5eF5994fA33FF4eB6c82d51ee1DC145c546065Bd',
  18,
  'ALLOY',
  'HYPER ALLOY',
)
export const WBNB = new Token(
  ChainId.BSC_MAINNET,
  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  18,
  'WBNB',
  'Wrapped BNB',
)
export const DAI = new Token(
  ChainId.BSC_MAINNET,
  '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
  18,
  'DAI',
  'Dai Stablecoin',
)
export const BUSD = new Token(
  ChainId.BSC_MAINNET,
  '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  18,
  'BUSD',
  'Binance USD',
)
export const BTCB = new Token(
  ChainId.BSC_MAINNET,
  '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
  18,
  'BTCB',
  'Binance BTC',
)
export const USDT = new Token(
  ChainId.BSC_MAINNET,
  '0x55d398326f99059fF775485246999027B3197955',
  18,
  'USDT',
  'Tether USD',
)
export const UST = new Token(
  ChainId.BSC_MAINNET,
  '0x23396cF899Ca06c4472205fC903bDB4de249D6fC',
  18,
  'UST',
  'Wrapped UST Token',
)
export const ETH = new Token(
  ChainId.BSC_MAINNET,
  '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  18,
  'ETH',
  'Binance-Peg Ethereum Token',
)

const fDAI = new Token(ChainId.FTM_MAINNET, '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', 18, 'DAI', 'Dai Token')
const ORI = new Token(ChainId.FTM_MAINNET, '0x0575f8738EFdA7F512e3654F277C77e80C7d2725', 18, 'ORI', 'HyperOri')
const fUSDC = new Token(ChainId.FTM_MAINNET, '0x04068da6c83afcfa0e13ba15a6696662335d5b75', 8, 'USDC', 'USDC Token')
const fUSDT = new Token(ChainId.FTM_MAINNET, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD')

const WRAPPED_ONLY: ChainTokenList = {
  [ChainId.BSC_MAINNET]: [WRAPPED[ChainId.BSC_MAINNET]],
  [ChainId.BSC_TESTNET]: [WRAPPED[ChainId.BSC_TESTNET]],
  [ChainId.FTM_MAINNET]: [WRAPPED[ChainId.FTM_MAINNET]],
  [ChainId.FTM_TESTNET]: [WRAPPED[ChainId.FTM_TESTNET]],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WRAPPED_ONLY,
  [ChainId.BSC_MAINNET]: [...WRAPPED_ONLY[ChainId.BSC_MAINNET], DAI, BUSD, BTCB, USDT, UST, ETH],
  [ChainId.FTM_MAINNET]: [...WRAPPED_ONLY[ChainId.FTM_MAINNET], fDAI, fUSDC, fUSDT, ORI],
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.BSC_MAINNET]: {},
  [ChainId.FTM_MAINNET]: {},
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WRAPPED_ONLY,
  [ChainId.BSC_MAINNET]: [...WRAPPED_ONLY[ChainId.BSC_MAINNET], DAI, BUSD, USDT],
  [ChainId.FTM_MAINNET]: [...WRAPPED_ONLY[ChainId.FTM_MAINNET], fDAI, fUSDC, fUSDT],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_ONLY,
  [ChainId.BSC_MAINNET]: [...WRAPPED_ONLY[ChainId.BSC_MAINNET], DAI, BUSD, BTCB, USDT],
  [ChainId.FTM_MAINNET]: [...WRAPPED_ONLY[ChainId.FTM_MAINNET], fDAI, fUSDC, fUSDT],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.BSC_MAINNET]: [
    [ALLOY, WRAPPED[ChainId.BSC_MAINNET]],
    [BUSD, USDT],
    [DAI, USDT],
  ],
  [ChainId.FTM_MAINNET]: [
    [ORI, WRAPPED[ChainId.FTM_MAINNET]],
    [fUSDC, fUSDT],
    [fDAI, fUSDT],
  ],
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 80
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH

export const BASE_BSC_SCAN_URL = 'https://bscscan.com'
export const BASE_FTM_SCAN_URL = 'https://ftmscan.com'
export const BASE_BSC_TESTNET_SCAN_URL = 'https://testnet.bscscan.com'
export const BASE_FTM_TESTNET_SCAN_URL = 'https://testnet.ftmscan.com'

const SCANNER_URLS = {
  [ChainId.BSC_MAINNET]: BASE_BSC_SCAN_URL,
  [ChainId.BSC_TESTNET]: BASE_BSC_TESTNET_SCAN_URL,
  [ChainId.FTM_MAINNET]: BASE_FTM_SCAN_URL,
  [ChainId.FTM_TESTNET]: BASE_FTM_TESTNET_SCAN_URL,
}

export const SCANNER_URL = SCANNER_URLS[chainId]

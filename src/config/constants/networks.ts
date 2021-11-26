import { BNB, ChainId, CurrencyAmount, FANTOM, Network } from '@hyperjump-defi/sdk'
import tokens from 'config/constants/tokens'

const networks = [
  {
    name: 'BSC',
    network: Network.BSC,
    id: 56,
    url: process.env.REACT_APP_BSC_BASE_URL,
    networkTokenUsdFarmPid: 4,
    farmingTokenUsdFarmPid: 2,
    farmingTokenNetworkTokenFarmPid: 1,
    govTokenNetworkTokenFarmPid: 3,
    wrappedFarmingTokenPid: 6,
    coreFarms: [1, 2, 3, 4],
    farmingToken: tokens.jump,
    govToken: tokens.hypr,
    networkToken: tokens.bnb,
    wrappedNetworkToken: tokens.wbnb,
    wrappedFarmingToken: tokens.xjump,
    timerScale: 1, // changed from 3
    farmMultiplierScale: 100,
    baseCurrencyAmount: CurrencyAmount.bnb,
    baseCurrency: BNB,
    swapTokenListUrl: 'https://tokens.hyperswap.fi/tokens.json',
    scannerName: 'BSC Scan',
    approvalDomainName: 'Thugswap Street LP',
    votingLink: 'https://snapshot.org/#/bsc.hyperjumpdao.eth',
    bridgePath: 'https://www.binance.org/en/bridge?utm_source=Hyperjump',
    contractsLink: 'https://hyperjump.fi/contracts-bsc.html',
    infoLink: 'https://bsc-info.hyperjump.app',
    supportedChainIds: [ChainId.BSC_MAINNET],
    vaultCompoundTime: '8 hours',
    localEmissionRate: 1.583940258751902587,
  },
  {
    name: 'BSC_TESTNET',
    network: Network.BSC_TESTNET,
    id: 97,
    url: process.env.REACT_APP_BSC_TESTNET_BASE_URL,
    networkTokenUsdFarmPid: 3, // BNB BUSD
    farmingTokenUsdFarmPid: 2, // JUMP BUSD
    farmingTokenNetworkTokenFarmPid: 1, // JUMP BNB
    govTokenNetworkTokenFarmPid: 1,
    wrappedFarmingTokenPid: 5,
    coreFarms: [1, 2, 3],
    farmingToken: tokens.jump,
    govToken: tokens.hypr,
    networkToken: tokens.bnb,
    wrappedNetworkToken: tokens.wbnb,
    wrappedFarmingToken: tokens.xjump,
    timerScale: 1, // changed from 3
    farmMultiplierScale: 100,
    baseCurrencyAmount: CurrencyAmount.bnb,
    baseCurrency: BNB,
    swapTokenListUrl: 'https://tokens.hyperswap.fi/bscTestnetTokens.json',
    scannerName: 'BSC Scan',
    approvalDomainName: 'Thugswap Street LP',
    votingLink: 'https://snapshot.org/#/bsc.hyperjumpdao.eth',
    bridgePath: 'https://www.binance.org/en/bridge?utm_source=Hyperjump',
    contractsLink: 'https://hyperjump.fi/contracts-bsc.html',
    infoLink: '/analytics',
    supportedChainIds: [ChainId.BSC_TESTNET],
    vaultCompoundTime: '8 hours',
  },
  {
    name: 'FTM',
    network: Network.FANTOM,
    id: 250,
    url: process.env.REACT_APP_FTM_BASE_URL,
    networkTokenUsdFarmPid: 4,
    farmingTokenUsdFarmPid: 2,
    farmingTokenNetworkTokenFarmPid: 1,
    govTokenNetworkTokenFarmPid: 3,
    wrappedFarmingTokenPid: 5,
    coreFarms: [1, 2, 3, 4],
    farmingToken: tokens.jump,
    govToken: tokens.aurora,
    networkToken: tokens.ftm,
    wrappedNetworkToken: tokens.wftm,
    wrappedFarmingToken: tokens.xjump,
    timerScale: 1,
    farmMultiplierScale: 100,
    baseCurrencyAmount: CurrencyAmount.ftm,
    baseCurrency: FANTOM,
    swapTokenListUrl: 'https://tokens.hyperswap.fi/ftmswap.json',
    scannerName: 'FTM Scan',
    approvalDomainName: 'HyperSwap LP',
    votingLink: 'https://snapshot.org/#/ftm.hyperjumpdao.eth',
    bridgePath: '',
    contractsLink: 'https://hyperjump.fi/contracts-ftm.html',
    infoLink: 'https://ftm-info.hyperjump.fi',
    supportedChainIds: [ChainId.FTM_MAINNET],
    vaultCompoundTime: 'hour',
    localEmissionRate: 1.585489599188229325,
  },
]

export default networks

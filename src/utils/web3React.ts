import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { Web3Provider } from '@ethersproject/providers'
import { BscConnector } from '@binance-chain/bsc-connector'
import { ConnectorNames } from 'uikit'
import { CloverConnector } from '@clover-network/clover-connector'
import Web3 from 'web3'
import { ChainId } from '@hyperjump-defi/sdk'
import getNodeUrl from './getRpcUrl'
import getNetwork from './getNetwork'

const { config } = getNetwork()
const POLLING_INTERVAL = 12000
const rpcUrl = getNodeUrl()
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)

export const injected = new InjectedConnector({ supportedChainIds: config.supportedChainIds })
export const clover = new CloverConnector({ supportedChainIds: [56, 250] })
export const bscConnector = new BscConnector({ supportedChainIds: [ChainId.BSC_TESTNET, ChainId.BSC_MAINNET] })
export const walletlink = new WalletLinkConnector({ url: rpcUrl, appName: 'HyperJump' })
export const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl },
  qrcode: true,
  /*   pollingInterval: POLLING_INTERVAL,
   */
})

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
  [ConnectorNames.WalletLink]: walletlink,
  [ConnectorNames.Coin98]: injected,
  [ConnectorNames.Clover]: clover,
}

export const getLibrary = (provider): Web3 => {
  return provider
}

export const getLibrarySwap = (provider): Web3Provider => {
  const library = new Web3Provider(provider)
  library.pollingInterval = 15000
  return library
}

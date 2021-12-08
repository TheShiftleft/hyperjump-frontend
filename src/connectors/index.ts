import { ConnectorNames } from 'uikit'
import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import getNetwork from 'utils/getNetwork'
import { NETWORK_URL } from 'config'
import { NetworkConnector } from './NetworkConnector'

const { chainId, config } = getNetwork()
// TODO DJ TJ: are these connectors used anywhere? src/utils/web
// ANGRY-MECH: to some extend not 100% yet
export const network = new NetworkConnector({
  urls: { [chainId]: NETWORK_URL },
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  // eslint-disable-next-line no-return-assign
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: config.supportedChainIds,
})

export const bscConnector = new BscConnector({
  supportedChainIds: config.supportedChainIds,
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: NETWORK_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  /* pollingInterval: 15000, */
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL,
  appName: 'HyperJump',
  appLogoUrl:
    'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg',
})

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
  [ConnectorNames.WalletLink]: walletlink,
  [ConnectorNames.Coin98]: injected,
  [ConnectorNames.OntoWallet]: injected,
}

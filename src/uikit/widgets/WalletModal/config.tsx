import { Network } from '@hyperjump-defi/sdk'
import Metamask from './icons/Metamask'
import MathWallet from './icons/MathWallet'
import OntoWallet from './icons/OntoWallet'
import TokenPocket from './icons/TokenPocket'
import TrustWallet from './icons/TrustWallet'
import WalletConnect from './icons/WalletConnect'
import BinanceChain from './icons/BinanceChain'
import SafePalWallet from './icons/SafePalWallet'
import WalletLinkIcon from './icons/WalletLink'
import Coin98Icon from './icons/Coin98'
import { Config, ConnectorNames } from './types'

const connectors: Record<Network, Config[]> = {
  [Network.BSC]: [
    {
      title: 'Metamask',
      icon: Metamask,
      connectorId: ConnectorNames.Injected,
    },
    {
      title: 'TrustWallet',
      icon: TrustWallet,
      connectorId: ConnectorNames.Injected,
    },
    {
      title: 'MathWallet',
      icon: MathWallet,
      connectorId: ConnectorNames.Injected,
    },
    {
      title: 'WalletConnect',
      icon: WalletConnect,
      connectorId: ConnectorNames.WalletConnect,
    },
    {
      title: 'Binance Chain Wallet',
      icon: BinanceChain,
      connectorId: ConnectorNames.BSC,
    },
    {
      title: 'SafePal Wallet',
      icon: SafePalWallet,
      connectorId: ConnectorNames.Injected,
    },
    {
      title: 'Coin98',
      icon: Coin98Icon,
      connectorId: ConnectorNames.Injected,
    },
    {
      title: 'OntoWallet',
      icon: OntoWallet,
      connectorId: ConnectorNames.OntoWallet,
    },
    {
      title: 'TokenPocket',
      icon: TokenPocket,
      connectorId: ConnectorNames.Injected,
    },
  ],
  [Network.BSC_TESTNET]: [
    {
      title: 'Metamask',
      icon: Metamask,
      connectorId: ConnectorNames.Injected,
    },
  ],
  [Network.FANTOM]: [
    {
      title: 'Metamask',
      icon: Metamask,
      connectorId: ConnectorNames.Injected,
    },
    {
      title: 'MathWallet',
      icon: MathWallet,
      connectorId: ConnectorNames.Injected,
    },
    {
      title: 'WalletConnect',
      icon: WalletConnect,
      connectorId: ConnectorNames.WalletConnect,
    },
    {
      title: 'Coinbase',
      icon: WalletLinkIcon,
      connectorId: ConnectorNames.WalletLink,
    },
    {
      title: 'Coin98',
      icon: Coin98Icon,
      connectorId: ConnectorNames.Injected,
    },
    {
      title: 'SafePal Wallet',
      icon: SafePalWallet,
      connectorId: ConnectorNames.Injected,
    },    
  ],
}

export default connectors
export const connectorLocalStorageKey = 'connectorId'

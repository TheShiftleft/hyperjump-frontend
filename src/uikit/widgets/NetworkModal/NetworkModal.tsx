import React from 'react'
import getNetwork from 'utils/getNetwork'
import NetworkModalButton from '../../components/Button/NetworkModalButton'
import { Modal } from '../ModalForNetworkButton'
import BSCLogo from './icons/BinanceChainWName'
import FTMLogo from './icons/FantomChainWName'
import './icons/style.css'

interface Props {
  onDismiss?: () => void
}

// FIXME DJ TJ move to ./icons/style.css and use className
const bscButtonStyle = {
  borderRadius: '50px',
  marginBottom: '20px',
  backgroundColor: '#000',
}

const ftmButtonStyle = {
  borderRadius: '50px',
  margin: '0px',
}

// FIXME DJ TJ move to useNetworks once styles and logos removed
const networks = [
  {
    name: 'BSC',
    id: 56,
    url: process.env.REACT_APP_BSC_BASE_URL,
    className: 'bsc',
    style: bscButtonStyle,
    logo: BSCLogo
  },
  {
    name: 'FTM',
    id: 250,
    url: process.env.REACT_APP_FTM_BASE_URL,
    className: '',
    style: ftmButtonStyle,
    logo: FTMLogo
  }
]

const NetworkModal: React.FC<Props> = ({ onDismiss = () => null }) => {
  const { chainId } = getNetwork();

  const align = { alignItems: 'center', justifyContent: 'center' }

  const handleNetworkSelect = network => {
    if (network.id === chainId) {
      onDismiss();
    } else {
      window.open(network.url, '_self');
    }
  };
  return (
    <Modal
      title="Choose network"
      onDismiss={onDismiss}
    >
      {networks.map(network => {
        const Logo = network.logo
        return (
          <div style={align}>
            <NetworkModalButton
              className={`${network.className} ${network.id === chainId ? 'highlighted' : ''}`}
              size="sm"
              variant="primary"
              onClick={() => handleNetworkSelect(network)}
              style={network.style}
            >
              <Logo/>
            </NetworkModalButton>
          </div>
        )
      })}
    </Modal>
  )
}

export default NetworkModal

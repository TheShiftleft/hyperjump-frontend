import React from 'react'
import styled from 'styled-components'
import getNetwork from 'utils/getNetwork'
import { Link } from '../../components/Link'
import { HelpIcon } from '../../components/Svg'
import { Modal } from '../Modal'
import WalletCard from './WalletCard'
import config from './config'
import { Login } from './types'

interface Props {
  login: Login
  onDismiss?: () => void
}

const HelpLink = styled(Link)`
  display: flex;
  align-self: center;
  align-items: center;
  margin-top: 24px;
`

const ConnectModal: React.FC<Props> = ({ login, onDismiss = () => null }) => {
  const { config: networkConfig } = getNetwork()

  return (
    <Modal title="Connect to a wallet" onDismiss={onDismiss}>
      {config[networkConfig.network].map((entry, index) => (
        <WalletCard
          key={entry.title}
          login={login}
          walletConfig={entry}
          onDismiss={onDismiss}
          mb={index < config[networkConfig.network].length - 1 ? '8px' : '0'}
        />
      ))}
      <HelpLink href="https://docs.hyperjump.app/get-started/connection-guide" external>
        <HelpIcon color="primary" mr="6px" />
        Learn how to connect
      </HelpLink>
    </Modal>
  )
}

export default ConnectModal

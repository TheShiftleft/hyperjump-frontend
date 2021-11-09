import React from 'react'
import styled from 'styled-components'
import { Network } from '@hyperjump-defi/sdk'
import getNetwork from 'utils/getNetwork'
import { useNetworkModal } from '../NetworkModal'
import NetworkIconButton from '../../components/Button/NetworkIconButton'
import BSCIcon from './icons/BSCNetwork'
import BSCTestnetIcon from './icons/BSCNetworkTestnet'
import FTMIcon from './icons/FTMNetwork'

const btnStyle = {
  borderRadius: '50%',
  border: '0px solid',
  color: '#44C4E2',
  margin: '0',
  padding: '0',
  width: '36px',
  height: '36px',
}

const networkIconStyle = {
  borderRadius: '50%',
  border: '0px solid',
  color: '#44C4E2',
  marginRight: '0px',
  padding: '1px',
  width: '34px',
  height: '34px',
}

const Container = styled.div`
  margin-right: 10px;
  @media (max-width: 545px) {
    margin-right: 5px;
  }
`

const networkIcon: Record<Network, any> = {
  [Network.BSC]: BSCIcon,
  [Network.BSC_TESTNET]: BSCTestnetIcon,
  [Network.FANTOM]: FTMIcon,
}

const NetworkBlock: React.FC = () => {
  const { onPresentNetworkModal } = useNetworkModal()
  const { config } = getNetwork()

  const Icon = networkIcon[config.network]
  return (
    <Container>
      <NetworkIconButton
        type="button"
        style={btnStyle}
        startIcon="Icon"
        onClick={() => {
          onPresentNetworkModal()
        }}
      >
        <Icon style={networkIconStyle} />
      </NetworkIconButton>
    </Container>
  )
}

export default NetworkBlock

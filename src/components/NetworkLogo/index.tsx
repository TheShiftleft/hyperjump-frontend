import React from 'react'
import { BridgeNetwork } from '../NetworkSelectionModal/types'
import BSCIcon from '../../uikit/widgets/Menu/icons/BSCNetwork'
import FTMIcon from '../../uikit/widgets/Menu/icons/FTMNetwork'
import ETHIcon from '../../uikit/widgets/Menu/icons/EthereumNetwork'
import MATICIcon from '../../uikit/widgets/Menu/icons/PolygonNetwork'

const networkIcon = {
  BSC: BSCIcon,
  FTM: FTMIcon,
  ETH: ETHIcon,
  MATIC: MATICIcon
}

const networkIconStyle = {
  borderRadius: '50%',
  marginRight: '8px',
  width: '24px',
  height: '24px',
}

export default function NetworkLogo({
  bridgeNetwork,
  size = '24px',
  style,
}: {
  bridgeNetwork?: BridgeNetwork
  size?: string
  style?: React.CSSProperties
}) {

  let Icon
  switch(bridgeNetwork.chainCurrency){
    case 'FTM':
      Icon = networkIcon.FTM
      break
    case 'ETH':
      Icon = networkIcon.ETH
      break
    case 'MATIC':
      Icon = networkIcon.MATIC
      break
    default:
      Icon = networkIcon.BSC
  }

  return <Icon style={{...style, ...networkIconStyle}} />
}

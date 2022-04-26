import React from 'react'
import styled from "styled-components";
import BSCIcon from 'uikit/widgets/Menu/icons/BSCNetwork'
import FTMIcon from 'uikit/widgets/Menu/icons/FTMNetwork'
import EthereumIcon from 'uikit/widgets/Menu/icons/EthereumNetwork'
import AvalancheIcon from 'uikit/widgets/Menu/icons/AvalancheNetwork'
import MoonRiverIcon from 'uikit/widgets/Menu/icons/MoonRiverNetwork'
import PolygonIcon from 'uikit/widgets/Menu/icons/PolygonNetwork'
import { Text } from 'uikit';

const networkIcon = {
  BNB: BSCIcon,
  FTM: FTMIcon,
  ETH: EthereumIcon,
  AVAX: AvalancheIcon,
  MOVR: MoonRiverIcon,
  MATIC: PolygonIcon
}

const networkIconStyle = {
  borderRadius: '50%',
  border: '0px solid',
  color: '#44C4E2',
  marginRight: '10px',
  padding: '1px',
  width: '34px',
  height: '34px',
}

const StyledText = styled(Text)`
  display: flex;
`

const NetworkIcon = ({symbol, alt}: {symbol: string, alt:string}) => {
  const Icon = networkIcon[symbol]
  return (
    <StyledText title={alt.toUpperCase()}>
      <Icon style={networkIconStyle} title={alt}/>
    </StyledText>
  )
}

export default NetworkIcon
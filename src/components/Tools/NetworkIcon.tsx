import React, { useMemo } from 'react'
import styled from "styled-components";
import BSCIcon from 'uikit/widgets/Menu/icons/BSCNetwork'
import FTMIcon from 'uikit/widgets/Menu/icons/FTMNetwork'
import EthereumIcon from 'uikit/widgets/Menu/icons/EthereumNetwork'
import AvalancheIcon from 'uikit/widgets/Menu/icons/AvalancheNetwork'
import MoonRiverIcon from 'uikit/widgets/Menu/icons/MoonRiverNetwork'
import PolygonIcon from 'uikit/widgets/Menu/icons/PolygonNetwork'
import { Text } from 'uikit';
import Logo from 'components/Logo';
import { Chain } from 'views/Tools/Chainlist/Table';

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
  padding: '1px'
}

const StyledText = styled(Text)`
  display: flex;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

const NetworkIcon = ({chain, alt, size}: {chain?: Chain, alt:string, size: string}) => {
  const srcs:string[] = useMemo(() => {
    const mainIcon = chain.chainSlug ? `https://defillama.com/chain-icons/rsz_${chain.chainSlug}.jpg` : '/unknown-logo.png';
    return [mainIcon]
  }, [chain.chainSlug])
  return (
    <StyledText title={alt.toUpperCase()}>
      <StyledLogo size={size} srcs={srcs} alt={`${alt} logo`} style={networkIconStyle} />
    </StyledText>
  )
}

export default NetworkIcon
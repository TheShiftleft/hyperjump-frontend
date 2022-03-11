import { Currency, Token } from '@hyperjump-defi/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import getNetwork from 'utils/getNetwork'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
import { BridgeNetwork } from '../NetworkSelectionModal/types'
// FIXME replace this
const getTokenLogoURL = (address: string) =>
  `https://https://gateway.pinata.cloud/ipfs/QmcUD9JjFmyTch3WkQprY48QNoseTCYkCu9XRtm5F4zUuY/images/${address}.png`

const StyledBnbLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function NetworkLogo({
  bridgeNetwork,
  size = '24px',
  style,
}: {
  bridgeNetwork?: BridgeNetwork
  size?: string
  style?: React.CSSProperties
}) {
  const { config } = getNetwork()
  const srcs: string[] = useMemo(() => {
    return [`/images/tokens/${bridgeNetwork.chainCurrency.toLowerCase() ?? 'token'}.png`]
  }, [bridgeNetwork])

  return <StyledLogo size={size} srcs={srcs} alt={`${bridgeNetwork.name ?? 'token'} logo`} style={style} />
}

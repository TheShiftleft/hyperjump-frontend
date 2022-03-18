import { Currency, Token } from '@hyperjump-defi/sdk'
import { getAddress } from 'ethers/lib/utils'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import getNetwork from 'utils/getNetwork'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'

// FIXME replace this
const getTokenLogoURL = (address: string) =>
  `https://gateway.pinata.cloud/ipfs/QmcUD9JjFmyTch3WkQprY48QNoseTCYkCu9XRtm5F4zUuY/images/${address}.png`

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

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const { config } = getNetwork()
  const srcs: string[] = useMemo(() => {
    if (currency === config.baseCurrency) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [
          ...uriLocations,
          `/images/tokens/${currency?.address ?? 'token'}.png`,
          getTokenLogoURL(currency.address),
        ]
      }

      return [`/images/tokens/${currency?.address ?? 'token'}.png`, getTokenLogoURL(currency.address)]
    }
    return []
  }, [config.baseCurrency, currency, uriLocations])

  if (currency === config.baseCurrency) {
    return (
      <StyledBnbLogo src={`/images/tokens/${config.networkToken.symbol.toLowerCase()}.png`} size={size} style={style} />
    )
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}

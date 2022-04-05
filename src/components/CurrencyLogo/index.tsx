import { Currency, Network, Token } from '@hyperjump-defi/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import getNetwork from 'utils/getNetwork'

import { useAllTokens } from 'hooks/Tokens'
import { filterTokens } from '../../views/Farms/components/filtering'

import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
import BSCIcon from '../../uikit/widgets/Menu/icons/BSCNetwork'
import BSCTestnetIcon from '../../uikit/widgets/Menu/icons/BSCNetworkTestnet'
import FTMIcon from '../../uikit/widgets/Menu/icons/FTMNetwork'

// FIXME replace this
const getTokenLogoURL = (address: string) => `https://tokens.hyperjump.app/images/${address}.png`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`
const networkIcon: Record<Network, any> = {
  [Network.BSC]: BSCIcon,
  [Network.BSC_TESTNET]: BSCTestnetIcon,
  [Network.FANTOM]: FTMIcon
}

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
  lpUrl?: string
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)
  const { config } = getNetwork()
  const allTokens = useAllTokens()
  const searchTokenIconName = filterTokens(Object.values(allTokens), config.networkToken?.symbol.toLowerCase())

  const defaultTokenIcon = config.networkToken?.symbol.toLowerCase() === 'bnb' ? '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' : config.networkToken?.symbol.toLowerCase() === 'ftm' ? '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83' : 'token'
  const netWorkTokenIconImg = searchTokenIconName[0]?.address === undefined ? defaultTokenIcon : searchTokenIconName[0]?.address
  const Icon = networkIcon[config.network]
  const srcs: string[] = useMemo(() => {
    if (currency === config.baseCurrency) return []
    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [
          ...uriLocations,
          `/images/tokens/${currency?.address ?? 'token'}.png`,
          getTokenLogoURL(currency.address)
        ]
      }
      return [
        `/images/tokens/${currency?.address ?? 'token'}.png`,
        getTokenLogoURL(currency.address)]
    }
    return []
  }, [config.baseCurrency, currency, uriLocations])
  
  if (currency === config.baseCurrency) {
    return (
      <Icon style={{...style, borderRadius: '24px', width: '24px', height: '24px'}} alt={`${currency?.symbol ?? 'token'} logo`}/>
    )
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}

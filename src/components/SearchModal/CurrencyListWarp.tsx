import { Currency, CurrencyAmount, currencyEquals, Token, Pair, TokenAmount } from '@hyperjump-defi/sdk'
import React, { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components'
import { Text, Image } from 'uikit'
import getNetwork from 'utils/getNetwork'
import { PairConfig } from 'config/constants/types'
import Logo from 'components/Logo'
import { OtherSwapConfig } from 'components/SwapSelectionModal'
import { useActiveWeb3React } from '../../hooks'
import { useSelectedTokenList, WrappedTokenInfo } from '../../state/lists/hooks'
import { useAddUserToken, useRemoveUserAddedToken } from '../../state/user/hooks'
import useHttpLocations from '../../hooks/useHttpLocations'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { LinkStyledButton } from '../Shared'
import { useCurrency, useIsUserAddedToken, useToken } from '../../hooks/Tokens'
import Column from '../Column'
import { RowFixed } from '../Row'
import CurrencyLogo from '../CurrencyLogo'
import { MouseoverTooltip } from '../Tooltip'
import { FadedSpan, MenuItem } from './styleds'
import Loader from '../Loader'
import { isAddress, isTokenOnList } from '../../utils'


export interface LPToken {
    liquidityToken: Token
    balance: TokenAmount
    tokens: [Token, Token]
}

interface CurrencyListWarpProps {
    height: number
    lps: LPToken[]
    onLPSelect: (lp: LPToken) => void
    otherCurrency?: Currency | null
    fixedListRef?: MutableRefObject<FixedSizeList | undefined>
    showETH: boolean
    warp?: boolean
    selectedLP?: LPToken
    selectedSwap: OtherSwapConfig
}

function pairKey(pair: Pair): string {
  const { config } = getNetwork()
  return pair
    ? pair.liquidityToken.address
    : pair.liquidityToken === config.baseCurrency
    ? config.networkToken.symbol
    : ''
}

const getTokenLogoURL = (address: string) => `https://gateway.pinata.cloud/ipfs/QmcUD9JjFmyTch3WkQprY48QNoseTCYkCu9XRtm5F4zUuY/images/${address}.png`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

const Tag = styled.div`
  background-color: ${({ theme }) => theme.colors.tertiary};
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`
const Container = styled.div`
  display: flex;
  align-items: center;
  width: 80px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 150px;
  }
`

const LogoContainer = styled.div<{ size: string }>`
  position: relative;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

function Balance({ balance }: { balance: CurrencyAmount }) {
  return <StyledBalanceText title={balance.toExact()}>{balance.toSignificant(4)}</StyledBalanceText>
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />
  }

  const { tags } = currency
  if (!tags || tags.length === 0) return <span />

  const tag = tags[0]

  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id}>{tag.name}</Tag>
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join('; \n')}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  )
}

function CurrencyRow({
  lp,
  onSelect,
  isSelected,
  otherSelected,
  style
}: {
  lp: LPToken
  onSelect: () => void
  isSelected?: boolean
  otherSelected?: boolean
  style: CSSProperties
}) {
  const { account } = useActiveWeb3React()
  const { config } = getNetwork()
  const token0 = lp.tokens[0]
  const token1 = lp.tokens[1]
  const pairCurrency = useCurrency(lp.liquidityToken.address)
  const key = lp.liquidityToken.address
  const { balance } = lp
  const uriLocations0 = useHttpLocations(token0 instanceof WrappedTokenInfo ? token0.logoURI : undefined)
  const uriLocations1 = useHttpLocations(token1 instanceof WrappedTokenInfo ? token1.logoURI : undefined)
  const srcs0 = useMemo(() => {
    if (token0 === config.baseCurrency) return []
    if (token0 instanceof Token) {
      if (token0 instanceof WrappedTokenInfo) {
        return [
          ...uriLocations0,
          `/images/tokens/${token0.symbol.toLowerCase() === 'wbnb' ? 'bnb' : token0.symbol.toLowerCase() === 'wftm' ? 'ftm' : 'token'}.png`,
          `/images/tokens/${token0?.address ?? 'token'}.png`,
          getTokenLogoURL(token0?.address)
        ]
      }

      return [
        `/images/tokens/${token0.symbol.toLowerCase() === 'wbnb' ? 'bnb' : token0.symbol.toLowerCase() === 'wftm' ? 'ftm' : 'token'}.png`,
        `/images/tokens/${token0?.address ?? 'token'}.png`,
        getTokenLogoURL(token0?.address)
      ]
    }
    return []
  }, [token0, uriLocations0, config])

  const srcs1 = useMemo(() => {
    if (token1 === config.baseCurrency) return []
    if (token1 instanceof Token) {
      if (token1 instanceof WrappedTokenInfo) {
        return [
          ...uriLocations1,
          `/images/tokens/${token1.symbol.toLowerCase() === 'wbnb' ? 'bnb' : token1.symbol.toLowerCase() === 'wftm' ? 'ftm' : 'token'}.png`,
          `/images/tokens/${token1?.address ?? 'token'}.png`,
          getTokenLogoURL(token1?.address)
        ]
      }

      return [
        `/images/tokens/${token1.symbol.toLowerCase() === 'wbnb' ? 'bnb' : token1.symbol.toLowerCase() === 'wftm' ? 'ftm' : 'token'}.png`,
        `/images/tokens/${token1?.address ?? 'token'}.png`,
        getTokenLogoURL(token1?.address)
      ]
    }
    return []
  }, [token1, uriLocations1, config])

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      style={style}
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
      key={key}
    >
      <LogoContainer size="40px">
        <StyledLogo
          size="40px"
          srcs={srcs0}
          alt={`${token0?.symbol ?? 'token'} logo`}
          style={{ position: 'absolute', borderRadius: '20px' }}
        />
        <StyledLogo
          size="20px"
          srcs={srcs1}
          alt={`${token1?.symbol ?? 'token'} logo`}
          style={{ position: 'absolute', bottom: 0, right: 0, borderRadius: '10px' }}
        />
      </LogoContainer>

      <Column>
        <Text title={`${token0.name} - ${token1.name}`}>{lp?.liquidityToken?.symbol}</Text>
      </Column>
      <TokenTags currency={pairCurrency} />
      <RowFixed style={{ justifySelf: 'flex-end' }}>
        {balance ? <Balance balance={balance} /> : account ? <Loader /> : null}
      </RowFixed>
    </MenuItem>
  )
}

export default function CurrencyListWarp({
  height,
  lps,
  onLPSelect,
  otherCurrency,
  fixedListRef,
  showETH,
  warp,
  selectedLP
}: CurrencyListWarpProps) {
  const { config } = getNetwork()

  const itemData = useMemo(
    () => (warp ? lps : showETH ? [config.baseCurrency, ...lps] : [...lps]),
    [config.baseCurrency, lps, showETH, warp],
  )

  const Row = useCallback(
    ({ data, index, style }) => {
      const lp: LPToken = data[index]
      const isSelected = Boolean(selectedLP && lp.liquidityToken.address === selectedLP.liquidityToken.address)
      const handleSelect = () => onLPSelect(lp)
      return (
        <CurrencyRow key={index} style={style} lp={lp} isSelected={isSelected} onSelect={handleSelect} />
      )
    },
    [selectedLP, onLPSelect]
  )

  const itemKey = useCallback((index: number, data: any) => pairKey(data[index]), [])
  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}

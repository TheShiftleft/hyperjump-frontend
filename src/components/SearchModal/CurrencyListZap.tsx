import { Currency, CurrencyAmount, currencyEquals, Token } from '@hyperjump-defi/sdk'
import React, { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components'
import { Text, Image } from 'uikit'
import getNetwork from 'utils/getNetwork'
import { PairConfig } from 'config/constants/types'
import { useActiveWeb3React } from '../../hooks'
import { useSelectedTokenList, WrappedTokenInfo } from '../../state/lists/hooks'
import { useAddUserToken, useRemoveUserAddedToken } from '../../state/user/hooks'
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

function currencyKey(currency: Currency): string {
  const { config } = getNetwork()
  return currency instanceof Token ? currency.address : currency === config.baseCurrency ? config.networkToken.symbol : ''
}

const IconImage = styled(Image)`
  width: 30px;
  height: 30px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
    height: 40px;
  }
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
  pair,
  onSelect,
  isSelected,
  otherSelected,
  style,
  zap
}: {
  pair: PairConfig
  onSelect: () => void
  isSelected?: boolean
  otherSelected?: boolean
  style: CSSProperties
  zap: boolean
}) {
  const { account, chainId } = useActiveWeb3React()
  const currency = {...pair, ...useCurrency(pair?.lpAddresses[chainId])}
  const image = currency.lpSymbol.split('-')
  const primaryImg = image[0].toLowerCase()
  const secondaryImg = image[1].toLowerCase()
  const key = currencyKey(currency)
  const selectedTokenList = useSelectedTokenList()
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency)
  const customAdded = useIsUserAddedToken(currency)
  const balance = useCurrencyBalance(account ?? undefined, currency)

  const removeToken = useRemoveUserAddedToken()
  const addToken = useAddUserToken()

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      style={style}
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <>
        <IconImage src={`/images/tokens/${primaryImg}.png`} alt="icon" width={40} height={40} mr="8px" />
        <div style={{ position: 'absolute', margin: '0 0 -22px 20px', borderRadius: '10px' }}>
            <IconImage src={`/images/tokens/${secondaryImg}.png`} alt="icon" width={20} height={20} mr="8px" />
        </div>
      </>
      <Column>
        <Text title={currency?.name}>{currency?.lpSymbol}</Text>
        <FadedSpan>
          {!isOnSelectedList && customAdded && !(currency instanceof WrappedTokenInfo) ? (
            <Text>
              Added by user
              <LinkStyledButton
                onClick={(event) => {
                  event.stopPropagation()
                  if (chainId && currency instanceof Token) removeToken(chainId, currency?.address)
                }}
              >
                (Remove)
              </LinkStyledButton>
            </Text>
          ) : null}
          {!isOnSelectedList && !customAdded && !(currency instanceof WrappedTokenInfo) ? (
            <Text>
              Found by address
              <LinkStyledButton
                onClick={(event) => {
                  event.stopPropagation()
                  if (currency instanceof Token) addToken(currency)
                }}
              >
                (Add)
              </LinkStyledButton>
            </Text>
          ) : null}
        </FadedSpan>
      </Column>
      <TokenTags currency={currency} />
      <RowFixed style={{ justifySelf: 'flex-end' }}>
        {balance ? <Balance balance={balance} /> : account ? <Loader /> : null}
      </RowFixed>
    </MenuItem>
  )
}

export default function CurrencyListZap({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH,
  zap
}: {
  height: number
  currencies: PairConfig[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency | PairConfig) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH: boolean
  zap?: boolean
}) {
  const { config } = getNetwork()

  // const itemData = useMemo(() => (showETH ? [config.baseCurrency, ...currencies] : [...currencies]), [config.baseCurrency, currencies, showETH])
  const itemData = useMemo(() => (zap ? currencies : showETH ? [config.baseCurrency, ...currencies] : [...currencies]), [config.baseCurrency, currencies, showETH, zap])

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: PairConfig = data[index]
    //   const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
    //   const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency))
      const handleSelect = () => onCurrencySelect(currency)
      return (
        <CurrencyRow
          style={style}
          pair={currency}
        //   isSelected={isSelected}
          onSelect={handleSelect}
        //   otherSelected={otherSelected}
          zap={zap}
        />
      )
    },
    [onCurrencySelect, zap]
  )

  const itemKey = useCallback((index: number, data: any) => currencyKey(data[index]), [])

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

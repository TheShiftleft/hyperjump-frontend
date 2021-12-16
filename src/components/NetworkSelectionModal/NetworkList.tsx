import { Currency, CurrencyAmount, currencyEquals, Token } from '@hyperjump-defi/sdk'
import React, { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components'
import { Text } from 'uikit'
import getNetwork from 'utils/getNetwork'
import bridgeNetworks from 'config/constants/bridgeNetworks'
import { useActiveWeb3React } from '../../hooks'
import { useSelectedTokenList, WrappedTokenInfo } from '../../state/lists/hooks'
import { useAddUserToken, useRemoveUserAddedToken } from '../../state/user/hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { LinkStyledButton } from '../Shared'
import { useIsUserAddedToken } from '../../hooks/Tokens'
import Column from '../Column'
import { RowFixed } from '../Row'
import NetworkLogo from '../NetworkLogo'
import { MouseoverTooltip } from '../Tooltip'
import { FadedSpan, MenuItem } from './styleds'
import Loader from '../Loader'
import { isTokenOnList } from '../../utils'
import { BridgeNetwork } from './types'

function currencyKey(currency: Currency): string {
  const { config } = getNetwork()
  return currency instanceof Token ? currency.address : currency === config.baseCurrency ? config.networkToken.symbol : ''
}

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

function NetworkRow({
  network,
  onSelect,
  isSelected,
  style,
}: {
  network: BridgeNetwork
  onSelect: () => void
  isSelected: boolean
  style: CSSProperties
}) {
  const { account, chainId } = useActiveWeb3React()
  const selectedTokenList = useSelectedTokenList()
  const isOnSelectedList = false

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      style={style}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
    >
      <NetworkLogo bridgeNetwork={network} size="24px" />
      <Column>
        <Text title={network.name}>{network.name}</Text>
      </Column>
    </MenuItem>
  )
}

export default function NetworkList({
  height,
  availableBridgeNetwork,
  selectedNetwork,
  onNetworkSelect,
  otherCurrency,
  fixedListRef,
  showETH,
}: {
  height: number
  availableBridgeNetwork: any
  selectedNetwork?: BridgeNetwork | null
  onNetworkSelect: (bridgeNetwork: BridgeNetwork) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH: boolean
}) {
  const { config } = getNetwork()
  const bN: any = bridgeNetworks;
  const itemData = useMemo(() => bN, [ bN])
  const Row = useCallback(
    ({ data, index, style }) => {
      const network = data[index]
      const isSelected = Boolean(selectedNetwork && networkEquals(selectedNetwork, network))
      const handleSelect = () => onNetworkSelect(network)
      return (
        <NetworkRow
          style={style}
          network={network}
          isSelected={isSelected}
          onSelect={handleSelect}
        />
      )
    },
    [onNetworkSelect, selectedNetwork]
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

function networkEquals(selectedNetwork: BridgeNetwork, network: BridgeNetwork){
  return (selectedNetwork.chainId === network.chainId) ;
}

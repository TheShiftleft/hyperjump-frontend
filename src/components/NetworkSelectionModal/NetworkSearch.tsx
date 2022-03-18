import { Currency, Token } from '@hyperjump-defi/sdk'
import React, { KeyboardEvent, RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Text, CloseIcon } from 'uikit'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { FixedSizeList } from 'react-window'
import styled, { ThemeContext } from 'styled-components'
import AutoSizer from 'react-virtualized-auto-sizer'
import useI18n from 'hooks/useI18n'
import getNetwork from 'utils/getNetwork'
import bridgeNetworks from 'config/constants/bridgeNetworks'
import { useActiveWeb3React } from '../../hooks'
import { AppState } from '../../state'
import { useAllTokens, useToken } from '../../hooks/Tokens'
import { useSelectedListInfo } from '../../state/lists/hooks'
import { LinkStyledButton } from '../Shared'
import { isAddress } from '../../utils'
import Card from '../Card'
import ListLogo from '../ListLogo'
import QuestionHelper from '../QuestionHelper'
import Row, { RowBetween } from '../Row'
import CommonBases from './CommonBases'
import NetworkList from './NetworkList'
import { filterTokens } from './filtering'
import SortButton from './SortButton'
import { useTokenComparator } from './sorting'
import { PaddedColumn, SearchInput, Separator } from './styleds'
import { BridgeNetwork } from './types'

interface NetworkSearchProps {
  isOpen: boolean
  onDismiss: () => void
  isOrigin: boolean
  selectedNetwork?: BridgeNetwork | null
  onNetworkSelect: (bridgeNetwork: BridgeNetwork) => void
  onChangeList: () => void
}

const ColumnWBorder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #05193c;
  border-radius: ${({ theme }) => theme.radii.card};
`

export function NetworkSearch({
  selectedNetwork,
  onNetworkSelect,
  isOrigin,
  onDismiss,
  isOpen,
  onChangeList,
}: NetworkSearchProps) {
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const { config } = getNetwork()

  const fixedList = useRef<FixedSizeList>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [invertSearchOrder, setInvertSearchOrder] = useState<boolean>(false)
  const allTokens = useAllTokens()

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery)
  const searchToken = useToken(searchQuery)

  const showETH: boolean = useMemo(() => {
    const s = searchQuery.toLowerCase().trim()
    return config.networkToken.symbol.toLowerCase().startsWith(s)
  }, [config.networkToken.symbol, searchQuery])

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const audioPlay = useSelector<AppState, AppState['user']['audioPlay']>((state) => state.user.audioPlay)

  const availableBridge: any = bridgeNetworks;
  const availableBridgeNetwork = useMemo(() => {
    return availableBridge;
  }, [availableBridge])

  const filteredTokens: Token[] = useMemo(() => {
    if (isAddressSearch) return searchToken ? [searchToken] : []

    return filterTokens(Object.values(allTokens), searchQuery)
  }, [isAddressSearch, searchToken, allTokens, searchQuery])

  const filteredSortedTokens: Token[] = useMemo(() => {
    if (searchToken) return [searchToken]
    const sorted = filteredTokens.sort(tokenComparator)
    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)
    if (symbolMatch.length > 1) return sorted

    return [
      ...(searchToken ? [searchToken] : []),
      // sort any exact symbol matches first
      ...sorted.filter((token) => token.symbol?.toLowerCase() === symbolMatch[0]),
      ...sorted.filter((token) => token.symbol?.toLowerCase() !== symbolMatch[0]),
    ]
  }, [filteredTokens, searchQuery, searchToken, tokenComparator])

  const handleNetworkSelect = useCallback(
    (bridgeNetwork: BridgeNetwork) => {
      onNetworkSelect(bridgeNetwork)
      onDismiss()
      if (audioPlay) {
        const audio = document.getElementById('bgMusic') as HTMLAudioElement
        if (audio) {
          audio.play()
        }
      }
    },
    [onDismiss, onNetworkSelect, audioPlay],
  )


  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const selectedListInfo = useSelectedListInfo()
  const TranslateString = useI18n()
  return (
    <ColumnWBorder style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn gap="14px">
        <RowBetween>
          <Text>
            {(isOrigin ? 'From' : 'To') +TranslateString(82, ' Chain')}
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
      </PaddedColumn>

      <div style={{ flex: '1', padding: 20 }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <NetworkList
              height={height}
              showETH={showETH}
              isOrigin={isOrigin}
              availableBridgeNetwork={availableBridgeNetwork}
              onNetworkSelect={handleNetworkSelect}
              selectedNetwork={selectedNetwork}
              fixedListRef={fixedList}
            />
          )}
        </AutoSizer>
      </div>

      {null && (
        <>
          <Separator />
          <Card>
            <RowBetween>
              {selectedListInfo.current ? (
                <Row>
                  {selectedListInfo.current.logoURI ? (
                    <ListLogo
                      style={{ marginRight: 12 }}
                      logoURI={selectedListInfo.current.logoURI}
                      alt={`${selectedListInfo.current.name} list logo`}
                    />
                  ) : null}
                  <Text id="currency-search-selected-list-name">{selectedListInfo.current.name}</Text>
                </Row>
              ) : null}
              <LinkStyledButton
                style={{ fontWeight: 500, color: theme.colors.textSubtle, fontSize: 16 }}
                onClick={onChangeList}
                id="currency-search-change-list-button"
              >
                {selectedListInfo.current ? TranslateString(180, 'Change') : TranslateString(1152, 'Select a list')}
              </LinkStyledButton>
            </RowBetween>
          </Card>
        </>
      )}
    </ColumnWBorder>
  )
}

export default NetworkSearch

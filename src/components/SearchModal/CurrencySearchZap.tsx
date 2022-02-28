import { Currency, Token, Pair } from '@hyperjump-defi/sdk'
import React, { KeyboardEvent, RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Text, CloseIcon } from 'uikit'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { FixedSizeList } from 'react-window'
import styled, { ThemeContext } from 'styled-components'
import AutoSizer from 'react-virtualized-auto-sizer'
import useI18n from 'hooks/useI18n'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { usePair, usePairs } from 'data/Reserves'
import getNetwork from 'utils/getNetwork'
import { getWarpTokens, getZapTokens } from 'utils/addressHelpers'
import zapPairs from 'config/constants/zap'
import { usePairContract, useTokenContract } from 'hooks/useContract'
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
import CurrencyListZap from './CurrencyListZap'
import { filterPairs } from './filteringPairs'
import SortButton from './SortButton'
import { useTokenComparator } from './sorting'
import { usePairComparator } from './sortingPairs'
import { PaddedColumn, SearchInput, Separator } from './styleds'

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedPair?: Pair | null
  onPairSelect: (pair: Pair) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  onChangeList: () => void
  zap?: boolean
  warp?: boolean
}

const ColumnWBorder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #05193c;
  border-radius: ${({ theme }) => theme.radii.card};
`

export default function CurrencySearchZap({
  selectedPair,
  onPairSelect,
  otherSelectedCurrency,
  showCommonBases,
  onDismiss,
  isOpen,
  onChangeList,
  zap,
  warp
}: CurrencySearchProps) {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const { config } = getNetwork()

  const fixedList = useRef<FixedSizeList>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [invertSearchOrder, setInvertSearchOrder] = useState<boolean>(false)
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const pairs = zapPairs[config.network]

  const allPairs = useMemo(() => {
    return tokenPairsWithLiquidityTokens.map(pair => pair).filter(v2Pair => {
      return pairs.find((pair) => {
        return pair.lpAddresses[chainId].toLowerCase() === v2Pair.liquidityToken.address.toLowerCase()
      })
    }) 
  }, [tokenPairsWithLiquidityTokens, pairs, chainId])

  const allv2Pairs = usePairs(allPairs.map(({ tokens }) => tokens))
  const allV2PairsWithLiquidity = useMemo(() => { return allv2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))},[allv2Pairs]) 

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery)
  const searchToken = useToken(searchQuery)
  const showETH: boolean = useMemo(() => {
    const s = searchQuery.toLowerCase().trim()
    return config.networkToken.symbol.toLowerCase().startsWith(s)
  }, [config.networkToken.symbol, searchQuery])

  const pairComparator = usePairComparator(invertSearchOrder)
  const audioPlay = useSelector<AppState, AppState['user']['audioPlay']>((state) => state.user.audioPlay)

  const filteredPairs = useMemo(() => {
    return filterPairs(Object.values(allV2PairsWithLiquidity), searchQuery)
  }, [allV2PairsWithLiquidity, searchQuery])

  
  
  const filteredSortedTokens = useMemo(() => {
    const sorted = filteredPairs.sort(pairComparator)
    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)
    if (symbolMatch.length > 1) return sorted

    return [
      // sort any exact symbol matches first
      ...sorted.filter((pair) => pair?.token0?.symbol?.toLowerCase() === symbolMatch[0]),
      ...sorted.filter((pair) => pair?.token0?.symbol?.toLowerCase() !== symbolMatch[0]),
    ]
  }, [filteredPairs, searchQuery, pairComparator])

  const handlePairSelect = useCallback(
    (pair: Pair) => {
      onPairSelect(pair)
      onDismiss()
      if (audioPlay) {
        const audio = document.getElementById('bgMusic') as HTMLAudioElement
        if (audio) {
          audio.play()
        }
      }
    },
    [onDismiss, onPairSelect, audioPlay],
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

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
       if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].token1.symbol?.toLowerCase() === searchQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handlePairSelect(filteredSortedTokens[0])
          }
        }
      }
    },
    [filteredSortedTokens, handlePairSelect, searchQuery],
  )

  const selectedListInfo = useSelectedListInfo()
  const TranslateString = useI18n()
  return (
    <ColumnWBorder style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn gap="14px">
        <RowBetween>
          <Text>
            {TranslateString(82, 'Select a token')}
            <QuestionHelper
              text={TranslateString(
                128,
                'Find a token by searching for its name or symbol or by pasting its address below.',
              )}
            />
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <SearchInput
          type="text"
          id="token-search-input"
          placeholder={t('type token name here to search')}
          value={searchQuery}
          ref={inputRef as RefObject<HTMLInputElement>}
          onChange={handleInput}
          onKeyDown={handleEnter}
        />
        <RowBetween>
          <Text fontSize="18px">{TranslateString(126, 'Token name')}</Text>
          <SortButton ascending={invertSearchOrder} toggleSortOrder={() => setInvertSearchOrder((iso) => !iso)} />
        </RowBetween>
      </PaddedColumn>

      <div style={{ flex: '1' }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <CurrencyListZap
              height={height}
              showETH={showETH && !zap}
              pairs={filteredSortedTokens}
              onPairSelect={handlePairSelect}
              otherCurrency={otherSelectedCurrency}
              selectedPair={selectedPair}
              fixedListRef={fixedList}
              zap
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


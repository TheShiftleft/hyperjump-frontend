import { Currency, Pair } from '@hyperjump-defi/sdk'
import { PairConfig } from 'config/constants/types'
import React, { useCallback, useEffect, useState } from 'react'
import { OtherSwapConfig } from 'components/SwapSelectionModal'
import useLast from '../../hooks/useLast'
import { useSelectedListUrl } from '../../state/lists/hooks'
import Modal from '../Modal'
import { CurrencySearch } from './CurrencySearch'
import CurrencySearchZap from './CurrencySearchZap'
import CurrencySearchWarp from './CurrencySearchWarp'
import { ListSelect } from './ListSelect'
import { LPToken } from './CurrencyListWarp'

interface CurrencySearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  selectedPair?: Pair | null
  onCurrencySelect: (currency: Currency) => void
  onPairSelect?: (pairToken: Pair) => void
  onLPSelect?: (lp: LPToken) => void
  otherSelectedCurrency?: Currency | null
  // eslint-disable-next-line react/no-unused-prop-types
  showCommonBases?: boolean
  zap?: boolean
  warp?: boolean
  pair?: boolean
  selectedSwap?: OtherSwapConfig | null
  selectedLP?: LPToken | null
}

export default function CurrencySearchModal({
  isOpen,
  onDismiss,
  onCurrencySelect,
  onPairSelect,
  onLPSelect,
  selectedCurrency,
  selectedPair,
  otherSelectedCurrency,
  zap,
  warp,
  pair,
  selectedSwap,
  selectedLP
}: CurrencySearchModalProps) {
  const [listView, setListView] = useState<boolean>(false)
  const lastOpen = useLast(isOpen)

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setListView(false)
    }
  }, [isOpen, lastOpen])

  const handleCurrencySelect = useCallback(
    (currency: Currency ) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  const handlePairSelect = useCallback(
    (pairToken: Pair) => {
      onPairSelect(pairToken)
      onDismiss()
    },
    [onDismiss, onPairSelect]
  )

  const handleLPSelect = useCallback(
    (lp: LPToken) => {
      onLPSelect(lp)
      onDismiss()
    },
    [onDismiss, onLPSelect]
  )

  const handleClickChangeList = useCallback(() => {
    setListView(true)
  }, [])
  const handleClickBack = useCallback(() => {
    setListView(false)
  }, [])

  const selectedListUrl = useSelectedListUrl()
  const noListSelected = !selectedListUrl

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90} minHeight={listView ? 40 : noListSelected ? 0 : 80}>
      {listView ? (
        <ListSelect onDismiss={onDismiss} onBack={handleClickBack} />
      ) : pair ? (
        <CurrencySearchZap
          isOpen={isOpen}
          onDismiss={onDismiss}
          onPairSelect={handlePairSelect}
          onChangeList={handleClickChangeList}
          selectedPair={selectedPair}
          otherSelectedCurrency={otherSelectedCurrency}
          showCommonBases={false}
          zap={zap}
        />
      ) : warp ? (
        <CurrencySearchWarp
          isOpen={isOpen}
          onDismiss={onDismiss}
          onLPSelect={handleLPSelect}
          onChangeList={handleClickChangeList}
          otherSelectedCurrency={otherSelectedCurrency}
          showCommonBases={false}
          warp={warp}
          selectedSwap={selectedSwap}
          selectedLP={selectedLP}
        />
      ) : noListSelected ? (
        <CurrencySearch
          isOpen={isOpen}
          onDismiss={onDismiss}
          onCurrencySelect={handleCurrencySelect}
          onChangeList={handleClickChangeList}
          selectedCurrency={selectedCurrency}
          otherSelectedCurrency={otherSelectedCurrency}
          showCommonBases={false}
          zap={zap}
        />
      ) : (
        <CurrencySearch
          isOpen={isOpen}
          onDismiss={onDismiss}
          onCurrencySelect={handleCurrencySelect}
          onChangeList={handleClickChangeList}
          selectedCurrency={selectedCurrency}
          otherSelectedCurrency={otherSelectedCurrency}
          showCommonBases={false}
          zap={zap}
        />
      )}
    </Modal>
  )
}

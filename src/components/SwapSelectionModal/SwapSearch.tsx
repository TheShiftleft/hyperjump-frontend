import { Currency, Token } from '@hyperjump-defi/sdk'
import React, { KeyboardEvent, RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Text, CloseIcon } from 'uikit'
import { useSelector } from 'react-redux'
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
import Row, { RowBetween } from '../Row'
import NetworkList from '../NetworkSelectionModal/NetworkList'
import { filterTokens } from '../NetworkSelectionModal/filtering'
import { useTokenComparator } from '../NetworkSelectionModal/sorting'
import { PaddedColumn, Separator } from '../NetworkSelectionModal/styleds'
import { BridgeNetwork } from '../NetworkSelectionModal/types'
import SwapList from './SwapList'
import { OtherSwapConfig } from './index'

interface NetworkSearchProps {
  isOpen: boolean
  onDismiss: () => void
  isOrigin: boolean
  selectedSwap?: OtherSwapConfig
  onSwapSelect: (swap: OtherSwapConfig) => void
}

const ColumnWBorder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #05193c;
  border-radius: ${({ theme }) => theme.radii.card};
`

export function SwapSearch({
  selectedSwap,
  onSwapSelect,
  isOrigin,
  onDismiss,
  isOpen,
}: NetworkSearchProps) {

  const handleSwapSelect = useCallback(
    (swap: OtherSwapConfig) => {
      onSwapSelect(swap)
      onDismiss()
    },
    [onDismiss, onSwapSelect],
  )
  return (
    <ColumnWBorder style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn gap="14px">
        <RowBetween>
          <Text>
            From Defi App
          </Text>
          <CloseIcon onClick={onDismiss} style={{cursor: 'pointer'}}/>
        </RowBetween>
      </PaddedColumn>
      <div style={{ flex: '1', padding: 20 }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <SwapList
              height={height}
              selectedSwap={selectedSwap}
              onSwapSelect={handleSwapSelect}
            />
          )}
        </AutoSizer>
      </div>
      
    </ColumnWBorder>
  )
}

export default SwapSearch

import React, { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components'
import { Text } from 'uikit'
import getNetwork from 'utils/getNetwork'
import useOtherSwapList from 'hooks/useOtherSwapList'
import Logo from 'components/Logo'
import Column from '../Column'
import { useActiveWeb3React } from '../../hooks'
import { RowBetween, RowFixed } from '../Row'
import { OtherSwapConfig } from './index'

const MenuItem = styled(RowBetween)`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
    background-color: ${({ theme, disabled }) => !disabled && theme.colors.invertedContrast};
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  margin-right: 10px;
`
function swapEquals(selectedSwap: OtherSwapConfig, swap: OtherSwapConfig){
    return (selectedSwap.name === swap.name) ;
  }

function SwapRow({
    swap,
    onSelect,
    isSelected,
    style,
  }: {
    swap: any
    onSelect: () => void
    isSelected?: boolean
    style: CSSProperties
  }) {
    const { account, chainId } = useActiveWeb3React()
    // const selectedTokenList = useSelectedTokenList()
    const isOnSelectedList = false
  
    // only show add or remove buttons if not on selected list
    return (
      <MenuItem
        style={style}
        onClick={() => (isSelected ? null : onSelect())}
        disabled={isSelected}
      >
        <StyledLogo
            size="40px"
            srcs={[swap?.logoUrl]}
            alt={`${swap?.name} logo`}
            style={{ borderRadius: '20px' }}
        />
        <Column>
          <Text title={swap?.name}>{swap?.name}</Text>
        </Column>
      </MenuItem>
    )
  }

export default function SwapList({
    height,
    selectedSwap,
    onSwapSelect
}: {
    height: number
    selectedSwap?: OtherSwapConfig
    onSwapSelect?: (swap: OtherSwapConfig) => void
}){
    const swapList = useOtherSwapList()
    const itemData = Object.keys(swapList)
    const Row = useCallback(
        ({ data, index, style }) => {
          const swap: OtherSwapConfig = swapList[data[index]]
          const isSelected = Boolean(selectedSwap && swapEquals(selectedSwap, swap))
          const handleSelect = () => onSwapSelect(swap)
          return (
            <SwapRow
              style={style}
              swap={swap}
              isSelected={isSelected}
              onSelect={handleSelect}
            />
          )
        },
        [swapList, selectedSwap, onSwapSelect]
      )
    
    const itemKey = useCallback((index: number, data: any) => swapList[data[index]].name , [swapList])
    return (
        <FixedSizeList
          height={height}
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
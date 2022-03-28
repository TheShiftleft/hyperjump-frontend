import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { AutoColumn } from 'components/Column'
import { ChevronDownIcon, Text } from 'uikit'
import Logo from 'components/Logo'
import { OtherSwapConfig } from 'components/SwapSelectionModal'

const Select = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 34px;
  font-size: 16px;
  font-weight: 500;
  background-color: transparent;
  color: ${({ selected, theme }) => (selected ? theme.colors.text : '#FFFFFF')};
  border-radius: 12px;
  outline: none;
  user-select: none;
  border: none;
  margin-bottom: 10px;
  padding: 0 0.5rem;
  :focus,
  :hover {
    background-color: ${({ theme }) => darken(0.05, theme.colors.input)};
  }
`
const Aligner = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: space-between;
    border: 1px solid ${(props) => props.theme.colors.primary};
    padding:10px;
    border-radius: 8px;
`
const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  margin-right: 10px;
`

const DefiSelect = ({
    selected,
    onClick
}: {
    selected?: OtherSwapConfig,
    onClick: () => void
}) => {
    const selectedDefi = selected
    return (
        <Select selected onClick={onClick}>
            <AutoColumn justify="start">
                <Aligner>
                    <StyledLogo
                        size="24px"
                        srcs={[selectedDefi?.logoUrl]}
                        alt={`${selectedDefi?.name} logo`}
                        style={{ borderRadius: '20px' }}
                    />
                    <Text id="selected-swap-name">
                        {selectedDefi?.name}
                    </Text>
                    <ChevronDownIcon />
                </Aligner>
            </AutoColumn>
        </Select>
    )
}

export default DefiSelect
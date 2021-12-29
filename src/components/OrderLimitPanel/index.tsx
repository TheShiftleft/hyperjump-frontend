import React, { useState, useCallback } from 'react'
import { CurrencyAmount, JSBI, Token, Trade } from '@hyperjump-defi/sdk'
import { Button, ChevronDownIcon, Text } from 'uikit'
import styled from 'styled-components'
import { darken } from 'polished'
import { RowBetween } from '../Row'
import { Input as NumericalInput } from '../NumericalInput'

interface OrderLimitPanelProps {
  trade?: Trade,
  limitPrice?: string,
  setLimitPrice: React.Dispatch<React.SetStateAction<any>>,
}

const InputPanel = styled.div<{ hideInput?: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  z-index: 1;
  border: 1px solid ${(props) => props.theme.colors.primary};
  background-color: rgba(13,29,54,0.6);
`

const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.colors.textSubtle)};
  }
`
const Container = styled.div`
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
`
const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`



export default function OrderLimitPanel({trade, limitPrice, setLimitPrice}:OrderLimitPanelProps){
    console.log('trade',trade?.executionPrice?.toSignificant(6))
    return(
        <InputPanel>
          <Container>
            <LabelRow>
              <Text bold>Limit Price</Text>
            </LabelRow>
            <InputRow selected >
              <NumericalInput 
                className="token-amount-input"
                value={limitPrice}
                onUserInput={(val) => {
                  setLimitPrice(val);
                }} />
            </InputRow>
          </Container>
        </InputPanel>
    )
}
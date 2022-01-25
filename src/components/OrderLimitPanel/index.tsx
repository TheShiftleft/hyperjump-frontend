import React from 'react'
import { Price } from '@hyperjump-defi/sdk'
import { Text } from 'uikit'
import styled from 'styled-components'
import { darken } from 'polished'
import { toNumber } from 'lodash'
import { Input as NumericalInput } from '../NumericalInput'

interface OrderLimitPanelProps {
  price?: Price,
  limitPrice?: string,
  showInverted?: boolean,
  setLimitPrice: React.Dispatch<React.SetStateAction<any>>,
  handleLimitInput: (limit: string) => void,
  setLimitOutput: React.Dispatch<React.SetStateAction<any>>,
  inputValue: string
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



export default function OrderLimitPanel({price, limitPrice, showInverted, setLimitPrice, handleLimitInput, setLimitOutput, inputValue}:OrderLimitPanelProps){
    const token = showInverted ? `${price?.quoteCurrency?.symbol ? `(${price?.quoteCurrency?.symbol})` : ''}` : `${price?.baseCurrency?.symbol ? `(${price?.baseCurrency?.symbol})` : ''}`
    
    return(
        <InputPanel>
          <Container>
            <LabelRow>
              <Text bold>Limit Price {token}</Text>
            </LabelRow>
            <InputRow selected >
              <NumericalInput 
                className="token-amount-input"
                value={limitPrice}
                onUserInput={(val) => {
                  setLimitPrice(val);
                  handleLimitInput(val)
                  const output = showInverted ? toNumber(val) * toNumber(inputValue) : toNumber(inputValue) / toNumber(val)
                  setLimitOutput(output === Infinity ? "0" : output.toString())
                }} />
            </InputRow>
          </Container>
        </InputPanel>
    )
}
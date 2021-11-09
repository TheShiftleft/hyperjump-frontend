import React, { useEffect, useRef } from 'react'
import { useCountUp } from 'react-countup'
import styled from 'styled-components'

interface CardValueProps {
  value: number
  decimals?: number
  addOn?: string
}

const CardValue: React.FC<CardValueProps> = ({ value, decimals, addOn }) => {
  const { countUp, update } = useCountUp({
    start: 0,
    end: value,
    duration: 1,
    separator: ',',
    decimals:
      // eslint-disable-next-line no-nested-ternary
      decimals !== undefined ? decimals : value < 0 ? 4 : value > 1e5 ? 0 : 3,
  })

  const updateValue = useRef(update)

  useEffect(() => {
    updateValue.current(value)
  }, [value, updateValue])

  return (
    <StyledDropdownText2>
      {countUp} {addOn}
    </StyledDropdownText2>
  )
}

const StyledDropdownText2 = styled.p`
  font-family: Roboto;
  font-size: 12px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
  margin: 0 0 20px;
`

export default CardValue
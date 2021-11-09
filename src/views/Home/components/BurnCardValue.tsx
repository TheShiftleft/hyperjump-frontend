import React, { useEffect, useRef } from 'react'
import { useCountUp } from 'react-countup'
import { Text } from 'uikit'

export interface CardValueProps {
  value: number
  supply: number
  decimals?: number
  fontSize?: string
  lineHeight?: string
  prefix?: string
  postfix?: string
  bold?: boolean
  color?: string
}

const CardValue: React.FC<CardValueProps> = ({
  value,
  supply,
  decimals,
  fontSize = '26px',
  lineHeight = '1',
  prefix = '',
  postfix = '',
  bold = true,
  color = 'text',
}) => {
  const { countUp, update } = useCountUp({
    start: 0,
    end: value,
    duration: 1,
    separator: ',',
    decimals:
      // eslint-disable-next-line no-nested-ternary
      decimals !== undefined ? decimals : value < 0 ? 4 : value > 1e5 ? 0 : 3,
  })

  const burnPercentage = ((value / supply) * 100).toFixed(2)

  const updateValue = useRef(update)

  useEffect(() => {
    updateValue.current(value)
  }, [value, updateValue])

  return (
    <Text bold={bold} fontSize={fontSize} style={{ lineHeight }} color={color}>
      {prefix}
      {countUp} [ {burnPercentage}% ]{postfix}
    </Text>
  )
}

export default CardValue

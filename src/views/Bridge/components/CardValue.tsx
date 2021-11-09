import React, { useEffect, useRef } from 'react'
import { useCountUp } from 'react-countup'
import { Heading, Text } from 'uikit'

export interface CardValueProps {
  value: number
  decimals?: number
  fontSize?: string
  fontFamily?: string
  lineHeight?: string
  prefix?: string
  postfix?: string
  bold?: boolean
  usdval?: number
  color?: string
}

const CardValue: React.FC<CardValueProps> = ({
  value,
  decimals,
  fontSize = '26px',
  lineHeight = '1',
  prefix = '',
  postfix = '',
  bold = true,
  usdval = 0,
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

  const updateValue = useRef(update)

  useEffect(() => {
    updateValue.current(value)
  }, [value, updateValue])

  return (
    <>
      <Text bold={bold} fontSize={fontSize} style={{ lineHeight }} color={color}>
        {prefix}
        <span style={{ whiteSpace: 'nowrap' }}>
          {countUp} {postfix}
        </span>
        {usdval > 0 ? (
          <Heading bold={bold} fontSize="12px" lineHeight="1.1" textAlign="right" color="textSubtle">
            ~$ {usdval.toFixed(0)}
          </Heading>
        ) : null}
      </Text>
    </>
  )
}

export default CardValue

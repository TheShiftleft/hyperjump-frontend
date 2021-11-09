import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flex, FlexProps, Heading } from 'uikit'
import { random } from 'lodash'
import uniqueId from 'lodash/uniqueId'
import { parseRetreivedNumber } from '../../helpers'

const NumberContainer = styled(Flex)`
  margin: 0 auto;
  background-image: url('images/lottery/border.png');
  background-size: 200px auto;
  background-position: center center;
  background-repeat: no-repeat;
  width: 200px;
  height: auto;

`

const Digit = styled(Heading)`
  padding: 12px 17px;
  vertical-align: middle;
  font-size: 30px;
`

interface WinningNumbersProps extends FlexProps {
  number: string
  size?: string
  fontSize?: string
  rotateText?: boolean
}

const WinningNumbers: React.FC<WinningNumbersProps> = ({
  number,
  size = '32px',
  fontSize = '16px',
  rotateText,
  ...containerProps
}) => {
  const [rotationValues, setRotationValues] = useState([])
  const reversedNumber = parseRetreivedNumber(number)
  const numAsArray = reversedNumber.split('')

  useEffect(() => {
    if (rotateText && numAsArray && rotationValues.length === 0) {
      setRotationValues(numAsArray.map(() => random(-30, 30)))
    }
  }, [rotateText, numAsArray, rotationValues])

  return (
    <NumberContainer justifyContent="center" alignItems="center" {...containerProps}>
      {numAsArray.map((num, index) => {
        return (
          <Digit>{num}</Digit>
        )
      })}
    </NumberContainer>
  )
}

export default WinningNumbers

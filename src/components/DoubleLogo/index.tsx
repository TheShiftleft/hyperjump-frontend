import { Currency } from '@hyperjump-defi/sdk'
import React from 'react'
import styled from 'styled-components'
import CurrencyLogo from '../CurrencyLogo'

const Wrapper = styled.div<{ margin: boolean; sizeraw: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-right: ${({ sizeraw, margin }) => margin && `${(sizeraw / 3 + 8).toString()  }px`};
`

interface DoubleCurrencyLogoProps {
  margin?: boolean
  size?: number
  currency0?: Currency
  currency1?: Currency
  lpUrl?: string
}

const HigherLogo = styled(CurrencyLogo)`
  z-index: 2;
`
const CoveredLogo = styled(CurrencyLogo)<{ sizeraw: number }>`
  position: absolute;
  left: ${({ sizeraw }) => `${(sizeraw / 2).toString()  }px`};
`

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  size = 16,
  margin = false,
  lpUrl
}: DoubleCurrencyLogoProps) {
  return (
    <Wrapper sizeraw={size} margin={margin}>
      {currency0 && <HigherLogo lpUrl={lpUrl} currency={currency0} size={`${size.toString()  }px`} />}
      {currency1 && <CoveredLogo lpUrl={lpUrl} currency={currency1} size={`${size.toString()  }px`} sizeraw={size} />}
    </Wrapper>
  )
}

import React from 'react'
import { Price } from '@hyperjump-defi/sdk'
import { SyncAltIcon, Text } from 'uikit'
import { StyledBalanceMaxMini } from './styleds'

interface TradePriceProps {
  price?: Price,
  limit?: string
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
  setLimitPrice?: React.Dispatch<React.SetStateAction<any>>
  setLimitValidity?: React.Dispatch<React.SetStateAction<any>>
}

export default function TradePrice({ price, limit, showInverted, setShowInverted, setLimitPrice, setLimitValidity }: TradePriceProps) {
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const label = showInverted
    ? `${price?.quoteCurrency?.symbol} per ${price?.baseCurrency?.symbol}`
    : `${price?.baseCurrency?.symbol} per ${price?.quoteCurrency?.symbol}`

  return (
    <Text fontSize="14px" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      {show ? (
        <>
          {formattedPrice ?? '-'} {label}
          <StyledBalanceMaxMini onClick={() => {
            setShowInverted(!showInverted)
            setLimitPrice('');
            setLimitValidity({valid: true, error: ''})
            }
          }>
            <SyncAltIcon width="20px" color="primary" />
          </StyledBalanceMaxMini>
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}

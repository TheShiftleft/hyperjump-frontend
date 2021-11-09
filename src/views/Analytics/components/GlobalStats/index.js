/* eslint-disable react/jsx-pascal-case */

import React, { useState } from 'react'
import styled from 'styled-components'
import { useMedia } from 'react-use'
import { RowFixed, RowBetween } from '../../../../components/Row'
import { useGlobalData, useBnbPrice } from '../../../../contexts/Analytics/GlobalData'
import { formattedNum, localNumber } from '../../../../utils/analytics'

import UniPrice from '../UniPrice'
import { TYPE } from '..'

const Header = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
`

const Medium = styled.span`
  font-weight: 500;
`

export default function GlobalStats() {
  const below1295 = useMedia('(max-width: 1295px)')
  const below1180 = useMedia('(max-width: 1180px)')
  const below1024 = useMedia('(max-width: 1024px)')
  const below400 = useMedia('(max-width: 400px)')
  const below816 = useMedia('(max-width: 816px)')

  const [showPriceCard, setShowPriceCard] = useState(false)

  const { oneDayVolumeUSD, oneDayTxns, pairCount } = useGlobalData()
  const [bnbPrice] = useBnbPrice()
  const formattedBnbPrice = bnbPrice ? formattedNum(bnbPrice, true) : '-'
  const oneDayFees = oneDayVolumeUSD ? formattedNum(oneDayVolumeUSD * 0.004, true) : ''

  return (
    <Header>
      <RowBetween style={{ padding: below816 ? '0.5rem' : '.5rem' }}>
        <RowFixed>
          {!below400 && (
            <TYPE.main
              mr='1rem'
              onMouseEnter={() => {
                setShowPriceCard(true)
              }}
              onMouseLeave={() => {
                setShowPriceCard(false)
              }}
              style={{ position: 'relative' }}
            >
              BNB Price: <Medium>{formattedBnbPrice}</Medium>
              {showPriceCard && <UniPrice />}
            </TYPE.main>
          )}

          {!below1180 && (
            <TYPE.main mr='1rem'>
              Transactions (24H): <Medium>{localNumber(oneDayTxns)}</Medium>
            </TYPE.main>
          )}
          {!below1024 && (
            <TYPE.main mr='1rem'>
              Pairs: <Medium>{localNumber(pairCount)}</Medium>
            </TYPE.main>
          )}
          {!below1295 && (
            <TYPE.main mr='1rem'>
              Fees (24H): <Medium>{oneDayFees}</Medium>&nbsp;
            </TYPE.main>
          )}
        </RowFixed>
      </RowBetween>
    </Header>
  )
}

/* eslint-disable react/jsx-pascal-case */

import React, { useMemo } from 'react'
import styled from 'styled-components'
import Panel from '../Panel'
import { AutoColumn } from '../../../../components/Column'
import { RowFixed } from '../../../../components/Row'
import { TYPE } from '..'
import { usePairData } from '../../../../contexts/Analytics/PairData'
import { formattedNum } from '../../../../utils/analytics'

const PriceCard = styled(Panel)`
  position: absolute;
  right: -220px;
  width: 220px;
  top: -20px;
  z-index: 9999;
  height: fit-content;
  background-color: ${({ theme }) => theme.colors.bg1};
`

function formatPercent(rawPercent) {
  if (rawPercent < 0.01) {
    return '<1%'
  }
  return `${parseFloat(rawPercent * 100).toFixed(0)}%`
}

export default function UniPrice() {
  const daiPair = usePairData('0xed8ecb790be568461d85cf82c386e51124e46a52')
  const busdPair = usePairData('0xf2e4e3f9b58b3edac88ad11d689a23f3119a782d')
  const usdtPair = usePairData('0x0d29724d1834fc65869812bae5d63dce8acb7921')

  const totalLiquidity = useMemo(() => {
    return daiPair && busdPair && usdtPair
      ? daiPair.trackedReserveUSD + busdPair.trackedReserveUSD + usdtPair.trackedReserveUSD
      : 0
  }, [daiPair, busdPair, usdtPair])

  const daiPerBnb = daiPair ? parseFloat(daiPair.token0Price).toFixed(2) : '-'
  const busdPerBnb = busdPair ? parseFloat(busdPair.token1Price).toFixed(2) : '-'
  const usdtPerBnb = usdtPair ? parseFloat(usdtPair.token0Price).toFixed(2) : '-'

  return (
    <PriceCard>
      <AutoColumn gap="10px">
        <RowFixed>
          <TYPE.main>DAI/BNB: {formattedNum(daiPerBnb, true)}</TYPE.main>
          <TYPE.light style={{ marginLeft: '10px' }}>
            {daiPair && totalLiquidity ? formatPercent(daiPair.trackedReserveUSD / totalLiquidity) : '-'}
          </TYPE.light>
        </RowFixed>
        <RowFixed>
          <TYPE.main>BUSD/BNB: {formattedNum(busdPerBnb, true)}</TYPE.main>
          <TYPE.light style={{ marginLeft: '10px' }}>
            {busdPair && totalLiquidity ? formatPercent(busdPair.trackedReserveUSD / totalLiquidity) : '-'}
          </TYPE.light>
        </RowFixed>
        <RowFixed>
          <TYPE.main>USDT/BNB: {formattedNum(usdtPerBnb, true)}</TYPE.main>
          <TYPE.light style={{ marginLeft: '10px' }}>
            {usdtPair && totalLiquidity ? formatPercent(usdtPair.trackedReserveUSD / totalLiquidity) : '-'}
          </TYPE.light>
        </RowFixed>
      </AutoColumn>
    </PriceCard>
  )
}

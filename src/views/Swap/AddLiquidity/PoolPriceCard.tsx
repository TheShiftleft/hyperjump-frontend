import React from 'react'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import { Currency, Percent, Price } from '@hyperjump-defi/sdk'
import { Text } from 'uikit'
import { AutoColumn } from '../../../components/Column'
import { AutoRow } from '../../../components/Row'
import { ONE_BIPS } from '../../../config'
import { Field } from '../../../state/mint/actions'

const PoolCard = styled.div`
  margin-top: 20px;
  background-color: rgba(2, 5, 11, 0.7);
  border-radius: 25px;
  padding: 16px 0 5px 0;
  width: 92%;
  max-width: 300px;
`

const TextLabel = styled(Text)`
  font-size: 12px;
`

export function PoolPriceCard({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}) {
  const TranslateString = useI18n()

  return (
    <PoolCard>
      <AutoColumn gap="md">
        <AutoRow justify="space-around">
          <AutoColumn justify="center">
            <Text fontSize="16px">
              {noLiquidity
                ? TranslateString(1164, 'Initial prices and pool share')
                : TranslateString(1166, 'Prices and pool share')}
            </Text>
          </AutoColumn>
        </AutoRow>

        <AutoRow justify="space-around">
          <AutoColumn justify="center">
            <Text>{price?.toSignificant(6) ?? '-'}</Text>
            <TextLabel>
              {currencies[Field.CURRENCY_B]?.symbol} per {currencies[Field.CURRENCY_A]?.symbol}
            </TextLabel>
          </AutoColumn>
          <AutoColumn justify="center">
            <Text>{price?.invert()?.toSignificant(6) ?? '-'}</Text>
            <TextLabel>
              {currencies[Field.CURRENCY_A]?.symbol} per {currencies[Field.CURRENCY_B]?.symbol}
            </TextLabel>
          </AutoColumn>
        </AutoRow>

        <AutoRow justify="space-around">
          <AutoColumn justify="center">
            <Text>
              {noLiquidity && price
                ? '100'
                : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
              %
            </Text>
            <TextLabel>Share of Pool</TextLabel>
          </AutoColumn>
        </AutoRow>
      </AutoColumn>
    </PoolCard>
  )
}

export default PoolPriceCard

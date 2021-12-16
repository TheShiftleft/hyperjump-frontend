import React from 'react'
import { Text } from 'uikit'
import { ChainId, Currency, currencyEquals, Token } from '@hyperjump-defi/sdk'
import styled from 'styled-components'

import useI18n from 'hooks/useI18n'
import getNetwork from 'utils/getNetwork'
import { SUGGESTED_BASES } from '../../config'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow } from '../Row'
import CurrencyLogo from '../CurrencyLogo'

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid ${({ theme, disable }) => (disable ? 'transparent' : theme.colors.tertiary)};
  border-radius: 10px;
  display: flex;
  padding: 6px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background-color: ${({ theme, disable }) => !disable && theme.colors.invertedContrast};
  }

  background-color: ${({ theme, disable }) => disable && theme.colors.tertiary};
  opacity: ${({ disable }) => disable && '0.4'};
`

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
}: {
  chainId?: ChainId
  selectedCurrency?: Currency | null
  onSelect: (currency: Currency) => void
}) {
  const { config } = getNetwork()
  const TranslateString = useI18n()
  return (
    <AutoColumn gap="md">
      <AutoRow>
        <Text fontSize="14px">Common bases</Text>
        <QuestionHelper text={TranslateString(1204, 'These tokens are commonly paired with other tokens.')} />
      </AutoRow>
      <AutoRow gap="4px">
        <BaseWrapper
          onClick={() => {
            if (!selectedCurrency || !currencyEquals(selectedCurrency, config.baseCurrency)) {
              onSelect(config.baseCurrency)
            }
          }}
          disable={selectedCurrency === config.baseCurrency}
        >
          <CurrencyLogo currency={config.baseCurrency} style={{ marginRight: 8 }} />
          <Text>{config.networkToken.symbol}</Text>
        </BaseWrapper>
        {(chainId ? SUGGESTED_BASES[chainId] : []).map((token: Token) => {
          const selected = selectedCurrency instanceof Token && selectedCurrency.address === token.address
          return (
            <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected} key={token.address}>
              <CurrencyLogo currency={token} style={{ marginRight: 8 }} />
              <Text>{token.symbol}</Text>
            </BaseWrapper>
          )
        })}
      </AutoRow>
    </AutoColumn>
  )
}

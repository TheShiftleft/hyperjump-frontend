import React from 'react'
import { Trade, TradeType } from '@hyperjump-defi/sdk'
import { Card, CardBody, Text } from 'uikit'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import getNetwork from 'utils/getNetwork'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { SectionBreak } from './styleds'
import SwapRoute from './SwapRoute'

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)
  const TranslateString = useI18n()
  const { config } = getNetwork()

  const NewCard = styled(Card)`
    border: 2px solid #44c4e2;
    background-color: rgba(13, 29, 54, 0.5);
  `

  return (
    <NewCard>
      <CardBody>
        <RowBetween>
          <RowFixed>
            <Text color="primary" fontSize="14px">
              {isExactIn ? TranslateString(1210, 'Minimum received') : TranslateString(220, 'Maximum sold')}
            </Text>
            <QuestionHelper
              text={TranslateString(
                202,
                'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.',
              )}
            />
          </RowFixed>
          <RowFixed>
            <Text fontSize="14px">
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                  '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ??
                  '-'}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text color="primary" fontSize="14px">
              {TranslateString(226, 'Price Impact')}
            </Text>
            <QuestionHelper
              text={TranslateString(
                224,
                'The difference between the market price and estimated price due to trade size.',
              )}
            />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <Text color="primary" fontSize="14px">
              {TranslateString(228, 'Liquidity Provider Fee')}
            </Text>
            <QuestionHelper text={`For each trade there is a 0.4% fee. 0.3% goes directly to liquidity providers and 0.1% is used to buy-back and burn ${config.farmingToken.symbol}.`} />
          </RowFixed>
          <Text fontSize="14px">
            {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
          </Text>
        </RowBetween>
      </CardBody>
    </NewCard>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageTolerance()
  const TranslateString = useI18n()
  const showRoute = Boolean(trade && trade.route.path.length > 2)

  return (
    <AutoColumn gap="md">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <SectionBreak />
              <AutoColumn style={{ padding: '0 24px' }}>
                <RowFixed>
                  <Text fontSize="14px">Route</Text>
                  <QuestionHelper
                    text={TranslateString(
                      999,
                      'Routing through these tokens resulted in the best price for your trade.',
                    )}
                  />
                </RowFixed>
                <SwapRoute trade={trade} />
              </AutoColumn>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}

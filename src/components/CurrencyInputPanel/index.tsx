import React, { useState, useCallback } from 'react'
import { Currency, Pair, Token } from '@hyperjump-defi/sdk'
import { Button, ChevronDownIcon, Text } from 'uikit'
import styled from 'styled-components'
import { darken } from 'polished'
import useI18n from 'hooks/useI18n'
import { OtherSwapConfig } from 'components/SwapSelectionModal'
import { FarmConfig } from 'config/constants/types'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween } from '../Row'
import { LPToken } from '../SearchModal/CurrencyListWarp'
import { Input as NumericalInput } from '../NumericalInput'
import { useActiveWeb3React } from '../../hooks'

const InputRow = styled.div<{ selected: boolean, hideInput?: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  ${({hideInput}) => hideInput ? 'justify-content: right': ''};
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`
const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 34px;
  font-size: 16px;
  font-weight: 500;
  background-color: transparent;
  color: ${({ selected, theme }) => (selected ? theme.colors.text : '#FFFFFF')};
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;
  :focus,
  :hover {
    background-color: ${({ theme }) => darken(0.05, theme.colors.input)};
  }
`
const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.colors.textSubtle)};
  }
`
const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const InputPanel = styled.div<{ hideInput?: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  z-index: 1;
  border: 1px solid ${(props) => props.theme.colors.primary};
  background-color: rgba(13,29,54,0.6);
`
const Container = styled.div<{ hideInput: boolean }>`
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
`
interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  onPairSelect?: (pair: Pair) => void
  onLPSelect?: (lp: LPToken) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  farm?: FarmConfig | null
  lp?: LPToken | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  disabledNumericalInput?: boolean
  zap?: boolean
  warp?: boolean
  pairToken?: boolean
  hideLabel?: boolean
  lpUrl?: string,
  selectedSwap?: OtherSwapConfig | null
}
export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label,
  onCurrencySelect,
  onPairSelect,
  onLPSelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  farm = null, // used for Pairs logo and
  lp = null, // used for LPs of other swap/defi
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  disabledNumericalInput = false,
  zap,
  warp,
  pairToken,
  hideLabel,
  selectedSwap
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { account, chainId } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const TranslateString = useI18n()
  const translatedLabel = label || TranslateString(132, 'Input')
  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])
  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        {!hideLabel && (
          <LabelRow>
            <RowBetween>
              <Text fontSize="14px">{translatedLabel}</Text>
              {account && (
                <Text onClick={onMax} fontSize="14px" style={{ display: 'inline', cursor: 'pointer' }}>
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? `Balance: ${selectedCurrencyBalance?.toSignificant(6)}`
                    : ' -'}
                </Text>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow style={hideInput ? { borderRadius: '8px' } : {}} selected={disableCurrencySelect} hideInput>
          {!hideInput && (
            <>
              <NumericalInput
                disabled={disabledNumericalInput}
                className="token-amount-input"
                value={value}
                onUserInput={(val) => {
                  onUserInput(val)
                }}
              />
              {account && currency && showMaxButton && label !== 'Destination' && (
                <Button onClick={onMax} scale="sm" variant="text">
                  MAX
                </Button>
              )}
            </>
          )}
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <Aligner>
              {pair || lp? (
                <DoubleCurrencyLogo 
                  lpUrl={selectedSwap?.imageUrl} 
                  currency0={pair ? new Token(chainId, farm.token?.address[chainId], farm.token?.decimals, farm.token?.symbol, farm.token?.symbol) : lp?.tokens[0]} 
                  currency1={pair ? new Token(chainId, farm.quoteToken?.address[chainId], farm.quoteToken?.decimals, farm.quoteToken?.symbol, farm.quoteToken?.symbol) : lp?.tokens[1]} 
                  size={24} 
                  margin 
                />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
              ) : null}
              {pair ? (
                <Text id="pair">
                  {farm.lpSymbol}
                </Text>
              ) : lp ? (
                <Text id="lp">
                  {lp?.tokens[0]?.symbol.toLowerCase() === 'wbnb' ? 'BNB' : lp?.tokens[0]?.symbol.toLowerCase() === 'wftm' ? 'FTM' : lp?.tokens[0]?.symbol}:
                  {lp?.tokens[1]?.symbol.toLowerCase() === 'wbnb' ? 'BNB' : lp?.tokens[1]?.symbol.toLowerCase() === 'wftm' ? 'FTM' : lp?.tokens[1]?.symbol}
                </Text>
              ) : (
                <Text id="pair">
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                      currency.symbol.length - 5,
                      currency.symbol.length
                    )}`
                    : currency?.symbol) || TranslateString(1196, 'Select a token')}
                </Text>
              )}
              {!disableCurrencySelect && <ChevronDownIcon />}
            </Aligner>
          </CurrencySelect>
        </InputRow>
      </Container>
      {!disableCurrencySelect && (onCurrencySelect || onPairSelect || onLPSelect) && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          onPairSelect={onPairSelect}
          onLPSelect={onLPSelect}
          selectedCurrency={currency}
          selectedPair={pair}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
          zap={zap}
          warp={warp}
          pair={pairToken}
          selectedSwap={selectedSwap}
          selectedLP={lp}
        />
      )}
    </InputPanel>
  )
}

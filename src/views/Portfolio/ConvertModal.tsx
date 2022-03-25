import React, { useCallback, useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import getNetwork from 'utils/getNetwork'
import { ApprovalState } from 'hooks/useApproveCallback'
import { Currency, CurrencyAmount, JSBI, Token, Trade } from '@hyperjump-defi/sdk'
import { TokenProps } from 'hooks/moralis'
import { Modal, Button, Box, Text, Flex, Image } from 'uikit'
import { getRouterAddress } from 'utils/addressHelpers'
import { BroomCallbackState, useBroomSweep } from 'hooks/useBroom'
// import { useBroomContract } from 'hooks/useContract'
import { Field } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { WrappedTokenInfo } from 'state/lists/hooks'
import TradePrice from 'components/swap/TradePrice'
import { useCurrency } from 'hooks/Tokens'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'

interface ConvertModalProps {
  onDismiss?: () => void
  selectedtoken?: TokenProps
  amounts?: number[]
  selectTokens: ConvertTokenProps
}

interface ConvertTokenProps {
  token: TokenProps
  isSelected: boolean
  approval: number
  approvalCallback?: () => Promise<void>
}

const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  color: white;
`

const CellInner = styled.div`
  padding: 12px 0px;
  display: flex;
  align-items: center;
  padding-right: 8px;
  width: 60px;
  white-space: nowrap;
`

const Label = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: left;
`

const IconImage = styled(Image)`
  width: 30px;
  height: 30px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
    height: 40px;
  }
`

const ContentContainer = styled.div`
  min-height: 24px;
  display: flex;
  align-items: center;
`

const TokenContainer = styled.div`
  height: 500px;
  overflow-y: auto;
`

const ButtonBox = styled(Flex)`
  margin-top: 20px;
  align-items: center;
  justify-content: center;

  & > button {
    width: 40%;
    margin: 0 10%;
  }
`
interface CellLayoutProps {
  label?: string
}

const CellLayout: React.FC<CellLayoutProps> = ({ label = '', children }) => {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <ContentContainer>{children}</ContentContainer>
    </div>
  )
}

const ConvertModal: React.FC<ConvertModalProps> = ({ onDismiss, selectedtoken, selectTokens, amounts }) => {
  const { t } = useTranslation()
  const { config } = getNetwork()
  const { account } = useActiveWeb3React()
  const [step, setStep] = useState(1)

  const onSelectTokens = () => {
    setStep(1)
  }
  const [limitValidity, setLimitValidity] = useState({ valid: true, error: '' })
  const [limitPrice, setLimitPrice] = useState('')
  const [showInverted, setShowInverted] = useState<boolean>(false)

  const defaultFromCurrency = {
    decimals: selectTokens.token.tokenObj.decimals,
    symbol: selectTokens.token.tokenObj.symbol,
    name: selectTokens.token.tokenObj.symbol,
    chainId: selectTokens.token.tokenObj.chainId,
    address: selectTokens.token.tokenObj.address,
  }

  const defaultToCurrency = useMemo(() => {
    return {
      decimals: config.farmingToken.decimals,
      symbol: config.farmingToken.symbol,
      name: 'HyperJump',
      chainId: config.baseCurrency.symbol === 'FTM' ? 250 : 56,
      address:
        config.baseCurrency.symbol === 'FTM' ? config.farmingToken.address[250] : config.farmingToken.address[56],
    }
  }, [
    config.farmingToken.decimals,
    config.farmingToken.symbol,
    config.baseCurrency.symbol,
    config.farmingToken.address,
  ])

  const ToCurrency = new Token(
    config.baseCurrency.symbol === 'FTM' ? 250 : 56,
    config.baseCurrency.symbol === 'FTM' ? config.farmingToken.address[250] : config.farmingToken.address[56],
    config.farmingToken.decimals,
    config.farmingToken.symbol,
    'HyperJump',
  )
  const DefaultToCurrency = ToCurrency

  const { independentField, typedValue, recipient } = useSwapState()

  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const FromCurrency = selectTokens.token.tokenObj

  currencies[Field.INPUT] = FromCurrency
  currencies[Field.OUTPUT] = DefaultToCurrency

  const inputvalue = selectTokens.token.amount.toString()

  // console.log(DefaultToCurrency, selectTokens.token.tokenObj)

  // const handleInputSelect = useCallback(() => {
  //   onCurrencySelection(Field.INPUT, FromCurrency)
  // }, [onCurrencySelection, FromCurrency])

  // const handleOutputSelect = useCallback(() => {
  //   onCurrencySelection(Field.OUTPUT, DefaultToCurrency)
  // }, [onCurrencySelection, DefaultToCurrency])

  // const handleTypeInput = useCallback(() => {
  //   onUserInput(Field.INPUT, inputvalue)
  // }, [onUserInput, inputvalue])

  // useEffect(() => {
  //   handleTypeInput()
  //   handleInputSelect()
  //   handleOutputSelect()
  // }, [handleTypeInput, handleInputSelect, handleOutputSelect])

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)

  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currencies[Field.OUTPUT] ?? undefined)
  // console.log(selectedCurrencyBalance)
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const onApprove = () => {
    if ([ApprovalState.NOT_APPROVED, ApprovalState.UNKNOWN].includes(selectTokens.approval)) {
      selectTokens.approvalCallback()
    }
  }

  const [count, setCount] = useState(0)

  const { state: broomState, callback: broomCallback } = useBroomSweep(
    selectTokens.token.amount,
    selectTokens.token.tokenObj.address,
  )

  const totalestimateJump = Number(formattedAmounts[Field.INPUT]) * Number(trade?.executionPrice.toSignificant(6))
  const estimateconvcost = realizedLPFee
    ? Number(realizedLPFee.toSignificant(6)) * Number(selectedtoken.price.toFixed(2))
    : 0

  const handleBroomCallback = useCallback(() => {
    if (broomState !== BroomCallbackState.INVALID) {
      broomCallback()
        .then((result) => {
          console.log('result', result)
        })
        .catch((e) => {
          console.error(e)
        })
    }
  }, [broomCallback, broomState])

  return (
    <Modal title={t('Convert small balances')} onDismiss={onDismiss}>
      {step === 1 && (
        <>
          <Text fontSize="18px" marginBottom="30px">
            To convert small balances, you will need to sign <br /> wallet transaction.
          </Text>

          <Box>
            <StyledRow>
              <CellInner>
                <Text> {selectTokens.approval !== ApprovalState.APPROVED ? 'Approve ETH' : 'Approved ETH'}</Text>
              </CellInner>

              <CellLayout
                label={new Intl.NumberFormat('en-US', { minimumFractionDigits: 6 }).format(selectedtoken.amount)}
              >
                ≈{' '}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(selectedtoken.volume)}
              </CellLayout>
            </StyledRow>

            <StyledRow>
              <CellInner>
                <Text>Estimated conversion cost</Text>
              </CellInner>
              <CellLayout
                label={realizedLPFee ? `${realizedLPFee.toSignificant(6)} ${trade.inputAmount.currency.symbol}` : '-'}
              >
                ≈{' '}
                {realizedLPFee
                  ? new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 10,
                    }).format(estimateconvcost)
                  : 0}
              </CellLayout>
            </StyledRow>
            <TradePrice
              price={trade?.executionPrice}
              limit={limitPrice}
              showInverted={showInverted}
              setShowInverted={setShowInverted}
              setLimitPrice={setLimitPrice}
              setLimitValidity={setLimitValidity}
            />
          </Box>

          <Box>
            <Text fontSize="18px" marginTop="30px">
              Summary
            </Text>

            <StyledRow>
              <CellInner>
                <Text>You will get approximately</Text>
              </CellInner>

              <CellLayout
                label={
                  selectedCurrencyBalance
                    ? `${selectedCurrencyBalance.toSignificant(6)}${selectedCurrencyBalance.currency.symbol}`
                    : '-'
                }
              >
                ≈ {new Intl.NumberFormat('en-US').format(totalestimateJump)}
              </CellLayout>
            </StyledRow>

            <StyledRow>
              <CellInner>
                <IconImage src={selectedtoken.logo} alt="icon" width={40} height={40} mr="8px" />
              </CellInner>
              <CellInner>
                <CellLayout label={selectedtoken.tokenObj.name}>
                  {selectedtoken.price && selectedtoken.price.toFixed(2)}
                </CellLayout>
              </CellInner>
              <CellInner>
                <CellLayout
                  label={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                    selectedtoken.volume,
                  )}
                >
                  {new Intl.NumberFormat('en-US').format(selectedtoken.amount)}
                </CellLayout>
              </CellInner>
            </StyledRow>
          </Box>

          <ButtonBox>
            {selectTokens.approval !== ApprovalState.APPROVED ? (
              <Button onClick={onApprove}>{t('Approve')}</Button>
            ) : (
              <Button
                onClick={() => {
                  handleBroomCallback()
                }}
              >
                {t('Convert')}
              </Button>
            )}
          </ButtonBox>
        </>
      )}
    </Modal>
  )
}

export default ConvertModal

import { CurrencyAmount, JSBI, Token, Trade } from '@hyperjump-defi/sdk'
import React, { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ArrowDown } from 'react-feather'
import { CardBody, ArrowDownIcon, Button, IconButton, Text, useModal, Link, Flex } from 'uikit'
import styled, { ThemeContext } from 'styled-components'
import AddressInputPanel from 'components/AddressInputPanel'
import Card, { GreyCard } from 'components/Card'
import { AutoColumn, ColumnCenter } from 'components/Column'
import ConfirmSwapModal from 'components/swap/ConfirmSwapModal'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import CardNav from 'components/CardNav'
import SwapNav from 'components/SwapNav'
import { AutoRow, RowBetween } from 'components/Row'
import AdvancedSwapDetailsDropdown from 'components/swap/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from 'components/swap/confirmPriceImpactWithoutFee'
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from 'components/swap/styleds'
import TradePrice from 'components/swap/TradePrice'
import TokenWarningModal from 'components/TokenWarningModal'
import ProgressSteps from 'components/ProgressSteps'
import Container from 'components/Container'

import { INITIAL_ALLOWED_SLIPPAGE } from 'config/index'
import { useActiveWeb3React } from 'hooks'
import { useCurrency } from 'hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import { useSwapCallback } from 'hooks/useSwapCallback'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { Field } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import { useExpertModeManager, useUserDeadline, useUserSlippageTolerance } from 'state/user/hooks'
import { LinkStyledButton } from 'components/Shared'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from 'utils/prices'
import Loader from 'components/Loader'
import useI18n from 'hooks/useI18n'
import PageHeaderSwap from 'components/PageHeaderSwap'
import ZapSlider from 'components/ZapSlider'
import ConnectWalletButton from 'components/ConnectWalletButton'
import V2ExchangeRedirectModal from 'components/V2ExchangeRedirectModal'
import { useGovTokenBurnRate } from 'hooks/useTokenBalance'
import { getGovTokenAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import EarnAlloy from 'views/Swap/EarnCards/EarnAlloy'
import EarnLP from 'views/Swap/EarnCards/EarnLP'
import ZapSVG from 'components/SwapNav/Icons/Zap'
import AppBody from '../AppBody'

const StyledLink = styled(Link)`
  display: inline;
  color: ${({ theme }) => theme.colors.failure};
`

const PlusButton = styled(IconButton)`
  background-color: transparent;
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: -12px;
  margin-bottom: -12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 0;
    margin-bottom: 0;
  }
`

const PlusContainer = styled(ColumnCenter)`
  margin -16px 0;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
  }
`

const ButtonIcon = styled.img`
  height: 100px;
  z-index: 5;
`

const MainButtonContainer = styled(RowBetween)`
  padding: 0 10px;
`

const MainButton = styled(Button)`
  border-radius: 50px;
  text-transform: uppercase;
  font-size: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  height: auto;
`

const Swap = () => {
  const loadedUrlParams = useDefaultsFromURLSearch()
  const TranslateString = useI18n()
  const [modalCountdownSecondsRemaining, setModalCountdownSecondsRemaining] = useState(5)
  const [disableSwap, setDisableSwap] = useState(false)
  const [hasPoppedModal, setHasPoppedModal] = useState(false)
  const [interruptRedirectCountdown, setInterruptRedirectCountdown] = useState(false)
  const [onPresentV2ExchangeRedirectModal] = useModal(
    <V2ExchangeRedirectModal handleCloseModal={() => setInterruptRedirectCountdown(true)} />,
  )
  const onPresentV2ExchangeRedirectModalRef = useRef(onPresentV2ExchangeRedirectModal)
  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(true)
  const [transactionWarning, setTransactionWarning] = useState<{
    selectedToken: string | null
    purchaseType: string | null
  }>({
    selectedToken: null,
    purchaseType: null,
  })
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  const handleConfirmWarning = () => {
    setTransactionWarning({
      selectedToken: null,
      purchaseType: null,
    })
  }

  const { account } = useWeb3React()
  const theme = useContext(ThemeContext)

  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [deadline] = useUserDeadline()
  const [allowedSlippage, setSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  // HYPR burn
  const hyprBurnRate = useGovTokenBurnRate(getGovTokenAddress())

  // Manage disabled trading pairs that should redirect users to V2
  useEffect(() => {
    const disabledSwaps = [
      // 'BNB',
      // 'BUSD',
      // 'USDT',
      // 'USDC',
      // 'ALLOY',
      // 'BUNNY',
      // 'ETH',
      // 'BTCB',
      // 'AUTO',
      // 'XVS',
      // 'SAFEMOON',
      // 'DAI',
      // 'ADA',
      // 'DOT',
      // 'ElonGate',
      // 'TWT',
      // 'ALPACA',
    ]
    const inputCurrencySymbol = currencies[Field.INPUT]?.symbol || ''
    const outputCurrencySymbol = currencies[Field.OUTPUT]?.symbol || ''
    const doesInputMatch = disabledSwaps.includes(inputCurrencySymbol)
    const doesOutputMatch = disabledSwaps.includes(outputCurrencySymbol)

    if (doesInputMatch && doesOutputMatch) {
      // Prevent infinite re-render of modal with this condition
      if (!hasPoppedModal) {
        setHasPoppedModal(true)
        onPresentV2ExchangeRedirectModalRef.current()
      }

      // Controls the swap buttons being disabled & renders a message
      setDisableSwap(true)

      const tick = () => {
        setModalCountdownSecondsRemaining((prevSeconds) => prevSeconds - 1)
      }
      const timerInterval = setInterval(() => tick(), 1000)

      if (interruptRedirectCountdown) {
        // Reset timer if countdown is interrupted
        clearInterval(timerInterval)
        setModalCountdownSecondsRemaining(5)
      }

      if (modalCountdownSecondsRemaining <= 0) {
        window.location.href = 'https://swap.hyperjump.app/'
      }

      return () => {
        clearInterval(timerInterval)
      }
    }

    // Unset disableSwap state if the swap inputs & outputs dont match disabledSwaps
    setDisableSwap(false)
    return undefined
  }, [
    currencies,
    hasPoppedModal,
    modalCountdownSecondsRemaining,
    onPresentV2ExchangeRedirectModalRef,
    interruptRedirectCountdown,
  ])

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0)),
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    deadline,
    recipient,
  )

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState((prevState) => ({ ...prevState, attemptingTxn: true, swapErrorMessage: undefined, txHash: undefined }))
    swapCallback()
      .then((hash) => {
        setSwapState((prevState) => ({
          ...prevState,
          attemptingTxn: false,
          swapErrorMessage: undefined,
          txHash: hash,
        }))
      })
      .catch((error) => {
        setSwapState((prevState) => ({
          ...prevState,
          attemptingTxn: false,
          swapErrorMessage: error.message,
          txHash: undefined,
        }))
      })
  }, [priceImpactWithoutFee, swapCallback, setSwapState])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, showConfirm: false }))

    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [onUserInput, txHash, setSwapState])

  const handleAcceptChanges = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, tradeToConfirm: trade }))
  }, [trade])

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setHasPoppedModal(false)
      setInterruptRedirectCountdown(false)
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      setHasPoppedModal(false)
      setInterruptRedirectCountdown(false)
      onCurrencySelection(Field.OUTPUT, outputCurrency)
    },
    [onCurrencySelection],
  )

  return (
    <Container>
      <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />
      <SwapNav activeIndex={4} />
      <AppBody>
        <Wrapper id="swap-page" color="transparent">
          <ConfirmSwapModal
            isOpen={showConfirm}
            trade={trade}
            originalTrade={tradeToConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={handleSwap}
            swapErrorMessage={swapErrorMessage}
            onDismiss={handleConfirmDismiss}
          />
          <PageHeaderSwap
            title={TranslateString(8, 'Exchange')}
            description={TranslateString(1192, 'Trade tokens in an instant')}
          />
          <CardBody p="12px">
            <AutoColumn gap="md">
              <CurrencyInputPanel
                label={
                  independentField === Field.OUTPUT && !showWrap && trade
                    ? TranslateString(194, 'From (estimated)')
                    : TranslateString(76, 'From')
                }
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={!atMaxAmountInput}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                id="swap-currency-input"
              />
              <AutoColumn justify="space-between">
                <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                  <ArrowWrapper clickable>
                    <PlusContainer>
                      <ZapSVG height="50px" width="50px" />
                    </PlusContainer>
                  </ArrowWrapper>
                  {recipient === null && !showWrap && isExpertMode ? (
                    <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                      + Add a send (optional)
                    </LinkStyledButton>
                  ) : null}
                </AutoRow>
              </AutoColumn>
              <CurrencyInputPanel
                value={formattedAmounts[Field.OUTPUT]}
                onUserInput={handleTypeOutput}
                label={
                  independentField === Field.INPUT && !showWrap && trade
                    ? TranslateString(196, 'To (estimated)')
                    : TranslateString(80, 'To')
                }
                showMaxButton={false}
                currency={currencies[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                otherCurrency={currencies[Field.INPUT]}
                id="swap-currency-output"
              />

              {recipient !== null && !showWrap ? (
                <>
                  <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                    <ArrowWrapper clickable={false}>
                      <ArrowDown size="16" color={theme.colors.textSubtle} />
                    </ArrowWrapper>
                    <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                      - Remove send
                    </LinkStyledButton>
                  </AutoRow>
                  <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                </>
              ) : null}

              {showWrap ? null : (
                <Card padding=".25rem .75rem 0 .75rem" borderRadius="20px">
                  <AutoColumn gap="4px">
                    {Boolean(trade) && (
                      <RowBetween align="center">
                        <Text fontSize="14px">{TranslateString(1182, 'Price')}</Text>
                        <TradePrice
                          price={trade?.executionPrice}
                          showInverted={showInverted}
                          setShowInverted={setShowInverted}
                        />
                      </RowBetween>
                    )}
                    {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                      <RowBetween align="center">
                        <Text fontSize="14px">{TranslateString(88, 'Slippage Tolerance')}</Text>
                        <Text fontSize="14px">{allowedSlippage / 100}%</Text>
                      </RowBetween>
                    )}
                    {currencies[Field.INPUT]?.symbol === 'HYPR' && (
                      <RowBetween align="center">
                        {setSlippage(4969)}
                        <Text fontSize="12px">HYPR Burn Rate</Text>
                        <Text fontSize="12px">{getBalanceNumber(hyprBurnRate)}%</Text>
                      </RowBetween>
                    )}
                  </AutoColumn>
                </Card>
              )}
            </AutoColumn>
            <BottomGrouping>{!account ? <ConnectWalletButton width="100%" /> : <ZapSlider />}</BottomGrouping>
          </CardBody>
        </Wrapper>
      </AppBody>
      <AutoColumn>
        <Flex justifyContent="space-between" mt="20px">
          <EarnAlloy />
          <EarnLP />
        </Flex>
      </AutoColumn>
      <AdvancedSwapDetailsDropdown trade={trade} />
    </Container>
  )
}

export default Swap

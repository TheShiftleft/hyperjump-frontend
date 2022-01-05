import { CurrencyAmount, JSBI, Token, Trade } from '@hyperjump-defi/sdk'
import React, { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ArrowDown } from 'react-feather'
import { CardBody, ArrowDownIcon, Button, IconButton, Text, useModal } from 'uikit'
import { ThemeContext } from 'styled-components'
import AddressInputPanel from 'components/AddressInputPanel'
import Card, { GreyCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import ConfirmSwapModal from 'components/swap/ConfirmSwapModal'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import OrderLimitPanel from 'components/OrderLimitPanel'
import CardNav from 'components/CardNav'
import { AutoRow, RowBetween } from 'components/Row'
import AdvancedSwapDetailsDropdown from 'components/swap/AdvancedSwapDetailsDropdown'
import OrderList from 'components/swap/OrderList'
import OrderLimit from 'utils/orderlimit'
import confirmPriceImpactWithoutFee from 'components/swap/confirmPriceImpactWithoutFee'
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from 'components/swap/styleds'
import TradePrice from 'components/swap/TradePrice'
import TokenWarningModal from 'components/TokenWarningModal'
import ProgressSteps from 'components/ProgressSteps'
import Container from 'components/Container'
import { toNumber, round } from 'lodash'

import { BASE_EXCHANGE_URL, INITIAL_ALLOWED_SLIPPAGE } from 'config/index'
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
import ConnectWalletButton from 'components/ConnectWalletButton'
import V2ExchangeRedirectModal from 'components/V2ExchangeRedirectModal'
import { getBalanceNumber } from 'utils/formatBalance'
import useGovTokenBurnRate from 'hooks/useGovTokenBurnRate'
import getNetwork from 'utils/getNetwork'
import AppBody from '../AppBody'

const Swap = () => {
  const { config } = getNetwork()
  const loadedUrlParams = useDefaultsFromURLSearch()
  const TranslateString = useI18n()
  const [modalCountdownSecondsRemaining, setModalCountdownSecondsRemaining] = useState(5)
  const [disableSwap, setDisableSwap] = useState(false)
  const [hasPoppedModal, setHasPoppedModal] = useState(false)
  const [interruptRedirectCountdown, setInterruptRedirectCountdown] = useState(false)
  const [marketSelect, setMarketSelected] = useState(true)
  const [limitValidity, setLimitValidity] = useState({valid: true, error: ""})
  const [limitPrice, setLimitPrice] = useState("")
  const [limitOutput, setLimitOutput] = useState("")
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
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

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

  // gov token burn
  const govTokenBurnRate = useGovTokenBurnRate()

  // Manage disabled trading pairs that should redirect users to V2
  useEffect(() => {
    const disabledSwaps = []
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
        window.location.href = BASE_EXCHANGE_URL
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

  const defaultFromCurrency = {
    decimals: config.baseCurrency.decimals,
    symbol: config.baseCurrency.symbol,
    name: config.baseCurrency.symbol,
  }

  const defaultToCurrency = {
    decimals: config.farmingToken.decimals,
    symbol: config.farmingToken.symbol,
    name: "HyperJump",
    chainId: config.baseCurrency.symbol === 'FTM' ? 250 : 56,
    address: config.baseCurrency.symbol === 'FTM' ? config.farmingToken.address[250] : config.farmingToken.address[250]
  }

  const handleLimitInput = (limit: string) => {
    const limitValue = toNumber(limit);
    const quotePrice = toNumber(trade?.executionPrice?.toSignificant())
    const basePrice = toNumber(trade?.executionPrice?.invert()?.toSignificant())
    setLimitValidity({
      valid: true,
      error: ``
    })
    if(quotePrice && basePrice && limitValue){
      if(showInverted) {
        if(limitValue < quotePrice){
          const percentage = round(((quotePrice - limitValue) / quotePrice) * 100, 2 )
          setLimitValidity({
            valid: false,
            error: `Entered limit rate ${percentage}% below market`
          })
        }
      }else if(basePrice < limitValue){
          const percentage = round(((limitValue - basePrice) / ((limitValue + basePrice) / 2)) * 100, 2);
          setLimitValidity({
            valid: false,
            error: `Entered limit rate ${percentage}% above market`
          })
      }
    }
  }

  const slippageIsTooLow = currencies[Field.INPUT]?.symbol === config.govToken.symbol
    && (allowedSlippage / 100) < getBalanceNumber(govTokenBurnRate)

  const orderListRequest = {
    account: '0xe9F7B6F81883F321EFb8beed766e873C4E01EC4b',
    chainId: 137,
    includeCancelled: false,
    includeExecuted: false
  }
  
  if(account){
    // console.log('orderListRequest', orderListRequest)
    OrderLimit.listOrders(orderListRequest).then((response) => {
      console.log('orderList', response)
    })
  }
  const placeLimitOrder = async () => {
    const orderRequest = {
        chainId: config.id,
        account,
        sellToken: trade?.route.path[0].address,
        sellAmount: formattedAmounts[Field.INPUT],
        buyToken: trade?.route.path[1].address,
        buyAmount: limitOutput
    }
    // console.log('orderRequest', orderRequest)
    const order = await OrderLimit.placeOrder(orderRequest);
    // console.log('order',order)
  }

  return (
    <Container>
      <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />
      <CardNav />
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
            type="Swap"
            marketSelect={marketSelect}
            setMarketSelected={(val) => {
              setMarketSelected(val)
            }}
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
                currency={currencies[Field.INPUT] == null ? defaultFromCurrency : currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT] == null ? defaultToCurrency : currencies[Field.OUTPUT]}
                id="swap-currency-input"
              />
              <AutoColumn justify="space-between">
                <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                  <ArrowWrapper clickable>
                    <IconButton
                      variant="tertiary"
                      onClick={() => {
                        setApprovalSubmitted(false) // reset 2 step UI for approvals
                        onSwitchTokens()
                      }}
                      style={{ borderRadius: '50%' }}
                      scale="sm"
                    >
                      <ArrowDownIcon color="primary" width="24px" />
                    </IconButton>
                  </ArrowWrapper>
                  {recipient === null && !showWrap && isExpertMode ? (
                    <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                      + Add a send (optional)
                    </LinkStyledButton>
                  ) : null}
                </AutoRow>
              </AutoColumn>
              <CurrencyInputPanel
                value={toNumber(limitOutput) === 0 ? formattedAmounts[Field.OUTPUT] : limitOutput}
                onUserInput={handleTypeOutput}
                label={
                  independentField === Field.INPUT && !showWrap && trade
                    ? TranslateString(196, 'To (estimated)')
                    : TranslateString(80, 'To')
                }
                showMaxButton={false}
                currency={currencies[Field.OUTPUT] == null ? defaultToCurrency : currencies[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                otherCurrency={currencies[Field.INPUT] == null ? defaultFromCurrency : currencies[Field.INPUT]}
                id="swap-currency-output"
                disabledNumericalInput={!marketSelect}
              />
              {!marketSelect &&
                <OrderLimitPanel 
                  price={trade?.executionPrice}
                  limitPrice={limitPrice} 
                  setLimitPrice={setLimitPrice}
                  showInverted={showInverted}
                  handleLimitInput={handleLimitInput}
                  setLimitOutput={setLimitOutput}
                  inputValue={formattedAmounts[Field.INPUT]}
                />
              }
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
                          limit={limitPrice}
                          showInverted={showInverted}
                          setShowInverted={setShowInverted}
                          setLimitPrice={setLimitPrice}
                          setLimitValidity={setLimitValidity}
                        />
                      </RowBetween>
                    )}
                    {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                      <RowBetween align="center">
                        <Text fontSize="14px">{TranslateString(88, 'Slippage Tolerance')}</Text>
                        <Text fontSize="14px">{allowedSlippage / 100}%</Text>
                      </RowBetween>
                    )}
                    {currencies[Field.INPUT]?.symbol === config.govToken.symbol && (
                      <RowBetween align="center">
                        <Text fontSize="12px">{`NOTE Slippage must exceed ${config.govToken.symbol} burn rate: `}</Text>
                        <Text fontSize="12px">{getBalanceNumber(govTokenBurnRate)}%</Text>
                      </RowBetween>
                    )}
                  </AutoColumn>
                </Card>
              )}
            </AutoColumn>
            <BottomGrouping>
              {!account ? (
                <ConnectWalletButton width="100%" />
              ) : showWrap ? (
                <Button disabled={Boolean(wrapInputError)} onClick={onWrap} width="100%">
                  {wrapInputError ??
                    (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                </Button>
              ) : noRoute && userHasSpecifiedInputOutput ? (
                <GreyCard style={{ textAlign: 'center' }}>
                  <Text mb="4px">{TranslateString(1194, 'Insufficient liquidity for this trade.')}</Text>
                </GreyCard>
              ) : showApproveFlow ? (
                <RowBetween>
                  <Button
                    onClick={approveCallback}
                    disabled={disableSwap || approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                    style={{ width: '48%' }}
                    variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                  >
                    {approval === ApprovalState.PENDING ? (
                      <AutoRow gap="6px" justify="center">
                        Approving <Loader stroke="white" />
                      </AutoRow>
                    ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                      'Approved'
                    ) : (
                      `Approve ${currencies[Field.INPUT]?.symbol}`
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      if (isExpertMode) {
                        handleSwap()
                      } else {
                        setSwapState({
                          tradeToConfirm: trade,
                          attemptingTxn: false,
                          swapErrorMessage: undefined,
                          showConfirm: true,
                          txHash: undefined,
                        })
                      }
                    }}
                    style={{ width: '48%' }}
                    id="swap-button"
                    disabled={
                      disableSwap ||
                      !isValid ||
                      approval !== ApprovalState.APPROVED ||
                      slippageIsTooLow ||
                      (priceImpactSeverity > 3 && !isExpertMode)
                    }
                    variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
                  >
                    {priceImpactSeverity > 3 && !isExpertMode
                      ? `Price Impact High`
                      : slippageIsTooLow
                      ? 'Increase slippage'
                      : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                  </Button>
                </RowBetween>
              ) : marketSelect ? (
                <Button
                  onClick={() => {
                    if (isExpertMode) {
                      handleSwap()
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined,
                      })
                    }
                  }}
                  id="swap-button"
                  disabled={
                    disableSwap || slippageIsTooLow || !isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError
                  }
                  variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
                  width="100%"
                >
                  {swapInputError ||
                    (priceImpactSeverity > 3 && !isExpertMode
                      ? `Price Impact Too High`
                      : slippageIsTooLow
                      ? 'Increase Slippage'
                      : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`)}
                </Button>
              ): limitValidity.valid ? (
                <Button 
                  width="100%" 
                  disabled={(toNumber(limitPrice) === 0)} 
                  variant={!limitPrice ? 'danger' : 'primary'}
                  onClick={() => {
                    placeLimitOrder()
                  }}
                >
                  {toNumber(limitPrice) === 0 ? 'Enter a valid limit price' : 'Place Order'}
                </Button>
              ): (
                <GreyCard style={{ textAlign: 'center' }}>
                  <Text mb="4px">{TranslateString(1194, `${limitValidity.error}`)}</Text>
                </GreyCard>
              )}
              {showApproveFlow && <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />}
              {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
            </BottomGrouping>
          </CardBody>
        </Wrapper>
      </AppBody>
      <AdvancedSwapDetailsDropdown trade={trade} />
      <OrderList show={Boolean(account) && !marketSelect} />
    </Container>
  )
}

export default Swap

import { Currency, CurrencyAmount, JSBI, Token, Trade } from '@hyperjump-defi/sdk'
import React, { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ArrowDown } from 'react-feather'
import { CardBody, ArrowDownIcon, Button, IconButton, Text, useModal, ChevronDownIcon } from 'uikit'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
import AddressInputPanel from 'components/AddressInputPanel'
import Card, { GreyCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import ConfirmSwapModal from 'components/swap/ConfirmSwapModal'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import CardNav from 'components/CardNav'
import { AutoRow, RowBetween } from 'components/Row'
import AdvancedSwapDetailsDropdown from 'components/swap/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from 'components/swap/confirmPriceImpactWithoutFee'
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from 'components/swap/styleds'
import TradePrice from 'components/swap/TradePrice'
import TokenWarningModal from 'components/TokenWarningModal'
import ProgressSteps from 'components/ProgressSteps'
import Container from 'components/Container'
import CurrencyLogo from 'components/CurrencyLogo'

import { BASE_EXCHANGE_URL, INITIAL_ALLOWED_SLIPPAGE } from 'config/index'
import { useCurrency } from 'hooks/Tokens'
import { useFarms } from 'state/hooks'
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
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import AppBody from '../AppBody'

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
  margin-bottom: 10px;
  padding: 0 0.5rem;
  :focus,
  :hover {
    background-color: ${({ theme }) => darken(0.05, theme.colors.input)};
  }
`
const Aligner = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid ${(props) => props.theme.colors.primary};
    padding:10px;
    border-radius: 8px;

`
const Bridge = () => {
    const { config } = getNetwork()
    const { data, userDataLoaded } = useFarms()
    const loadedUrlParams = useDefaultsFromURLSearch()
    const TranslateString = useI18n()
    const [modalOpen, setModalOpen] = useState(false)
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
    const urlLoadedTokens: Token[] = useMemo(
        () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
        [loadedInputCurrency, loadedOutputCurrency],
    )
    const handleConfirmTokenWarning = useCallback(() => {
        setDismissTokenWarning(true)
    }, [])

    const handleDismissSearch = useCallback(() => {
        setModalOpen(false)
    }, [setModalOpen])

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

    const BridgeSelect = ({ currency, otherCurrency, onCurrencySelect }) => (
        <>
            <CurrencySelect
                selected={!!currency}
                className="open-currency-select-button"
                onClick={() => { setModalOpen(true) }}
            >
                <AutoColumn justify="start">
                    <Aligner>
                        {currency && (
                            <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
                        )}
                        <Text id="pair">
                            {(currency && currency.symbol && currency.symbol.length > 20
                                ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                                    currency.symbol.length - 5,
                                    currency.symbol.length
                                )}`
                                : currency?.symbol) || TranslateString(1196, 'Select a currency')}
                        </Text>

                        <ChevronDownIcon />
                    </Aligner>
                </AutoColumn>
            </CurrencySelect>
            <CurrencySearchModal
                isOpen={modalOpen}
                onDismiss={handleDismissSearch}
                onCurrencySelect={handleInputSelect}
                selectedCurrency={currency}
                otherSelectedCurrency={otherCurrency}
            />
        </>
    )

    return (
        <Container>
            <CardNav activeIndex={2} />
            <AppBody>
                <Wrapper id="swap-page" color="transparent">
                    <PageHeaderSwap
                        title={TranslateString(8, 'Vortex Bridge')}
                        description={TranslateString(1192, 'Move BCS Hyper Jump tokens to Fantom Opera Chain')}

                    />
                    <CardBody p="12px">
                        <AutoColumn gap="md">
                            <BridgeSelect
                                currency={currencies[Field.INPUT]}
                                otherCurrency={currencies[Field.OUTPUT]}
                                onCurrencySelect={handleInputSelect}
                            />
                            <CurrencyInputPanel
                                label={
                                    independentField === Field.OUTPUT && !showWrap && trade
                                        ? TranslateString(194, 'Amount (estimated)')
                                        : TranslateString(76, 'Amount')
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
                            <AutoColumn justify="start">
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
                                </AutoRow>
                                <BridgeSelect
                                    currency={currencies[Field.OUTPUT]}
                                    otherCurrency={currencies[Field.INPUT]}
                                    onCurrencySelect={handleOutputSelect}
                                />
                            </AutoColumn>
                            <CurrencyInputPanel
                                value={formattedAmounts[Field.OUTPUT]}
                                onUserInput={handleTypeOutput}
                                label={
                                    independentField === Field.INPUT && !showWrap && trade
                                        ? TranslateString(196, 'Destination (estimated)')
                                        : TranslateString(80, 'Destination')
                                }
                                showMaxButton={false}
                                currency={currencies[Field.OUTPUT]}
                                onCurrencySelect={handleOutputSelect}
                                otherCurrency={currencies[Field.INPUT]}
                                id="swap-currency-output"
                            />
                        </AutoColumn>
                        <BottomGrouping>
                            <ConnectWalletButton width="100%" label={TranslateString(80, 'Bridge to Fantom')} />
                        </BottomGrouping>
                    </CardBody>
                </Wrapper>
            </AppBody>
            <AdvancedSwapDetailsDropdown trade={trade} />
        </Container>
    )
}

export default Bridge

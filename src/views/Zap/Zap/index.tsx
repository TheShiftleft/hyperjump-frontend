import React, { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react'
import { CurrencyAmount, JSBI, Token, Trade } from '@hyperjump-defi/sdk'
import { CardBody, ArrowDownIcon, Button, IconButton, Text, useModal } from 'uikit'
import { AutoColumn } from 'components/Column'
import Container from 'components/Container'
import AppBody from 'components/Zap/AppBody'
import CardNav from 'components/Zap/CardNav'
import { usePairContract, useZapContract } from 'hooks/useContract'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import PageHeader from 'components/Zap/PageHeader'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { Wrapper } from 'components/Zap/styled'
import { useCurrency, useToken } from 'hooks/Tokens'
import { AutoRow, RowBetween } from 'components/Row'
import Loader from 'components/Loader'
import { useApproveCallbackFromZap, ApprovalState } from 'hooks/useApproveCallback'
import { useDerivedZapInfo, useZapActionHandlers, useZapDefaultState, useZapState } from 'state/zap/hooks'
import { Field } from 'state/zap/actions'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import { useAllPairData } from 'contexts/Analytics/PairData'
import { useSavedPairs } from 'contexts/Analytics/LocalStorage'
import { usePair } from 'data/Reserves'
import zapPairs from 'config/constants/zap'
import getNetwork from 'utils/getNetwork'
import { useZapInToken, useEstimateZapInToken } from 'hooks/useZap'
import useToast from 'hooks/useToast'

const Zap = () => {
  const { toastSuccess, toastError } = useToast()
  useZapDefaultState()
  const { field } = useZapState()
  const { currencyBalances, currencyInput, pairOutput, parsedAmount, pairCurrency } = useDerivedZapInfo()
  const { onUserInput, onCurrencySelect, onPairSelect } = useZapActionHandlers()
  const parsedAmounts = {
    [Field.INPUT]: field === Field.INPUT ? parsedAmount : undefined,
    [Field.OUTPUT]: field === Field.OUTPUT ? undefined : undefined,
  }
  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  const {
    callback: zapCallback,
    error: swapCallbackError,
    state: zapState,
  } = useZapInToken(
    currencyInput, // JUMP
    pairOutput, // JUMP - FTM
    parsedAmounts[Field.INPUT],
  )

  // const {estimate0, estimate1} = useEstimateZapInToken(zapState, currencyInput, pairOutput, pairCurrency, parsedAmounts[Field.INPUT])
  // console.log('estimate0', estimate0?.toExact())
  // console.log('estimate1', estimate1?.toExact())

  const handleZapCallback = useCallback(() => {
    zapCallback()
      .then((result) => {
        result.wait().then((confirmation) => {
          if (confirmation.status) {
            toastSuccess('Zapped', 'Zap transaction successful.')
          } else {
            toastError('Zap Error', 'Something went wrong during transaction.')
          }
        })
      })
      .catch((error) => {
        console.error(error)
        toastError('Zap Error', 'An error occured while processing transaction.')
      })
  }, [zapCallback, toastSuccess, toastError])

  const [approval, approveCallback] = useApproveCallbackFromZap(parsedAmounts[field])
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  const showApproval = useMemo(() => {
    return (
      approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)
    )
  }, [approval, approvalSubmitted])

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

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

  const handleOutputPairSelect = useCallback(
    (pair) => {
      onPairSelect(Field.OUTPUT, pair)
    },
    [onPairSelect],
  )

  const handleInputCurrencySelect = useCallback(
    (currency) => {
      onCurrencySelect(Field.INPUT, currency)
    },
    [onCurrencySelect],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  return (
    <Container>
      <CardNav />
      <AppBody>
        <Wrapper id="zap-page" color="transparent">
          <PageHeader title="Zap" description="Zap into our LP tokens" />
          <CardBody p="12px">
            <AutoColumn gap="md">
              <CurrencyInputPanel
                label="In"
                value={parsedAmounts[Field.INPUT]?.toSignificant(6)}
                showMaxButton={!atMaxAmountInput}
                onMax={handleMaxInput}
                currency={currencyInput}
                onCurrencySelect={handleInputCurrencySelect}
                onUserInput={handleTypeInput}
                zap
                id="zap-currency-input"
              />
              <AutoColumn justify="center">
                <IconButton variant="tertiary" style={{ borderRadius: '50%' }} scale="sm">
                  <ArrowDownIcon color="primary" width="24px" />
                </IconButton>
              </AutoColumn>
              <CurrencyInputPanel
                label="Out"
                value={parsedAmounts[Field.OUTPUT]?.toSignificant(6)}
                currency={pairCurrency}
                pair={pairOutput}
                onPairSelect={handleOutputPairSelect}
                showMaxButton={false}
                onUserInput={handleTypeOutput}
                disabledNumericalInput
                id="zap-currency-input"
                pairToken
              />
              {showApproval ? (
                <Button width="100%" disabled={false} variant="primary" onClick={approveCallback}>
                  {approval === ApprovalState.PENDING ? (
                    <AutoRow gap="6px" justify="center">
                      Approving <Loader stroke="white" />
                    </AutoRow>
                  ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                    'Approved'
                  ) : (
                    `Approve ${currencyInput?.name}`
                  )}
                </Button>
              ) : (
                <Button width="100%" disabled={false} variant="primary" onClick={() => handleZapCallback()}>
                  Zap In
                </Button>
              )}
            </AutoColumn>
          </CardBody>
        </Wrapper>
      </AppBody>
    </Container>
  )
}

export default Zap

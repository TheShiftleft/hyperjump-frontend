import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CurrencyAmount, JSBI } from '@hyperjump-defi/sdk'
import { CardBody, ArrowDownIcon, Button, IconButton, Text } from 'uikit'
import { AutoColumn } from 'components/Column'
import Container from 'components/Container'
import AppBody from 'components/Zap/AppBody'
import CardNav from 'components/Zap/CardNav'
import Card from 'components/Card'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import PageHeader from 'components/Zap/PageHeader'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { Wrapper } from 'components/Zap/styled'
import { AutoRow } from 'components/Row'
import Loader from 'components/Loader'
import { useApproveCallbackFromZap, ApprovalState } from 'hooks/useApproveCallback'
import { useDerivedZapInfo, useZapActionHandlers, useZapDefaultState, useZapState } from 'state/zap/hooks'
import { Field } from 'state/zap/actions'
import { useZapInToken, ZapCallbackState } from 'hooks/useZap'
import useToast from 'hooks/useToast'
import useI18n from 'hooks/useI18n'
import getNetwork from 'utils/getNetwork'
import CurrencyLogo from 'components/CurrencyLogo'
import { BIG_ZERO } from 'utils/bigNumber'
import { MIN_ETH } from 'config'
import useStake from 'hooks/useStake'

const Zap = () => {
  const { config } = getNetwork()
  const [isLoading, setIsLoading] = useState(false)
  const [zapToPool, setZapToPool] = useState(false)
  const { toastSuccess, toastError, toastWarning, toastInfo } = useToast()
  useZapDefaultState()
  const TranslateString = useI18n()
  const { field, typedValue } = useZapState()
  const { currencyBalances, currencyInput, pairOutput, parsedAmount, pairCurrency, estimates, liquidityMinted, estimatedLpAmount, farm } =
    useDerivedZapInfo()
  const {onStake} = useStake(farm?.pid)
  const { onUserInput, onCurrencySelect, onPairSelect } = useZapActionHandlers()
  const parsedAmounts = {
    [Field.INPUT]: parsedAmount,
    [Field.OUTPUT]: liquidityMinted,
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
    currencyBalances[Field.INPUT],
  )
  const token0 = estimates[0] ?? undefined
  const token1 = estimates[1] ?? undefined

  const handleZapCallback = useCallback(() => {
    setIsLoading(true)
    zapCallback()
      .then((zapIn) => {
        toastInfo('Zapping', 'Warp in progress')
        zapIn.wait().then((confirmation) => {
          if (confirmation.status) {
            if(zapToPool){
              if(liquidityMinted){
                toastInfo('Staking', 'Staking in progress')
                onStake(liquidityMinted.toExact()).then(() => {
                  setIsLoading(false)
                  toastSuccess('Success', 'Zap and Stake transaction successful.')
                })
                .catch((error) => {
                  console.error(error)
                  setIsLoading(false)
                  toastError('Error', 'Something went wrong during staking transaction.')
                })
              }else{
                toastError('Error', 'Something went wrong during staking transaction.')
              }
            }else{
              setIsLoading(false)
              toastSuccess('Zapped', 'Zap transaction successful.')
            }
          } else {
            setIsLoading(false)
            toastError('Zap Error', 'Something went wrong during zapping transaction.')
          }
        })
      })
      .catch((error) => {
        console.error(error)
        let msg = 'An error occured while processing transaction.'
        let title = 'Zap Error'
        if(error.code === 4001){
          title = 'Transaction Cancelled'
          msg = 'User cancelled the transaction.'
        }
        setIsLoading(false)
        toastError(title, msg)
      })
  }, [zapCallback, toastSuccess, toastError, zapToPool, onStake, toastInfo, liquidityMinted])

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
    let isMounted = true
    if (approval === ApprovalState.PENDING && isMounted) {
      setApprovalSubmitted(true)
    }
    return () => {
      isMounted = false
    }
  }, [approval, approvalSubmitted])

  const formattedAmounts = {
    [Field.INPUT]: typedValue ?? '',
    [Field.OUTPUT]: parsedAmounts[Field.OUTPUT]?.toSignificant(6) ?? '',
  }

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
      if(JSBI.lessThan(maxAmountInput?.raw, MIN_ETH)){
        toastWarning('Warning', 'Balance is below the minimum amount required!')
      }else{
        onUserInput(Field.INPUT, maxAmountInput.toExact())
      }
    }
  }, [maxAmountInput, onUserInput, toastWarning])

  return (
    <Container>
      <CardNav />
      <AppBody>
        <Wrapper id="zap-page" color="transparent">
          <PageHeader
            title="Zap"
            description="Zap into our LP tokens: Please note that there is a risk of loss if zapping into a low liquidity LP"
            zapToPool={zapToPool}
            isZap
            setZapToPool={(value: boolean) => {
              setZapToPool(value)
            }}
          />
          <CardBody p="12px">
            <AutoColumn gap="md">
              <CurrencyInputPanel
                label={TranslateString(76, 'From')}
                value={formattedAmounts[Field.INPUT]}
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
                label={liquidityMinted ? TranslateString(196, 'To (Estimated)') : TranslateString(80, 'To')}
                value={liquidityMinted ? liquidityMinted?.toSignificant(6) : '0'}
                currency={pairCurrency}
                pair={pairOutput}
                onPairSelect={handleOutputPairSelect}
                showMaxButton={false}
                onUserInput={handleTypeOutput}
                disabledNumericalInput
                id="zap-currency-input"
                pairToken
              />
              {token0 && token1 ? (
                <Card padding=".25rem .75rem 0 .75rem" borderRadius="20px">
                  <AutoColumn justify="center" gap="5px">
                    <Text fontSize="16px" color="primary" bold>
                      Estimated
                    </Text>
                    <AutoRow>
                      <CurrencyLogo
                        currency={token0.currency}
                        size="24px"
                        style={{marginRight: '10px'}}
                      />
                      <Text fontSize="14px" marginRight="10px">
                        {token0?.currency?.symbol} Deposited :
                      </Text>
                      <Text fontSize="14px">{token0?.toSignificant(6)}</Text>
                    </AutoRow>
                    <AutoRow>
                      <CurrencyLogo
                        currency={token1.currency}
                        size="24px"
                        style={{marginRight: '10px'}}
                      />
                      <Text fontSize="14px" marginRight="10px">
                        {token1?.currency?.symbol} Deposited :
                      </Text>
                      <Text fontSize="14px">{token1?.toSignificant(6)}</Text>
                    </AutoRow>
                    {estimatedLpAmount && (
                      <AutoRow>
                        <Text fontSize="14px" marginRight="10px">
                          Estimated value:
                        </Text>
                        <Text fontSize="14px">$ {estimatedLpAmount.toFixed(4)}</Text>
                      </AutoRow>
                    )}
                    
                  </AutoColumn>
                </Card>
              ) : (
                ''
              )}
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
                <Button
                  width="100%"
                  disabled={!(zapState === ZapCallbackState.VALID && isLoading === false)}
                  variant="primary"
                  onClick={() => handleZapCallback()}
                >
                  <AutoRow gap="6px" justify="center">
                  {zapToPool ? 
                    TranslateString(1212, 'Zap Into Pool') 
                  :
                    TranslateString(1211, 'Zap In')}
                  {isLoading && <Loader stroke="white" />}
                  </AutoRow>
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

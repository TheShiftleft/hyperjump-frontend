import React, { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react'
import { CurrencyAmount, Token } from '@hyperjump-defi/sdk'
import { CardBody, ArrowDownIcon, Button, IconButton, Text } from 'uikit'
import { AutoColumn } from 'components/Column'
import Container from 'components/Container'
import AppBody from 'components/Zap/AppBody'
import styled from 'styled-components'
import Logo from 'components/Logo'
import CardNav from 'components/Zap/CardNav'
import Card from 'components/Card'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import PageHeader from 'components/Zap/PageHeader'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { Wrapper } from 'components/Zap/styled'
import { AutoRow, RowBetween } from 'components/Row'
import Loader from 'components/Loader'
import { useApproveCallbackFromZap, ApprovalState } from 'hooks/useApproveCallback'
import { useDerivedZapInfo, useZapActionHandlers, useZapDefaultState, useZapState } from 'state/zap/hooks'
import { Field } from 'state/zap/actions'
import {useZapInToken, ZapCallbackState} from 'hooks/useZap'
import useToast from 'hooks/useToast'
import { WrappedTokenInfo } from 'state/lists/hooks'
import useHttpLocations from 'hooks/useHttpLocations'
import useI18n from 'hooks/useI18n'

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

const getTokenLogoURL = (address: string) => `https://tokens.hyperswap.fi/images/${address}.png`

const Zap = () => {
    const { toastSuccess, toastError } = useToast()
    useZapDefaultState()
    const TranslateString = useI18n()
    const {field, typedValue} = useZapState()
    const {currencyBalances, currencyInput, pairOutput, parsedAmount, pairCurrency, estimates, liquidityMinted} = useDerivedZapInfo()
    const { onUserInput, onCurrencySelect, onPairSelect } = useZapActionHandlers()
    const parsedAmounts =  {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: liquidityMinted,
      }
    const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
    const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))
    const { callback: zapCallback, error: swapCallbackError, state: zapState } = useZapInToken(
        currencyInput, // JUMP
        pairOutput, // JUMP - FTM
        parsedAmounts[Field.INPUT],
        currencyBalances[Field.INPUT]
      )
    const token0 = estimates[0] ?? undefined
    const token1 = estimates[1] ?? undefined

    const uriLocations0 = useHttpLocations(token0?.token instanceof WrappedTokenInfo ? token0?.token.logoURI : undefined)
    const uriLocations1 = useHttpLocations(token1?.token instanceof WrappedTokenInfo ? token1?.token.logoURI : undefined)
    
    const srcs0 = useMemo(() => {
        if (token0?.token instanceof Token) {
            if (token0?.token instanceof WrappedTokenInfo) {
            return [
                ...uriLocations0,
                `/images/tokens/${token0?.token?.address ?? 'token'}.png`,
                getTokenLogoURL(token0?.token?.symbol.toLowerCase() === "wftm" ? "FTM" : token0?.token?.symbol.toLowerCase() === "bnb" ? "BNB" : token0?.token?.address),
            ]
            }

            return [`/images/tokens/${token0?.token?.address ?? 'token'}.png`, getTokenLogoURL(token0?.token?.symbol.toLowerCase() === "wftm" ? "FTM" : token0?.token?.symbol.toLowerCase() === "bnb" ? "BNB" : token0?.token?.address)]
        }
        return []
    }, [token0, uriLocations0])

    const srcs1 = useMemo(() => {
        if (token1?.token instanceof Token) {
            if (token1?.token instanceof WrappedTokenInfo) {
            return [
                ...uriLocations1,
                `/images/tokens/${token1?.token?.address ?? 'token'}.png`,
                getTokenLogoURL(token1?.token?.symbol.toLowerCase() === "wftm" ? "FTM" : token1?.token?.symbol.toLowerCase() === "bnb" ? "BNB" : token1?.token?.address),
            ]
            }

            return [`/images/tokens/${token1?.token?.address ?? 'token'}.png`, getTokenLogoURL(token1?.token?.symbol.toLowerCase() === "wftm" ? "FTM" : token1?.token?.symbol.toLowerCase() === "bnb" ? "BNB" : token1?.token?.address)]
        }
        return []
    }, [token1, uriLocations1])

    const handleZapCallback = useCallback(
        () => {
            zapCallback()
            .then(result => {
                result.wait().then(confirmation => {
                    if(confirmation.status){
                        toastSuccess('Zapped', 'Zap transaction successful.')
                    }else{
                        toastError('Zap Error', 'Something went wrong during transaction.')
                    }
                })
            })
            .catch(error => {
                console.error(error)
                toastError('Zap Error', 'An error occured while processing transaction.')
            })
        }
        ,[zapCallback, toastSuccess, toastError]
    )

    const [approval, approveCallback] = useApproveCallbackFromZap(parsedAmounts[field])
    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
    const showApproval = useMemo(() => { return approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING || (approvalSubmitted && approval === ApprovalState.APPROVED)}, [approval, approvalSubmitted]) 
    
    useEffect(() => {
      if (approval === ApprovalState.PENDING) {
        setApprovalSubmitted(true)
      }
    }, [approval, approvalSubmitted])

    const formattedAmounts = {
        [Field.INPUT]: typedValue ?? '',
        [Field.OUTPUT]: parsedAmounts[Field.OUTPUT]?.toSignificant(6) ?? ''
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
    }, [onPairSelect],
    )

    const handleInputCurrencySelect = useCallback(
    (currency) => {
        onCurrencySelect(Field.INPUT, currency)
    }, [onCurrencySelect],
    )

    const handleMaxInput = useCallback(() => {
        if (maxAmountInput) {
          onUserInput(Field.INPUT, maxAmountInput.toExact())
        }
      }, [maxAmountInput, onUserInput])

    return(
        <Container>
            <CardNav />
            <AppBody>
                <Wrapper id='zap-page' color='transparent'>
                    <PageHeader title="Zap" description="Zap into our LP tokens" />
                    <CardBody p='12px'>
                        <AutoColumn gap='md'>
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
                            <AutoColumn justify='center'>
                                <IconButton
                                    variant="tertiary"
                                    style={{ borderRadius: '50%' }}
                                    scale="sm"
                                >
                                    <ArrowDownIcon color="primary" width="24px" />
                                </IconButton>
                            </AutoColumn>
                            <CurrencyInputPanel
                                label={liquidityMinted ? TranslateString(196,'To (Estimated)') : TranslateString(80,'To')}
                                value={liquidityMinted ? liquidityMinted?.toSignificant(6) : "0"}
                                currency={pairCurrency}
                                pair={pairOutput}
                                onPairSelect={handleOutputPairSelect}
                                showMaxButton={false}
                                onUserInput={handleTypeOutput}
                                disabledNumericalInput
                                hideInput={!formattedAmounts[Field.OUTPUT]}
                                id="zap-currency-input"
                                pairToken
                            />
                            {token0 && token1 ?
                                <Card padding=".25rem .75rem 0 .75rem" borderRadius="20px">
                                    <AutoColumn justify='center' gap='5px'>
                                        <Text fontSize="16px" color='primary' bold>Estimated</Text>
                                        <AutoRow>
                                            <StyledLogo size="25px" srcs={srcs0} alt={`${token0?.currency?.symbol ?? 'token'} logo`} style={{ borderRadius: '20px', marginRight: '10px'}} />
                                            <Text fontSize="14px" marginRight="10px">{token0?.currency?.symbol} Deposited :</Text>
                                            <Text fontSize="14px">{token0?.toSignificant(6)}</Text>
                                        </AutoRow>
                                        <AutoRow>
                                            <StyledLogo size="25px" srcs={srcs1} alt={`${token0?.currency?.symbol ?? 'token'} logo`} style={{ borderRadius: '20px', marginRight: '10px'}} />
                                            <Text fontSize="14px" marginRight="10px">{token1?.currency?.symbol} Deposited :</Text>
                                            <Text fontSize="14px">{token1?.toSignificant(6)}</Text>
                                        </AutoRow>
                                    </AutoColumn>
                                </Card>
                            : ''
                            }
                            {showApproval ?
                                (<Button
                                    width="100%"
                                    disabled={false}
                                    variant='primary'
                                    onClick={approveCallback}
                                    >
                                    {approval === ApprovalState.PENDING ? (
                                        <AutoRow gap="6px" justify="center">
                                        Approving <Loader stroke="white" />
                                        </AutoRow>
                                    ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                                        'Approved'
                                    ) : (
                                        `Approve ${currencyInput?.name}`
                                    )}
                                </Button>)
                            :
                            <Button
                                width="100%"
                                disabled={!(zapState === ZapCallbackState.VALID)}
                                variant='primary'
                                onClick={() => handleZapCallback()}
                                >
                                {TranslateString(1211, 'Zap In')}
                            </Button>}
                        </AutoColumn>
                    </CardBody>
                </Wrapper>
            </AppBody>
        </Container>
    )
}

export default Zap
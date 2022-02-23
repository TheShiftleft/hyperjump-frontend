import React, { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react'
import { CardBody, ArrowDownIcon, Button, IconButton, Text, useModal } from 'uikit'
import Container from 'components/Container'
import { AutoColumn } from 'components/Column'
import AppBody from 'components/Zap/AppBody'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import CardNav from 'components/Zap/CardNav'
import PageHeader from 'components/Zap/PageHeader'
import { Wrapper } from 'components/Zap/styled'
import { useCurrency } from 'hooks/Tokens'
import Loader from 'components/Loader'
import { useDerivedWarpInfo, useWarpActionHandlers, useWarpDefaultState, useWarpState } from 'state/warp/hooks'
import useToast from 'hooks/useToast'
import { Field } from 'state/swap/actions'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { CurrencyAmount } from '@hyperjump-defi/sdk'
import { ApprovalState, useApproveCallbackFromZap } from 'hooks/useApproveCallback'
import { useZapOutToken } from 'hooks/useZap'
import { AutoRow } from 'components/Row'

const Warp = () => {
    useWarpDefaultState()
    const { toastSuccess, toastError } = useToast()
    const [input, setInput] = useState('')
    const [inputCurrency, setInputCurrency] = useState()
    const {field} = useWarpState()
    const [outputCurrency, setOutputCurrencySelected] = useState()
    const {pairInput, pairBalance, pairCurrency, currencyOutput, parsedAmount} = useDerivedWarpInfo()
    const { onUserInput, onCurrencySelect, onPairSelect } = useWarpActionHandlers()
    const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(pairBalance)
    const atMaxAmountInput = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput))
    const [approval, approveCallback] = useApproveCallbackFromZap(pairBalance)
    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
    const showApproval = useMemo(() => { return approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING || (approvalSubmitted && approval === ApprovalState.APPROVED)}, [approval, approvalSubmitted]) 

    const { callback: zapCallback, error: swapCallbackError, state: zapState} = useZapOutToken(
        pairInput,
        currencyOutput,
        parsedAmount
    )

    const handleZapCallback = useCallback(
        () => {
            zapCallback()
            .then(result => {
                result.wait().then(confirmation => {
                    if(confirmation.status){
                        toastSuccess('Warped', 'Warp transaction successful.')
                    }else{
                        toastError('Warp Error', 'Something went wrong during transaction.')
                    }
                })
            })
            .catch(error => {
                console.error(error)
                toastError('Warp Error', 'An error occured while processing transaction.')
            })
        },[zapCallback, toastSuccess, toastError]
    )
    const handleTypeInput = useCallback(
        (value) => {
            onUserInput(Field.INPUT, value)
        },
        [onUserInput],
      )

    const handleOutputCurrencySelect = useCallback(
        (currency) => {
            setOutputCurrencySelected(currency)
        }, [setOutputCurrencySelected],
        )


    const handleInputPairSelect = useCallback(
        (pair) => {
            onPairSelect(Field.INPUT, pair)
        }, [onPairSelect],
    )

    const handleMaxInput = useCallback(() => {
        if (maxAmountInput) {
            onUserInput(Field.INPUT, maxAmountInput.toExact())
        }
    }, [maxAmountInput, onUserInput])
    return(
        <Container>
            <CardNav activeIndex={1}/>
            <AppBody>
            <Wrapper id='warp-page' color='transparent'>
                    <PageHeader title="Warp" description="Warp from other tokens to our JUMP LP token" />
                    <CardBody p='12px'>
                        <AutoColumn gap='md'>
                            <CurrencyInputPanel
                                label='In'
                                value={parsedAmount?.toSignificant(6)}
                                showMaxButton={!atMaxAmountInput}
                                onMax={handleMaxInput}
                                currency={pairCurrency}
                                pair={pairInput}
                                onPairSelect={handleInputPairSelect}
                                onUserInput={handleTypeInput}
                                id="warp-currency-input"
                                pairToken
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
                                label='Out'
                                value=''
                                currency={currencyOutput}
                                onCurrencySelect={handleOutputCurrencySelect}
                                showMaxButton={false}
                                onUserInput={handleTypeInput}
                                zap
                                disabledNumericalInput
                                id="zap-currency-input"
                            />
                            {showApproval ?
                            <Button
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
                                    `Approve ${pairInput?.token0?.symbol}-${pairInput?.token1?.symbol}`
                                )}
                            </Button>
                            :
                            <Button
                                width="100%"
                                disabled={false}
                                variant='primary'
                                onClick={() => handleZapCallback()}
                                >
                                Warp
                            </Button>
                            }
                        </AutoColumn>
                    </CardBody>
                </Wrapper>
            </AppBody>
        </Container>
    )
}

export default Warp
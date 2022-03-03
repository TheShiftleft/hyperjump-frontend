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
import { LPToken } from 'components/SearchModal/CurrencyListWarp'
import { useZapAcross, ZapCallbackState } from 'hooks/useZap'
import { AutoRow } from 'components/Row'
import { useActiveWeb3React } from 'hooks'
import useOtherSwapList from 'hooks/useOtherSwapList'
import SwapSelectionModal, { OtherSwapConfig } from 'components/SwapSelectionModal'
import DefiSelect from './DefiSelect'

const Warp = () => {
    useWarpDefaultState()
    const { account } = useActiveWeb3React()
    const { toastSuccess, toastError } = useToast()
    const [outputCurrency, setOutputCurrencySelected] = useState()
    const [modalOpen, setModalOpen] = useState(false)
    const {lpInput, lpBalance, lpCurrency, currencyOutput, parsedAmount, selectedSwap} = useDerivedWarpInfo()
    const { onUserInput, onCurrencySelect, onLPSelect, onSwapSelect } = useWarpActionHandlers()
    const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(lpBalance)
    const atMaxAmountInput = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput))
    const [approval, approveCallback] = useApproveCallbackFromZap(lpBalance)
    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
    const showApproval = useMemo(() => { return approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING || (approvalSubmitted && approval === ApprovalState.APPROVED)}, [approval, approvalSubmitted]) 
    const { callback: zapCallback, error: swapCallbackError, state: zapState} = useZapAcross(
        lpInput,
        lpBalance,
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

    const handleInputLPSelect = useCallback(
        (lp: LPToken) => {
            onLPSelect(Field.INPUT, lp)
        }, [onLPSelect],
    )

    const handleMaxInput = useCallback(() => {
        if (maxAmountInput) {
            onUserInput(Field.INPUT, maxAmountInput.toExact())
        }
    }, [maxAmountInput, onUserInput])

    const handleModalDismiss = useCallback(() => {
        setModalOpen(false)
    }, [setModalOpen])

    const handleSwapSelect = useCallback(
        (swap: OtherSwapConfig) => {
            onSwapSelect(swap)
    }, [onSwapSelect])
    return(
        <>
        <Container>
            <CardNav activeIndex={1}/>
            <AppBody>
            <Wrapper id='warp-page' color='transparent'>
                    <PageHeader title="Warp" description="Warp from other Defi LP tokens to our JUMP LP token" />
                    <CardBody p='12px'>
                        <AutoColumn gap='md'>
                            <DefiSelect 
                                selected={selectedSwap}
                                onClick={() => {
                                    setModalOpen(true)
                                }}
                            />
                            <CurrencyInputPanel
                                label='From'
                                value={parsedAmount?.toSignificant(6)}
                                showMaxButton={!atMaxAmountInput}
                                onMax={handleMaxInput}
                                currency={lpCurrency}
                                lp={lpInput}
                                onLPSelect={handleInputLPSelect}
                                onUserInput={handleTypeInput}
                                id="warp-currency-input"
                                warp
                                selectedSwap={selectedSwap}
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
                                    `Approve ${lpInput?.tokens[0]?.symbol}-${lpInput?.tokens[1]?.symbol}`
                                )}
                            </Button>
                            :
                            <Button
                                width="100%"
                                disabled={!(zapState === ZapCallbackState.VALID)}
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
        <SwapSelectionModal
            isOpen={modalOpen}
            onDismiss={handleModalDismiss}
            selectedSwap={selectedSwap}
            onSwapSelect={handleSwapSelect}
        />
        </>
    )
}

export default Warp
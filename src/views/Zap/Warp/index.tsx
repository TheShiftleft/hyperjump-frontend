import React, { useCallback, useMemo, useState } from 'react'
import { CardBody, ArrowDownIcon, Button, IconButton } from 'uikit'
import Container from 'components/Container'
import { AutoColumn } from 'components/Column'
import AppBody from 'components/Zap/AppBody'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import CardNav from 'components/Zap/CardNav'
import PageHeader from 'components/Zap/PageHeader'
import { Wrapper } from 'components/Zap/styled'
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
import SwapSelectionModal, { OtherSwapConfig } from 'components/SwapSelectionModal'
import { PairState } from 'data/Reserves'
import useI18n from 'hooks/useI18n'
import useStake from 'hooks/useStake'
import DefiSelect from './DefiSelect'

const Warp = () => {
    useWarpDefaultState()
    const TranslateString = useI18n()
    const [isLoading, setIsLoading] = useState(false)
    const [warpToPool, setWarpToPool] = useState(false)
    
    const {typedValue} = useWarpState()
    const { toastSuccess, toastError, toastInfo } = useToast()
    const [modalOpen, setModalOpen] = useState(false)
    const {lpInput, lpBalance, lpCurrency, currencyOutput, parsedAmount, selectedSwap, outputLP, farm} = useDerivedWarpInfo()
    const { onUserInput, onLPSelect, onSwapSelect } = useWarpActionHandlers()
    const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(lpBalance)
    const atMaxAmountInput = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput))
    const [approval, approveCallback] = useApproveCallbackFromZap(lpBalance)
    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(approval === ApprovalState.PENDING)
    const showApproval = useMemo(() => { return approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING || (approvalSubmitted && approval === ApprovalState.APPROVED)}, [approval, approvalSubmitted]) 
    const { callback: zapCallback, error: swapCallbackError, state: zapState} = useZapAcross(
        lpInput,
        lpBalance,
        parsedAmount
    )
    const { onStake } = useStake(farm?.pid)

    const handleZapCallback = useCallback(
        () => {
            setIsLoading(true)
            zapCallback()
            .then(({zapAccross, amount}) => {
                toastInfo('Warping', 'Warp in progress')
                zapAccross.wait().then(confirmation => {
                    if(confirmation.status){
                        if(warpToPool){
                            toastInfo('Stake', 'Staking in Progress')
                            onStake(amount).then(() => {
                                setIsLoading(false)
                                toastSuccess('Success', 'Warp and Stake transaction successful.')
                            })
                            .catch((error) => {
                                console.error(error)
                                setIsLoading(false)
                                toastError('Error', 'Something went wrong during staking transaction.')
                            })
                        }else{
                            setIsLoading(false)
                            toastSuccess('Warped', 'Warp transaction successful.')
                        }
                    }else{
                        setIsLoading(false)
                        toastError('Warp Error', 'Something went wrong during transaction.')
                    }
                })
            })
            .catch(error => {
                console.info(error)
                let msg = 'An error occured while processing transaction.'
                let title = 'Zap Error'
                if(error.code === 4001){
                title = 'Transaction Cancelled'
                msg = 'User cancelled the transaction.'
                }
                toastError(title, msg)
                setIsLoading(false)
            })
        },[zapCallback, toastSuccess, toastError, toastInfo, onStake, warpToPool]
    )
    const handleTypeInput = useCallback(
        (value) => {
            onUserInput(Field.INPUT, value)
        },
        [onUserInput],
      )

    const handleInputLPSelect = useCallback(
        (lp: LPToken) => {
            onLPSelect(Field.INPUT, lp)
            onUserInput(Field.INPUT, maxAmountSpend(lp.balance)?.toExact())
        }, [onLPSelect, onUserInput],
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
            onSwapSelect(Field.INPUT, swap)
    }, [onSwapSelect])
    return(
        <>
        <Container>
            <CardNav activeIndex={1}/>
            <AppBody>
            <Wrapper id='warp-page' color='transparent'>
                    <PageHeader 
                        title="Warp" 
                        description="Warp from other Defi LP tokens to our JUMP LP token"
                        zapToPool={warpToPool}
                        setZapToPool={(value: boolean) => {
                          setWarpToPool(value)
                        }}
                     />
                    <CardBody p='12px'>
                        <AutoColumn gap='md'>
                            <DefiSelect 
                                selected={selectedSwap}
                                onClick={() => {
                                    setModalOpen(true)
                                }}
                            />
                            <CurrencyInputPanel
                                label={TranslateString(76,'From')}
                                value={typedValue ?? ''}
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
                                label={TranslateString(1207,'To HyperJUMP LP')}
                                value=''
                                showMaxButton={false}
                                lp={lpInput}
                                onUserInput={handleTypeInput}
                                currency={currencyOutput}
                                disableCurrencySelect
                                hideInput
                                zap
                                disabledNumericalInput
                                id="warp-currency-output"
                            />
                            {showApproval ?
                            <Button
                                width="100%"
                                disabled={false}
                                variant='primary'
                                onClick={() => {
                                    approveCallback()
                                    setApprovalSubmitted(true)
                                }}
                            >
                                {approval === ApprovalState.PENDING && approvalSubmitted ? (
                                    <AutoRow gap="6px" justify="center">
                                    Approving <Loader stroke="white" />
                                    </AutoRow>
                                ) : approval === ApprovalState.APPROVED ? (
                                    'Approved'
                                ) : (
                                    `Approve ${lpInput?.tokens[0]?.symbol}-${lpInput?.tokens[1]?.symbol}`
                                )}
                            </Button>
                            : outputLP[0] !== PairState.EXISTS ? 
                                <Button 
                                    width="100%"
                                    disabled
                                    variant='text'
                                    style={{ textAlign: 'center' }}>
                                    {lpCurrency === undefined ? 
                                        'Select an LP pair'
                                    :
                                    outputLP[0] === PairState.LOADING ?
                                        <AutoRow gap="6px" justify="center">
                                            Loading Pair <Loader stroke="white" />
                                        </AutoRow>
                                    :
                                    outputLP[0] === PairState.NOT_EXISTS ?
                                    'Pair does not exist in HyperJUMP LP'
                                    :
                                    'Invalid Pair'}
                                </Button>
                            :   <Button
                                    width="100%"
                                    disabled={!(zapState === ZapCallbackState.VALID && isLoading === false)}
                                    variant='primary'
                                    onClick={() => handleZapCallback()}
                                    >
                                    <AutoRow gap="6px" justify="center">
                                    {warpToPool ? 
                                        TranslateString(1213, 'Warp Into Pool') 
                                    :
                                        TranslateString(1209, 'Warp')}
                                    {isLoading && <Loader stroke="white" />}
                                    </AutoRow>
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
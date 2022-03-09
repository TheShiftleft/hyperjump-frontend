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
import { GreyCard } from 'components/Card'
import { PairState } from 'data/Reserves'
import useI18n from 'hooks/useI18n'
import DefiSelect from './DefiSelect'

const Warp = () => {
    useWarpDefaultState()
    const TranslateString = useI18n()
    const { toastSuccess, toastError } = useToast()
    const [modalOpen, setModalOpen] = useState(false)
    const {lpInput, lpBalance, lpCurrency, currencyOutput, parsedAmount, selectedSwap, outputLP, outputCurrency} = useDerivedWarpInfo()
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

    const handleInputLPSelect = useCallback(
        (lp: LPToken) => {
            onLPSelect(Field.INPUT, lp)
            onUserInput(Field.INPUT, maxAmountSpend(lp.balance).toExact())
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
                                label={TranslateString(76,'From')}
                                value={parsedAmount ? parsedAmount?.toSignificant(6) : ''}
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
                                pair={outputLP[1]}
                                onUserInput={handleTypeInput}
                                currency={outputCurrency}
                                disableCurrencySelect
                                hideInput
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
                            : outputLP[0] !== PairState.EXISTS ? 
                                <GreyCard style={{ textAlign: 'center' }}>
                                    <Text mb="4px">Pair does not exist in HyperJUMP LP</Text>
                                </GreyCard>
                            :   <Button
                                    width="100%"
                                    disabled={!(zapState === ZapCallbackState.VALID)}
                                    variant='primary'
                                    onClick={() => handleZapCallback()}
                                    >
                                    {TranslateString(1209,'Warp')}
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
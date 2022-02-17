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
import { useDerivedZapInfo, useZapActionHandlers, useZapState } from 'state/zap/hooks'
import { Field } from 'state/zap/actions'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import { useAllPairData } from 'contexts/Analytics/PairData'
import { useSavedPairs } from 'contexts/Analytics/LocalStorage'
import { usePair } from 'data/Reserves'
import zapPairs from 'config/constants/zap'
import getNetwork from 'utils/getNetwork'

const Zap = () => {
    const zapContract = useZapContract()
    const { account } = useActiveWeb3React()
    const { config } = getNetwork()
    const {field} = useZapState()
    const {currencyBalances, currencies, parsedAmount} = useDerivedZapInfo()
    const [tokenA, setTokenA] = useState()
    const [tokenB, setTokenB] = useState()
    const { onUserInput, onCurrencySelect } = useZapActionHandlers()
    const parsedAmounts =  {
        [Field.INPUT]: field === Field.INPUT ? parsedAmount : undefined,
        [Field.OUTPUT]: field === Field.OUTPUT ? undefined : undefined,
      }
    const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
    const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))
    // const pairs = zapPairs[config.network]
    // Approval Test for LP tokens
    
    // const LPToken = useCurrency("0x5448a3B93731e7C1d6e6310Cb614843FbaC21f69")
    // const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
        // LPToken ?? undefined
    // ])
    // const [approval, approveCallback] = useApproveCallbackFromZap(relevantTokenBalances[0])


    const [approval, approveCallback] = useApproveCallbackFromZap(parsedAmounts[field])
    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
    const showApproval = approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING || (approvalSubmitted && approval === ApprovalState.APPROVED)
    
    // const handleZap = useCallback(
    //     () => {

    //     },[]
    // )

    // mark when a user has submitted an approval, reset onTokenSelection for input field
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

    const handleOutputCurrencySelect = useCallback(
    (currency) => {
        onCurrencySelect(Field.OUTPUT, currency)
    }, [onCurrencySelect],
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
                    <PageHeader title="Zap" description="Zap out of our LP token" />
                    <CardBody p='12px'>
                        <AutoColumn gap='md'>
                            <CurrencyInputPanel
                                label='In'
                                value={parsedAmounts[Field.INPUT]?.toSignificant(6)}
                                showMaxButton={!atMaxAmountInput}
                                onMax={handleMaxInput}
                                currency={currencies[Field.INPUT]}
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
                                label='Out'
                                value={parsedAmounts[Field.OUTPUT]?.toSignificant(6)}
                                currency={currencies[Field.OUTPUT]}
                                onCurrencySelect={handleOutputCurrencySelect}
                                showMaxButton={false}
                                onUserInput={handleTypeOutput}
                                id="zap-currency-input"
                                pairToken
                            />
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
                                        `Approve ${currencies[Field.INPUT]?.symbol}`
                                    )}
                                </Button>)
                            :
                            <Button
                                width="100%"
                                disabled={false}
                                variant='primary'
                                onClick={() => console.info('clicked')}
                                >
                                Zap Out
                            </Button>}
                        </AutoColumn>
                    </CardBody>
                </Wrapper>
            </AppBody>
        </Container>
    )
}

export default Zap
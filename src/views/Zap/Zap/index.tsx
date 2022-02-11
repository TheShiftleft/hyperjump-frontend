import React, { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react'
import { CardBody, ArrowDownIcon, Button, IconButton, Text, useModal } from 'uikit'
import { AutoColumn } from 'components/Column'
import Container from 'components/Container'
import AppBody from 'components/Zap/AppBody'
import CardNav from 'components/Zap/CardNav'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import PageHeader from 'components/Zap/PageHeader'
import { Wrapper } from 'components/Zap/styled'
import { useCurrency } from 'hooks/Tokens'
import { useZapDefaultState } from 'state/zap/hooks'

const Zap = () => {
    const [input, setUserInput] = useState("")
    const [outputCurrency, setOutputCurrencySelected] = useState()
    const [inputCurrency, setInputCurrencySelected] = useState()
    const res = useZapDefaultState()
    const [loadedInputCurrency, loadedOutputCurrency] = [
        useCurrency(res?.inputCurrencyId),
        useCurrency(res?.outputCurrencyId),
    ]
    const handleTypeInput = useCallback(
        (value) => {
            setUserInput(value)
        },
        [setUserInput],
      )

    const handleOutputCurrencySelect = useCallback(
    (currency) => {
        setOutputCurrencySelected(currency)
    }, [setOutputCurrencySelected],
    )

    const handleInputCurrencySelect = useCallback(
    (currency) => {
        setInputCurrencySelected(currency)
    }, [setInputCurrencySelected],
    )

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
                                value={input}
                                showMaxButton={false}
                                currency={loadedInputCurrency}
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
                                value=''
                                currency={loadedOutputCurrency}
                                onCurrencySelect={handleOutputCurrencySelect}
                                showMaxButton={false}
                                onUserInput={handleTypeInput}
                                id="zap-currency-input"
                            />
                            <Button
                                width="100%"
                                disabled={false}
                                variant='primary'
                                onClick={() => console.info('clicked')}
                                >
                                Zap Out
                            </Button>
                        </AutoColumn>
                    </CardBody>
                </Wrapper>
            </AppBody>
        </Container>
    )
}

export default Zap
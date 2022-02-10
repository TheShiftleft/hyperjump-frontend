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
import { useWarpDefaultState } from 'state/warp/hooks'

const Warp = () => {
    const [input, setInput] = useState('')
    const [currency, setInputCurrency] = useState()
    const res = useWarpDefaultState()
    const [loadedInputCurrency, loadedOutputCurrency] = [
        useCurrency(res?.inputCurrencyId),
        useCurrency(res?.outputCurrencyId),
    ]
    const handleTypeInput = useCallback(
        (value) => {
            setInput(value)
        },
        [setInput],
      )

    const handleInputCurrencySelect = useCallback(
        (inputCurrency) => {
            setInputCurrency(inputCurrency)
        },
        [setInputCurrency]
    )
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
                                value={input}
                                showMaxButton={false}
                                currency={loadedInputCurrency}
                                onCurrencySelect={handleInputCurrencySelect}
                                onUserInput={handleTypeInput}
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
                                showMaxButton={false}
                                disableCurrencySelect
                                onUserInput={handleTypeInput}
                                id="zap-currency-input"
                            />
                            <Button
                                width="100%"
                                disabled={false}
                                variant='primary'
                                onClick={() => console.info('clicked')}
                                >
                                Warp
                            </Button>
                        </AutoColumn>
                    </CardBody>
                </Wrapper>
            </AppBody>
        </Container>
    )
}

export default Warp
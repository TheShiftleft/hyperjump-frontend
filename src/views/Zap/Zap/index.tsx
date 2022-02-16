import React, { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react'
import { CurrencyAmount, JSBI, Token, Trade } from '@hyperjump-defi/sdk'
import { CardBody, ArrowDownIcon, Button, IconButton, Text, useModal } from 'uikit'
import { AutoColumn } from 'components/Column'
import Container from 'components/Container'
import AppBody from 'components/Zap/AppBody'
import CardNav from 'components/Zap/CardNav'
import { useZapContract } from 'hooks/useContract'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import PageHeader from 'components/Zap/PageHeader'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { Wrapper } from 'components/Zap/styled'
import { useCurrency } from 'hooks/Tokens'
import useEstimateZapInToken from 'hooks/useZap'
import { useDerivedZapInfo, useZapActionHandlers, useZapState } from 'state/zap/hooks'
import { Field } from 'state/zap/actions'

const Zap = () => {
    const zapContract = useZapContract()
    
    console.log('zapContract',zapContract)
    const {field} = useZapState()
    const {currencyBalances, currencies, parsedAmount} = useDerivedZapInfo()
    const { onUserInput, onCurrencySelect } = useZapActionHandlers()
    const parsedAmounts =  {
        [Field.INPUT]: field === Field.INPUT ? parsedAmount : undefined,
        [Field.OUTPUT]: field === Field.OUTPUT ? undefined : undefined,
      }
    
    console.log('currencies', currencies)
    
    const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
    const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))
    const estimate = useEstimateZapInToken("0x130025eE738A66E691E6A7a62381CB33c6d9Ae83", "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", maxAmountInput)
    estimate().then(result => {
        console.log('estimate', result)
    })

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
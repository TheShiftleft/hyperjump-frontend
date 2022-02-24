import { CurrencyAmount, Currency, Pair, Token, TokenAmount, JSBI } from '@hyperjump-defi/sdk'
import BigNumber from 'bignumber.js'
import { useActiveWeb3React } from 'hooks'
import { useMemo, useCallback, useState } from 'react'
import { getRouterAddress } from 'utils/addressHelpers'
import { BIG_TEN } from 'utils/bigNumber'
import { useZapContract } from './useContract'

enum ZapCallbackState {
    INVALID,
    VALID,
    PENDING
}

export function useEstimateZapInToken(zapState: ZapCallbackState, currencyInput: Currency, pairOutput: Pair, pairCurrency: Currency, amount: CurrencyAmount)
    : {estimate0: TokenAmount; estimate1: TokenAmount} {
    const { account } = useActiveWeb3React()
    const zapContract = useZapContract()
    const router = getRouterAddress()
    const amountToProcess = new BigNumber(amount?.toExact()).multipliedBy(BIG_TEN.pow(amount?.currency?.decimals)).toString()
    const from = currencyInput instanceof Token ? currencyInput.address : undefined
    const to = pairOutput?.liquidityToken?.address
    const [{estimate0, estimate1}, setEstimate] = useState<{estimate0: TokenAmount, estimate1: TokenAmount}>({estimate0: undefined, estimate1: undefined})
    return useMemo(() => {
        if(zapState === ZapCallbackState.VALID && amountToProcess && amountToProcess !== 'NaN'){
            zapContract.estimateZapInToken(from, to, router, amountToProcess)
            .then((result) => {
                const estimatedAmount0 = new TokenAmount(pairCurrency instanceof Token ? pairCurrency : undefined, JSBI.BigInt(result[0]?.toString()))
                const estimatedAmount1 = new TokenAmount(pairCurrency instanceof Token ? pairCurrency : undefined, JSBI.BigInt(result[1]?.toString()))
                setEstimate({estimate0: estimatedAmount0, estimate1:estimatedAmount1})
            })
        }
        return {estimate0, estimate1}
    }, [zapContract, from, to, router, amountToProcess, estimate0, estimate1, zapState, pairCurrency])

}

export function useZapInToken(fromAddress: Currency, toAddress: Pair, amount: CurrencyAmount) {
    const { account } = useActiveWeb3React()
    const zapContract = useZapContract()
    const router = getRouterAddress()
    const amountToProcess = new BigNumber(amount?.toExact()).multipliedBy(BIG_TEN.pow(amount?.currency?.decimals)).toString()
    const from = fromAddress instanceof Token ? fromAddress.address : undefined
    const to = toAddress?.liquidityToken?.address
    
    return useMemo(() => {
        if(!zapContract || !router || !amountToProcess || !fromAddress || !toAddress || !from || !to) {
            if(fromAddress?.symbol === "FTM" || fromAddress?.symbol === "BNB"){
                return {
                    state: ZapCallbackState.VALID,
                    callback: async () => {
                        const zapIn = await zapContract.zapIn(to, router, account, {value: amountToProcess})
                        return zapIn
                    },
                    error: null
                }
            }
            return {
                state: ZapCallbackState.INVALID,
                callback: null,
                error: "Missing dependencies"
            }
        }
        return {
            state: ZapCallbackState.VALID,
            callback: async () => {
                const zapInToken = await zapContract.zapInToken(from, amountToProcess, to, router, account)
                return zapInToken
            },
            error: null
        }
    }, [zapContract, account, router, amountToProcess, fromAddress, toAddress, from, to])
}

export function useZapOutToken(fromAddress: Pair, toAddress: Currency, amount: CurrencyAmount) {
    const { account } = useActiveWeb3React()
    const zapContract = useZapContract()
    const router = getRouterAddress()
    const amountToProcess = new BigNumber(amount?.toExact()).multipliedBy(BIG_TEN.pow(amount?.currency?.decimals)).toString()
    const from = fromAddress?.liquidityToken?.address
    const to = toAddress instanceof Token ? toAddress.address : undefined

    return useMemo(() => {
        if(!zapContract || !router || !amountToProcess || !fromAddress || !toAddress || !from || !to) {
            return {
                state: ZapCallbackState.INVALID,
                callback: null,
                error: "Missing dependencies"
            }
        }

        return {
            state: ZapCallbackState.VALID,
            callback: async () => {
                const zapOutToken = await zapContract.zapOutToken(from, amountToProcess, to, router, account)
                return zapOutToken
            },
            error: null
        }
    }, [zapContract, account, router, amountToProcess, fromAddress, toAddress, from, to])
}
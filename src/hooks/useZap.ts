import { CurrencyAmount, Currency, Pair, Token } from '@hyperjump-defi/sdk'
import BigNumber from 'bignumber.js'
import { useActiveWeb3React } from 'hooks'
import { useMemo, useCallback } from 'react'
import { getRouterAddress } from 'utils/addressHelpers'
import { BIG_TEN } from 'utils/bigNumber'
import { useZapContract } from './useContract'

enum ZapCallbackState {
    INVALID,
    VALID,
    PENDING
}

export default function useZapInToken(fromAddress: Currency, toAddress: Pair, amount: CurrencyAmount) {
    const { account } = useActiveWeb3React()
    const zapContract = useZapContract()
    const router = getRouterAddress()
    const amountToProcess = new BigNumber(amount?.toExact()).multipliedBy(BIG_TEN.pow(amount?.currency?.decimals)).toString()
    const from = fromAddress instanceof Token ? fromAddress.address : undefined
    const to = toAddress?.liquidityToken?.address
    
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
                const zapInToken = await zapContract.zapInToken(from, amountToProcess, to, router, account)
                return zapInToken
            },
            error: null
        }
    }, [zapContract, account, router, amountToProcess, fromAddress, toAddress, from, to])
}
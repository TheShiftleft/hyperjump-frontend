import { CurrencyAmount } from '@hyperjump-defi/sdk'
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

export default function useZapInToken(fromAddress: string, toAddress: string, amount: CurrencyAmount) {
    const { account } = useActiveWeb3React()
    const zapContract = useZapContract()
    const router = getRouterAddress()
    const amountToProcess = new BigNumber(amount?.toExact()).multipliedBy(BIG_TEN.pow(amount?.currency?.decimals)).toString()
    
    return useMemo(() => {
        if(!zapContract || !router || !amountToProcess || !fromAddress || !toAddress) {
            return {
                state: ZapCallbackState.INVALID,
                callback: null,
                error: "Missing dependencies"
            }
        }
        return {
            state: ZapCallbackState.VALID,
            callback: async () => {
                const zapInToken = await zapContract.zapInToken(fromAddress, amountToProcess, toAddress, router, account)
                return zapInToken
            },
            error: null
        }
    }, [zapContract, account, router, amountToProcess, fromAddress, toAddress])
}
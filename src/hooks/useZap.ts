import { CurrencyAmount } from '@hyperjump-defi/sdk'
import { useMemo, useCallback } from 'react'
import { getRouterAddress } from 'utils/addressHelpers'
import estimateZapInToken from 'utils/zapCalls'
import { useZapContract } from './useContract'

export default function useEstimateZapInToken(fromAddress: string, toAddress: string, amount: CurrencyAmount) {
    const amt = amount?.toExact()
    const zapContract = useZapContract()
    const router = getRouterAddress()
    const estimated = useCallback(async () => {
        const result = await estimateZapInToken(zapContract, fromAddress, toAddress, router, amt)
        return result
    }, [fromAddress, toAddress, router, zapContract, amt])
    return estimated
}
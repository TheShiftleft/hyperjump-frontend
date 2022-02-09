import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import getNetwork from 'utils/getNetwork'
import { getAddress } from 'utils/addressHelpers'
import { AppDispatch, AppState } from '../index'
import { useActiveWeb3React } from '../../hooks'
import { replaceZapState } from './actions'

export function useZapState(): AppState['zap'] {
    return useSelector<AppState, AppState['zap']>((state) => state.zap)
}

export function useZapDefaultState(): {inputCurrencyId: string | undefined, outputCurrencyId: string | undefined} | undefined {
    const { config } = getNetwork()
    const { chainId } = useActiveWeb3React()
    const dispatch = useDispatch<AppDispatch>()
    const [result, setResult ] = useState<{inputCurrencyId: string | undefined, outputCurrencyId: string | undefined} | undefined>()
    useEffect(() => {
        if (!chainId) return
    
        dispatch(
            replaceZapState({
            inputCurrencyId: getAddress(config.farmingToken.address),
            outputCurrencyId: config.baseCurrency.symbol,
          })
        )
    
        setResult({ inputCurrencyId: getAddress(config.farmingToken.address), outputCurrencyId: config.baseCurrency.symbol })
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [dispatch, chainId])
    
      return result
}
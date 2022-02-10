import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import getNetwork from 'utils/getNetwork'
import { getAddress } from 'utils/addressHelpers'
import { AppDispatch, AppState } from '../index'
import { useActiveWeb3React } from '../../hooks'
import { replaceWarpState } from './actions'

export function useWarpState(): AppState['warp'] {
    return useSelector<AppState, AppState['warp']>((state) => state.warp)
}

export function useWarpDefaultState(): {inputCurrencyId: string | undefined, outputCurrencyId: string | undefined} | undefined {
    const { config } = getNetwork()
    const { chainId } = useActiveWeb3React()
    const dispatch = useDispatch<AppDispatch>()
    const [result, setResult ] = useState<{inputCurrencyId: string | undefined, outputCurrencyId: string | undefined} | undefined>()
    useEffect(() => {
        if (!chainId) return
    
        dispatch(
            replaceWarpState({
            inputCurrencyId: config.baseCurrency.symbol,
            outputCurrencyId: getAddress(config.farmingToken.address),
          })
        )
    
        setResult({ inputCurrencyId: config.baseCurrency.symbol, outputCurrencyId: getAddress(config.farmingToken.address) })
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [dispatch, chainId])
    
      return result
}
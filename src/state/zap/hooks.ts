import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Currency, CurrencyAmount } from '@hyperjump-defi/sdk'
import getNetwork from 'utils/getNetwork'
import { getAddress } from 'utils/addressHelpers'
import { tryParseAmount } from 'state/swap/hooks'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { AppDispatch, AppState } from '../index'
import { useCurrency } from '../../hooks/Tokens'
import { useActiveWeb3React } from '../../hooks'
import { useCurrencyBalances } from '../wallet/hooks'
import { replaceZapState, typeInput, Field } from './actions'

export function useZapState(): AppState['zap'] {
    return useSelector<AppState, AppState['zap']>((state) => state.zap)
}

export function useZapDefaultState(): {inputCurrencyId: string | undefined, outputCurrencyId: string | undefined} | undefined {
    const state = useZapState();
    const { config } = getNetwork()
    const { account } = useActiveWeb3React()
    const { chainId } = useActiveWeb3React()
    const dispatch = useDispatch<AppDispatch>()
    const inputCurrencyId = getAddress(config.farmingToken.address);
    const inputCurrency = useCurrency(inputCurrencyId)
    const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [inputCurrency ?? undefined])
    const maxInput = maxAmountSpend(relevantTokenBalances[0])?.toExact()
    const [result, setResult ] = useState<{field: string | undefined ,typedValue: string | undefined, inputCurrencyId: string | undefined, outputCurrencyId: string | undefined} | undefined>()
    useEffect(() => {
        if (!chainId) return
    
        dispatch(
            replaceZapState({
            field: state.field,
            typedValue: maxInput,
            inputCurrencyId,
            outputCurrencyId: config.baseCurrency.symbol,
          })
        )
    
        setResult({ field: state.field,
          typedValue: maxInput,
          inputCurrencyId,
          outputCurrencyId: config.baseCurrency.symbol })
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [dispatch, chainId, maxInput])
    
      return result
}

export function useZapActionHandlers(): {
  onUserInput: (field: Field, typedValue: string) => void
} {

  const dispatch = useDispatch<AppDispatch>()

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  return {
    onUserInput
  }
}

export function useDerivedZapInfo(): {
  currencies: { [field in Field]?: Currency },
  currencyBalances: { [field in Field]?: CurrencyAmount },
  parsedAmount: CurrencyAmount | undefined
  } {
    useZapDefaultState()
  const { account } = useActiveWeb3React()
  const {
    field,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId }
  } = useZapState();
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }
  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])
  const isExactIn: boolean = field === Field.INPUT
  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }

  return {currencyBalances, currencies, parsedAmount};
}
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BNB, Currency, CurrencyAmount, FANTOM, Token, Pair } from '@hyperjump-defi/sdk'
import getNetwork from 'utils/getNetwork'
import { getAddress } from 'utils/addressHelpers'
import { tryParseAmount } from 'state/swap/hooks'
import zapPairs from 'config/constants/zap'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { PairState, usePair, usePairs } from 'data/Reserves'
import { usePairContract } from 'hooks/useContract'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { AppDispatch, AppState } from '../index'
import { useCurrency, useToken } from '../../hooks/Tokens'
import { useActiveWeb3React } from '../../hooks'
import { useCurrencyBalances } from '../wallet/hooks'
import { replaceZapState, typeInput, Field, selectCurrency, selectPair } from './actions'

export function useZapState(): AppState['zap'] {
    return useSelector<AppState, AppState['zap']>((state) => state.zap)
}

export function useZapDefaultState(): {inputCurrencyId: string | undefined, outputPairId: string | undefined} | undefined {
    const state = useZapState();
    const { config } = getNetwork()
    const { account, chainId } = useActiveWeb3React()
    const dispatch = useDispatch<AppDispatch>()
    const pairs = zapPairs[config.network]
    const inputCurrencyId = getAddress(config.wrappedNetworkToken.address)
    const inputCurrency = useCurrency(inputCurrencyId)
    const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [inputCurrency ?? undefined])
    const maxInput = maxAmountSpend(relevantTokenBalances[0])?.toExact()
    const [result, setResult ] = useState<{field: string | undefined ,typedValue: string | undefined, inputCurrencyId: string | undefined, outputPairId: string | undefined} | undefined>()
    useEffect(() => {
        if (!chainId) return
    
        dispatch(
            replaceZapState({
            field: state.field,
            typedValue: maxInput,
            inputCurrencyId,
            outputPairId: pairs[0].lpAddresses[chainId],
          })
        )
    
        setResult({ field: state.field,
          typedValue: maxInput,
          inputCurrencyId,
          outputPairId: pairs[0].lpAddresses[chainId], })
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [dispatch, chainId, maxInput])
    
      return result
}

export function useZapActionHandlers(): {
  onUserInput: (field: Field, typedValue: string) => void
  onCurrencySelect: (field: Field, currency: Currency | Pair) => void
  onPairSelect: (field: Field, pair: Pair) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onCurrencySelect = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(selectCurrency({field, currencyId: currency instanceof Token
        ? currency.address
        : currency === BNB
        ? 'BNB'
        : currency === FANTOM
        ? 'FTM'
        : ''}))
    },
    [dispatch]
  )

  const onPairSelect = useCallback(
    (field: Field, pair: Pair) => {
      dispatch(selectPair({field, pairId: pair?.liquidityToken?.address}))
    },
    [dispatch]
  )

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  return {
    onUserInput,
    onCurrencySelect,
    onPairSelect
  }
}

export function useDerivedZapInfo(): {
  currencyInput:  Currency,
  pairOutput: Pair,
  pairCurrency: Currency
  currencyBalances: { [field in Field]?: CurrencyAmount },
  parsedAmount: CurrencyAmount | undefined
  } {
  const { account } = useActiveWeb3React()
  const {
    field,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { pairId: outputPairId }
  } = useZapState();
  const inputCurrency = useCurrency(inputCurrencyId)
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const v2Pairs = usePairs(tokenPairsWithLiquidityTokens.map(({ tokens }) => tokens))
  const allV2PairsWithLiquidity = useMemo(() => { return v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))},[v2Pairs]) 

  const pairToken = allV2PairsWithLiquidity.find(pair => pair.liquidityToken.address === outputPairId)
  
  const [,pairOutput] = usePair(pairToken?.token0, pairToken?.token1)
  const pairCurrency = useCurrency(outputPairId)
  const currencyInput = inputCurrency
  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined
  ])
  const isExactIn: boolean = field === Field.INPUT
  const parsedAmount = tryParseAmount(typedValue, (inputCurrency) ?? undefined)

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0]
  }

  return {currencyBalances, currencyInput, pairOutput, pairCurrency, parsedAmount};
}
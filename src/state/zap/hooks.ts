import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BNB, Currency, CurrencyAmount, FANTOM, Token, Pair, TokenAmount, JSBI } from '@hyperjump-defi/sdk'
import getNetwork from 'utils/getNetwork'
import { getAddress } from 'utils/addressHelpers'
import { tryParseAmount } from 'state/swap/hooks'
import zapPairs from 'config/constants/zap'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { usePair, usePairs } from 'data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { useEstimateZapInToken } from 'hooks/useZap'
import { useTotalSupply } from 'data/TotalSupply'
import { wrappedCurrencyAmount } from 'utils/wrappedCurrency'
import { AppDispatch, AppState } from '../index'
import { useCurrency } from '../../hooks/Tokens'
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
    const inputCurrencyId = config.networkToken.symbol
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
  parsedAmount: CurrencyAmount | undefined,
  estimates: TokenAmount[] | undefined,
  liquidityMinted: TokenAmount
  } {
  const { account, chainId } = useActiveWeb3React()
  const {
    field,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { pairId: outputPairId }
  } = useZapState();
  const currencyInput = useCurrency(inputCurrencyId)
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const v2Pairs = usePairs(tokenPairsWithLiquidityTokens.map(({ tokens }) => tokens))
  const allV2PairsWithLiquidity = useMemo(() => { return v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))},[v2Pairs]) 

  const pairToken = allV2PairsWithLiquidity.find(pair => pair.liquidityToken.address === outputPairId)
  const [,pairOutput] = usePair(pairToken?.token0, pairToken?.token1)
  const totalSupply = useTotalSupply(pairOutput?.liquidityToken)
  const pairCurrency = pairToken?.liquidityToken
  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    currencyInput ?? undefined
  ])
  const parsedAmount = tryParseAmount(typedValue, (currencyInput) ?? undefined)
  let estimate = useEstimateZapInToken(currencyInput ?? undefined, pairToken, parsedAmount)
  const estimates = useMemo(() => {
    return estimate && parsedAmount && (currencyInput?.symbol !== 'BNB' && currencyInput?.symbol !== 'FTM') ? [
      new TokenAmount(pairToken?.token0 ?? undefined, JSBI.BigInt(estimate[0] ? estimate[0].toString() : 0)),
      new TokenAmount(pairToken?.token1 ?? undefined, JSBI.BigInt(estimate[1] ? estimate[1].toString() : 0))
    ] : [undefined, undefined]
  }, [estimate, pairToken, parsedAmount, currencyInput]) 
  
  const liquidityMinted = useMemo(() => {
    const [estimate0, estimate1] = estimates
    const [tokenAmountA, tokenAmountB] = [
      wrappedCurrencyAmount(estimate0, chainId),
      wrappedCurrencyAmount(estimate1, chainId),
    ]
    if (pairOutput && totalSupply && tokenAmountA && tokenAmountB) {
      return pairOutput.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB)
    }
    return undefined
  }, [ chainId, pairOutput, totalSupply, estimates])
  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0]
  }

  return {currencyBalances, currencyInput, pairOutput, pairCurrency, parsedAmount, estimates, liquidityMinted};
}
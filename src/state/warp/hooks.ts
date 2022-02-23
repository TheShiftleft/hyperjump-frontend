import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import getNetwork from 'utils/getNetwork'
import { getAddress } from 'utils/addressHelpers'
import zapPairs from 'config/constants/zap'
import { BNB, Currency, CurrencyAmount, FANTOM, Pair, Token } from '@hyperjump-defi/sdk'
import { useCurrency, useToken } from 'hooks/Tokens'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { usePair, usePairs } from 'data/Reserves'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { tryParseAmount } from 'state/swap/hooks'
import {maxAmountSpend} from 'utils/maxAmountSpend'
import { Field, replaceWarpState, typeInput, selectPair, selectCurrency } from './actions'
import { useActiveWeb3React } from '../../hooks'
import { AppDispatch, AppState } from '../index'

export function useWarpState(): AppState['warp'] {
    return useSelector<AppState, AppState['warp']>((state) => state.warp)
}

export function useWarpActionHandlers(): {
  onUserInput: (field: Field, typedValue: string) => void
  onPairSelect: (field: Field, pair: Pair) => void
  onCurrencySelect: (field: Field, currency: Currency) => void
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

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  const onPairSelect = useCallback(
    (field: Field, pair: Pair) => {
      dispatch(selectPair({field, pairId: pair?.liquidityToken?.address}))
    },
    [dispatch]
  )

  return {onUserInput, onPairSelect, onCurrencySelect}
}

export function useWarpDefaultState(): {
    field: Field | undefined,
    typedValue: string | undefined,
    inputPairId: string | undefined,
    outputCurrencyId: string | undefined} | undefined
    {
    const { config } = getNetwork()
    const { chainId, account } = useActiveWeb3React()
    const {field} = useWarpState()
    const dispatch = useDispatch<AppDispatch>()
    const pairs = zapPairs[config.network]
    const inputPairId = pairs[0]?.lpAddresses[chainId]
    const inputPairCurrency = useCurrency(inputPairId)
    const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [inputPairCurrency ?? undefined])
    const maxInput = maxAmountSpend(relevantTokenBalances[0])?.toExact()
    const outputCurrencyId = getAddress(config.farmingToken.address);
    const [result, setResult ] = useState<{
      field: Field | undefined,
      typedValue: string | undefined,
      inputPairId: string | undefined,
      outputCurrencyId: string | undefined} | undefined
      >()

    useEffect(() => {
        if (!chainId) return
    
        dispatch(
            replaceWarpState({
            field,
            typedValue: maxInput,
            inputPairId,
            outputCurrencyId
          })
        )
    
        setResult({field,
          typedValue: maxInput,
          inputPairId,
          outputCurrencyId})
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [dispatch, chainId, maxInput])
    
      return result
}

export function useDerivedWarpInfo(): {
  pairInput: Pair,
  pairCurrency: Currency,
  currencyOutput: Currency
  pairBalance: CurrencyAmount,
  parsedAmount: CurrencyAmount
} {
  const { account } = useActiveWeb3React()
  const {
    field,
    typedValue,
    [Field.INPUT]: { pairId: inputPairId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId }
  } = useWarpState();

  const outputCurrency = useToken(outputCurrencyId)
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const v2Pairs = usePairs(tokenPairsWithLiquidityTokens.map(({ tokens }) => tokens))
  const allV2PairsWithLiquidity = useMemo(() => { return v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))},[v2Pairs]) 

  const pairToken = allV2PairsWithLiquidity.find(pair => pair.liquidityToken.address === inputPairId)
  const [,pairInput] = usePair(pairToken?.token0, pairToken?.token1)
  const pairCurrency = useCurrency(inputPairId)
  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    pairCurrency ?? undefined
  ])

  const parsedAmount = tryParseAmount(typedValue, pairCurrency ?? undefined)

  return {pairInput, pairCurrency, currencyOutput: outputCurrency, pairBalance: relevantTokenBalances[0], parsedAmount}
}
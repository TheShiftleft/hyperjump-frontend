import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import getNetwork from 'utils/getNetwork'
import { BNB, Currency, CurrencyAmount, FANTOM, METIS,  Pair, Token } from '@hyperjump-defi/sdk'
import { PairState, usePair } from 'data/Reserves'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { tryParseAmount } from 'state/swap/hooks'
import {maxAmountSpend} from 'utils/maxAmountSpend'
import { LPToken } from 'components/SearchModal/CurrencyListWarp'
import { useFilterLpAvailableToHyper, useOtherLpsCurrency } from 'hooks/useOtherLps'
import { OtherSwapConfig } from 'components/SwapSelectionModal'
import useOtherSwapList from 'hooks/useOtherSwapList'
import useWeb3 from 'hooks/useWeb3'
import zapPairs from 'config/constants/zap'
import { isAddress } from 'utils'
import { FarmConfig } from 'config/constants/types'
import { Field, replaceWarpState, typeInput, selectLP, selectCurrency, selectSwap } from './actions'
import { useActiveWeb3React } from '../../hooks'
import { AppDispatch, AppState } from '../index'

export function useWarpState(): AppState['warp'] {
    return useSelector<AppState, AppState['warp']>((state) => state.warp)
}

export function useWarpActionHandlers(): {
  onUserInput: (field: Field, typedValue: string) => void
  onLPSelect: (field: Field, lp: LPToken) => void
  onCurrencySelect: (field: Field, currency: Currency) => void
  onSwapSelect: (field: Field, swap: OtherSwapConfig) => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const web3 = useWeb3()

  const onCurrencySelect = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(selectCurrency({field, currencyId: currency instanceof Token
        ? currency.address
        : currency === BNB
        ? 'BNB'
        : currency === FANTOM
        ? 'FTM'
        : currency === METIS
        ? 'METIS'
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

  const onLPSelect = useCallback(
    (field: Field, lp: LPToken) => {
      const lpId = web3.utils.toChecksumAddress(lp.liquidityToken.address)
      dispatch(selectLP({field, lpId }))
    },
    [dispatch, web3]
  )

  const onSwapSelect = useCallback(
    (field: Field, swap: OtherSwapConfig) => {
      dispatch(selectSwap({swapId: swap.name}))
      dispatch(selectLP({field, lpId: ''}))
      dispatch(typeInput({field, typedValue: '' }))
    },
    [dispatch]
  )

  return {onUserInput, onLPSelect, onCurrencySelect, onSwapSelect}
}

export function useWarpDefaultState(): {
    field: Field | undefined,
    typedValue: string | undefined,
    inputLpId: string | undefined,
    outputCurrencyId: string | undefined} | undefined
    {
    const { chainId } = getNetwork()
    const web3 = useWeb3()
    const {field} = useWarpState()
    const dispatch = useDispatch<AppDispatch>()
    const swapList = useOtherSwapList()
    const swapId = Object.keys(swapList)[0]
    const input = useFilterLpAvailableToHyper(swapId)
    const inputLpId = web3.utils.toChecksumAddress(input[0]?.address)
    const [result, setResult ] = useState<{
      field: Field | undefined,
      typedValue: string | undefined,
      inputLpId: string | undefined,
      swapId: string,
      outputCurrencyId: string | undefined} | undefined
      >()

    useMemo(() => {
        if (!chainId) return
    
        dispatch(
            replaceWarpState({
            field,
            typedValue: '',
            inputLpId,
            swapId,
            outputCurrencyId: ''
          })
        )
    
        setResult({field,
          typedValue: '',
          inputLpId,
          swapId,
          outputCurrencyId: ''})
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [dispatch, chainId, inputLpId, swapId])
    
      return result
}

export function useDerivedWarpInfo(): {
  lpInput: LPToken,
  lpCurrency: Currency,
  currencyOutput: Currency
  lpBalance: CurrencyAmount,
  parsedAmount: CurrencyAmount,
  selectedSwap: OtherSwapConfig,
  outputLP: [PairState, Pair],
  farm: FarmConfig
} {
  const {
    typedValue,
    [Field.INPUT]: { lpId: inputLpId },
    selectedSwap
  } = useWarpState();
  const { config } = getNetwork()
  const { account, chainId } = useActiveWeb3React()
  const swapList = useOtherSwapList()
  const swapSelected = swapList[selectedSwap]
  const lpTokens = useOtherLpsCurrency(selectedSwap)
  const lpInput = useMemo(() => lpTokens.find(lp => lp.liquidityToken.address === inputLpId)
  ,[lpTokens,inputLpId])
  const lpCurrency = lpInput?.liquidityToken
  const lpBalance = useCurrencyBalance(account ?? undefined, lpCurrency ?? undefined)
  const parsedAmount = tryParseAmount(typedValue, lpCurrency ?? undefined)
  const pair = usePair(lpInput?.tokens[0], lpInput?.tokens[1])
  const currencyOutput = pair[1]?.liquidityToken
  const pairs = zapPairs[config.network]
  const farm = useMemo(() => {
    return Object.values(pairs).find((farmPair) => {
      const pairAddress = isAddress(farmPair.lpAddresses[chainId])
      return pairAddress === currencyOutput?.address
    })
  }, [pairs, chainId, currencyOutput])

  return {lpInput, lpCurrency, currencyOutput, lpBalance, parsedAmount, selectedSwap: swapSelected, outputLP: pair, farm}
}
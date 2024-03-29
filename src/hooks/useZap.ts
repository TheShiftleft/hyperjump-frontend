import { CurrencyAmount, Currency, Pair, Token, JSBI } from '@hyperjump-defi/sdk'
import BigNumber from 'bignumber.js'
import { LPToken } from 'components/SearchModal/CurrencyListWarp'
import { FarmConfig } from 'config/constants/types'
import { useActiveWeb3React } from 'hooks'
import { useMemo, useState, useEffect } from 'react'
import { isAddress } from 'utils'
import { getRouterAddress } from 'utils/addressHelpers'
import { BIG_TEN } from 'utils/bigNumber'
import getNetwork from 'utils/getNetwork'
import { useZapContract } from './useContract'

export enum ZapCallbackState {
  INVALID,
  VALID,
  PENDING,
}

export function useEstimateZapInToken(currencyInput: Currency, pairOutput: Pair, amount: CurrencyAmount) {
  const { config } = getNetwork()
  const zapContract = useZapContract()
  const router = getRouterAddress()
  const amountToProcess = amount
    ? new BigNumber(amount?.toExact()).multipliedBy(BIG_TEN.pow(amount?.currency?.decimals)).toString()
    : undefined
  const from = currencyInput instanceof Token ? currencyInput.address : currencyInput === config.baseCurrency ? isAddress(config.wrappedNetworkToken.address[config.id]) ?? undefined : undefined
  const to = pairOutput?.liquidityToken?.address
  const [estimate, setEstimate] = useState<BigNumber[]>()
  useEffect(() => {
    if (amountToProcess && amountToProcess !== 'NaN' && from && to) {
      zapContract.estimateZapInToken(from, to, router, amountToProcess).then((est: BigNumber[]) => {
        setEstimate(est)
      })
    }
  }, [amountToProcess, zapContract, from, to, router, setEstimate])
  return estimate
}

export function useZapInToken(
  fromAddress: Currency,
  toAddress: Pair,
  amount: CurrencyAmount,
  currencyBalance: CurrencyAmount,
) {
  const { account } = useActiveWeb3React()
  const zapContract = useZapContract()
  const router = getRouterAddress()
  const amountToProcess = new BigNumber(amount?.toExact())
    .multipliedBy(BIG_TEN.pow(amount?.currency?.decimals))
    .toString()
  const from = fromAddress instanceof Token ? fromAddress.address : undefined
  const to = toAddress?.liquidityToken?.address

  return useMemo(() => {
    if (
      !zapContract ||
      !router ||
      !amountToProcess ||
      !fromAddress ||
      !toAddress ||
      !to ||
      !currencyBalance ||
      amountToProcess === 'NaN'
    ) {
      return {
        state: ZapCallbackState.INVALID,
        callback: null,
        error: 'Missing dependencies',
      }
    }
    if (JSBI.greaterThan(amount?.raw, currencyBalance?.raw)) {
      return {
        state: ZapCallbackState.INVALID,
        callback: null,
        error: 'Invalid input amount',
      }
    }
    if (fromAddress?.symbol === 'FTM' || fromAddress?.symbol === 'BNB') {
      return {
        state: ZapCallbackState.VALID,
        callback: async () => {
          const zapIn = await zapContract.zapIn(to, router, account, { value: amountToProcess })
          return zapIn
        },
        error: null,
      }
    }
    return {
      state: ZapCallbackState.VALID,
      callback: async () => {
        const zapInToken = await zapContract.zapInToken(from, amountToProcess, to, router, account)
        return zapInToken
      },
      error: null,
    }
  }, [zapContract, account, router, amountToProcess, fromAddress, toAddress, from, to, currencyBalance, amount])
}

export function useZapOutToken(fromAddress: Pair, toAddress: Currency, amount: CurrencyAmount) {
  const { account } = useActiveWeb3React()
  const zapContract = useZapContract()
  const router = getRouterAddress()
  const amountToProcess = new BigNumber(amount?.toExact())
    .multipliedBy(BIG_TEN.pow(amount?.currency?.decimals))
    .toString()
  const from = fromAddress?.liquidityToken?.address
  const to = toAddress instanceof Token ? toAddress.address : undefined

  return useMemo(() => {
    if (!zapContract || !router || !amountToProcess || !fromAddress || !toAddress || !from || !to) {
      return {
        state: ZapCallbackState.INVALID,
        callback: null,
        error: 'Missing dependencies',
      }
    }

    return {
      state: ZapCallbackState.VALID,
      callback: async () => {
        const zapOutToken = await zapContract.zapOutToken(from, amountToProcess, to, router, account)
        return zapOutToken
      },
      error: null,
    }
  }, [zapContract, account, router, amountToProcess, fromAddress, toAddress, from, to])
}

export function useZapAcross(address: LPToken, pairBalance: CurrencyAmount, amount: CurrencyAmount) {
  const { account } = useActiveWeb3React()
  const zapContract = useZapContract()
  const router = getRouterAddress()
  const amountToProcess = new BigNumber(amount?.toExact())
    .multipliedBy(BIG_TEN.pow(amount?.currency?.decimals))
    .toString()
  const from = address?.liquidityToken?.address
  return useMemo(() => {
    if (!zapContract || !router || !amountToProcess || !address || !from || !pairBalance || !amount) {
      return {
        state: ZapCallbackState.INVALID,
        callback: null,
        error: 'Missing dependencies',
      }
    }
    if (JSBI.greaterThan(amount?.raw, pairBalance?.raw)) {
      return {
        state: ZapCallbackState.INVALID,
        callback: null,
        error: 'Invalid input amount',
      }
    }
    return {
      state: ZapCallbackState.VALID,
      callback: async () => {
        const zapAccross = await zapContract.zapAcross(from, amountToProcess, router, account)
        return {zapAccross, amount: amount.toExact()}
      },
      error: null,
    }
  }, [zapContract, account, router, amountToProcess, from, address, pairBalance, amount])
}

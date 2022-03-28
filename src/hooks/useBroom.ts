import { CurrencyAmount, Currency, Pair, Token, TokenAmount, JSBI } from '@hyperjump-defi/sdk'
import BigNumber from 'bignumber.js'

import { useActiveWeb3React } from 'hooks'
import { useMemo, useState, useEffect } from 'react'
import { useCurrencyBalance } from 'state/wallet/hooks'
import getNetwork from 'utils/getNetwork'

import { getRouterAddress } from 'utils/addressHelpers'
import { BIG_TEN } from 'utils/bigNumber'
import { useBroomContract } from './useContract'
import contract from '../config/constants/contracts'

export enum BroomCallbackState {
  INVALID,
  VALID,
  PENDING,
}

export function useBroomSweep(amount?: CurrencyAmount, tokens?: string, decimals?: number) {
  const { config, chainId } = getNetwork()

  const broomContract = useBroomContract()
  const router = getRouterAddress()
  const connector = config.wrappedNetworkToken.address[chainId]
  const amountsOutmin = 0
  const amountToProcess = amount
    ? new BigNumber(amount.toExact()).multipliedBy(BIG_TEN.pow(decimals)).toString()
    : undefined

  return useMemo(() => {
    const token = []
    const amounts = []
    const amountsmin = []
    amountsmin.push(amountsOutmin.toString())
    amounts.push(amountToProcess)

    token.push(tokens)
    if (!broomContract || !router || !amountToProcess || !connector || !tokens || !amount) {
      return {
        state: BroomCallbackState.INVALID,
        callback: null,
        error: 'Missing dependencies',
      }
    }

    return {
      state: BroomCallbackState.VALID,

      callback: async () => {
        const broomSweep = await broomContract.sweep(router, connector, token, amounts, amountsmin)

        return broomSweep
      },
      error: null,
    }
  }, [router, broomContract, connector, amountToProcess, amount, amountsOutmin, tokens])
}

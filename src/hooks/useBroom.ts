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

export function useBroomSweep(amount?: number, tokens?: Array<string>, decimals?: number) {
  const { config, chainId } = getNetwork()

  const broomContract = useBroomContract()
  const router = getRouterAddress()
  const connector = config.wrappedNetworkToken.address[chainId] 
  const amountsOutmin = 0
  const amountToProcess = amount ? new BigNumber(amount).multipliedBy(BIG_TEN.pow(decimals)) : undefined

  return useMemo(() => {
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
        const broomSweep = await broomContract.sweep(router, connector, tokens, amountToProcess, amountsOutmin)
        return broomSweep
      },
      error: null,
    }
  }, [router, broomContract, connector, tokens, amountToProcess, amount, amountsOutmin])
}

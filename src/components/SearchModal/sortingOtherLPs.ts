import { Token, TokenAmount, Pair } from '@hyperjump-defi/sdk'
import { useMemo } from 'react'
import { useAllTokenBalances } from '../../state/wallet/hooks'
import { LPToken } from './CurrencyListWarp'
import { balanceComparator } from './sorting'

function getTokenComparator(): (lpA: LPToken, lpB: LPToken) => number {
  return function sortTokens(lpA: LPToken, lpB: LPToken): number {
    // -1 = a is first
    // 1 = b is first

    // sort by balances
    const balanceA = lpA.balance
    const balanceB = lpB.balance

    const balanceComp = balanceComparator(balanceA, balanceB)
    if (balanceComp !== 0) return balanceComp

    if (lpA.tokens[0].symbol && lpB.tokens[0].symbol) {
      // sort by symbol
      return lpA.tokens[0].symbol.toLowerCase() < lpB.tokens[0].symbol.toLowerCase() ? -1 : 1
    }
    return lpA.tokens[0].symbol ? -1 : lpB.tokens[0].symbol ? -1 : 0
  }
}

export function useOtherLPComparator(inverted: boolean): (lpA: LPToken, lpB: LPToken) => number {
  const comparator = useMemo(() => getTokenComparator(), [])
  return useMemo(() => {
    if (inverted) {
      return (lpA: LPToken, lpB: LPToken) => comparator(lpA, lpB) * -1
    }
    return comparator
  }, [inverted, comparator])
}

export default useOtherLPComparator

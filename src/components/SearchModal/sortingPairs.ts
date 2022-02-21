import { Token, TokenAmount, Pair } from '@hyperjump-defi/sdk'
import { useMemo } from 'react'
import { useAllTokenBalances } from '../../state/wallet/hooks'

// compare two token amounts with highest one coming first
function balanceComparator(balanceA?: TokenAmount, balanceB?: TokenAmount) {
  if (balanceA && balanceB) {
    return balanceA.greaterThan(balanceB) ? -1 : balanceA.equalTo(balanceB) ? 0 : 1
  }
  if (balanceA && balanceA.greaterThan('0')) {
    return -1
  }
  if (balanceB && balanceB.greaterThan('0')) {
    return 1
  }
  return 0
}

function getTokenComparator(balances: {
  [tokenAddress: string]: TokenAmount | undefined
}): (pairA: Pair, pairB: Pair) => number {
  return function sortTokens(pairA: Pair, pairB: Pair): number {
    // -1 = a is first
    // 1 = b is first

    // sort by balances
    const balanceA = balances[pairA.token1.address]
    const balanceB = balances[pairB.token1.address]

    const balanceComp = balanceComparator(balanceA, balanceB)
    if (balanceComp !== 0) return balanceComp

    if (pairA.token1.symbol && pairB.token1.symbol) {
      // sort by symbol
      return pairA.token1.symbol.toLowerCase() < pairB.token1.symbol.toLowerCase() ? -1 : 1
    }
    return pairA.token1.symbol ? -1 : pairB.token1.symbol ? -1 : 0
  }
}

export function usePairComparator(inverted: boolean): (pairA: Pair, pairB: Pair) => number {
  const balances = useAllTokenBalances()
  const comparator = useMemo(() => getTokenComparator(balances ?? {}), [balances])
  return useMemo(() => {
    if (inverted) {
      return (pairA: Pair, pairB: Pair) => comparator(pairA, pairB) * -1
    }
    return comparator
  }, [inverted, comparator])
}

export default usePairComparator

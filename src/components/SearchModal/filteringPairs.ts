import { Pair } from '@hyperjump-defi/sdk'
import { isAddress } from '../../utils'

export function filterPairs(pairs: Pair[], search: string): Pair[] {
  if (search.length === 0) return pairs

  const searchingAddress = isAddress(search)

  if (searchingAddress) {
    return pairs.filter((pair) => pair.liquidityToken.address === searchingAddress)
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0)

  if (lowerSearchParts.length === 0) {
    return pairs
  }

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((str) => str.length > 0)

    return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)))
  }

  return pairs.filter((pair) => {
    return (pair.token0.symbol && matchesSearch(pair.token0.symbol)) || (pair.token0.name && matchesSearch(pair.token0.name)) || (pair.token1.symbol && matchesSearch(pair.token1.symbol)) || (pair.token1.name && matchesSearch(pair.token1.name))
  })
}

export default filterPairs

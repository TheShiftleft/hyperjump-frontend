import { isAddress } from '../../utils'
import { LPToken } from './CurrencyListWarp'

export function filterOtherLPs(Lps: LPToken[], search: string): LPToken[] {
  if (search.length === 0) return Lps

  const searchingAddress = isAddress(search)

  if (searchingAddress) {
    return Lps.filter((pair) => pair.liquidityToken.address === searchingAddress)
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0)

  if (lowerSearchParts.length === 0) {
    return Lps
  }

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((str) => str.length > 0)

    return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)))
  }

  return Lps.filter((lp) => {
    return (lp.tokens[0].symbol && matchesSearch(lp.tokens[0].symbol)) || (lp.tokens[0].name && matchesSearch(lp.tokens[0].name)) || (lp.tokens[1].symbol && matchesSearch(lp.tokens[1].symbol)) || (lp.tokens[1].name && matchesSearch(lp.tokens[1].name))
  })
}

export default filterOtherLPs

import { ChainId, Currency, CurrencyAmount, Token, TokenAmount, WRAPPED } from '@hyperjump-defi/sdk'
import getNetwork from './getNetwork'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  // eslint-disable-next-line no-nested-ternary
  const { config } = getNetwork()
  return chainId && currency === config.baseCurrency ? WRAPPED[chainId] : currency instanceof Token ? currency : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedToken(token: Token): Currency {
  const { config } = getNetwork()
  if (token.equals(WRAPPED[token.chainId])) return config.baseCurrency
  return token
}

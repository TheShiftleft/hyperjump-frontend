import { Currency, Token } from '@hyperjump-defi/sdk'
import getNetwork from './getNetwork'

export function currencyId(currency: Currency): string {
  const { config } = getNetwork()
  if (currency === config.baseCurrency) return config.networkToken.symbol
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

export default currencyId

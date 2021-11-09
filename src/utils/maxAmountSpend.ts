import { CurrencyAmount, JSBI } from '@hyperjump-defi/sdk'
import { MIN_ETH } from '../config'
import getNetwork from './getNetwork'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  if (!currencyAmount) return undefined
  const { config } = getNetwork()
  if (currencyAmount.currency === config.baseCurrency) {
    if (JSBI.greaterThan(currencyAmount.raw, MIN_ETH)) {
      return config.baseCurrencyAmount(JSBI.subtract(currencyAmount.raw, MIN_ETH))
    }
    return config.baseCurrencyAmount(JSBI.BigInt(0))
  }
  return currencyAmount
}

export default maxAmountSpend

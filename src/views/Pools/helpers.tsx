import { Pool } from 'state/types'

const MANUAL_POOL_COMPOUND_FREQUENCY = 1

const getAprData = (pool: Pool) => {
  const { earningTokenPrice, apr } = pool

  // special handling for tokens like tBTC or BIFI where the daily token rewards for $1000 dollars will be less than 0.001 of that token
  const isHighValueToken = Math.round(earningTokenPrice / 1000) > 0
  const roundingDecimals = isHighValueToken ? 4 : 2

  const compoundFrequency = MANUAL_POOL_COMPOUND_FREQUENCY

  return { apr, isHighValueToken, roundingDecimals, compoundFrequency }
}

export default getAprData
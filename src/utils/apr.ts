import BigNumber from 'bignumber.js'
import { FARM_TOKEN_PER_YEAR, BLOCKS_PER_YEAR } from 'config'
import getNetwork from './getNetwork'

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new tokens allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
): number => {
  const { config } = getNetwork()
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR[config.network])
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  // divide apr by 5 to account for mech alloy relation
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100).dividedBy(5)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param farmingTokenPriceUsd Farming token price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getFarmApr = (poolWeight: BigNumber, farmingTokenPriceUsd: BigNumber, poolLiquidityUsd: BigNumber): number => {
  const { config } = getNetwork()
  const yearlyRewardAllocation = FARM_TOKEN_PER_YEAR[config.network].times(poolWeight)
  const apr = yearlyRewardAllocation.times(farmingTokenPriceUsd).div(poolLiquidityUsd).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

export default null

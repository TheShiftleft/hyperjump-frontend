import React from 'react'
import { Flex, Text, Skeleton } from 'uikit'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from 'utils/formatBalance'
import { Pool } from 'state/types'
import Balance from 'components/Balance'

interface StakeActionsProps {
  pool: Pool
  stakingTokenBalance: BigNumber
  stakedBalance: BigNumber
  isStaked: ConstrainBoolean
  isLoading?: boolean
}

const StakeAction: React.FC<StakeActionsProps> = ({
  pool,
  stakedBalance,
  isLoading = false,
}) => {
  const { stakingToken, stakingTokenPrice } = pool
  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken.decimals,
  )

  return (
    <Flex flexDirection="column">
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        <Flex justifyContent="space-between" alignItems="center">
          <Flex flexDirection="column">
            <>
              <Balance bold fontSize="20px" decimals={3} value={stakedTokenBalance} />
              {stakingTokenPrice !== 0 && (
                <Text fontSize="12px" color="textSubtle">
                  <Balance
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    value={stakedTokenDollarBalance}
                    prefix="~"
                    unit=" USD"
                  />
                </Text>
              )}
            </>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}

export default StakeAction

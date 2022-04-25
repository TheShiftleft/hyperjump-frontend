import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Skeleton, Heading } from 'uikit'
import { usePriceFarmingTokenUsd } from 'state/hooks'
import Balance from 'components/Balance'
import { getBalanceNumber } from 'utils/formatBalance'
import getNetwork from 'utils/getNetwork'

const { config } = getNetwork()
const rewardToken = ` ${config.farmingToken.symbol}`

interface BurnDetailProps {
  farmingTokenAmount: BigNumber
}

const BurnDetail: React.FC<BurnDetailProps> = ({ farmingTokenAmount }) => {
  const farmingTokenPriceUsd = usePriceFarmingTokenUsd()
  const priceInUsd = farmingTokenAmount.times(farmingTokenPriceUsd)

  return (
    <Flex flexDirection="column">
      <Heading scale="lg" bold color="#d10504">
        Burn
      </Heading>
      <>
        {priceInUsd.isNaN() ? (
          <Skeleton my="2px" height={12} width={90} />
        ) : (
          <Balance
            fontSize="32px"
            color="#49ceeb"
            bold
            unit={rewardToken}
            value={getBalanceNumber(farmingTokenAmount)}
            decimals={0}
          />
        )}
        {priceInUsd.isNaN() ? (
          <Skeleton my="2px" height={12} width={70} />
        ) : (
          <Balance fontSize="14px" prefix="~$" value={getBalanceNumber(priceInUsd)} decimals={0} />
        )}
      </>
    </Flex>
  )
}

export default BurnDetail

import React from 'react'
import styled from 'styled-components'
import { Flex, Skeleton, Heading, Box, Text } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { LotteryRound } from 'state/types'
import { usePriceFarmingTokenUsd } from 'state/hooks'
import { useGetLotteryGraphDataById } from 'state/lottery/hooks'
import { formatNumber, getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import RewardBrackets from '../RewardBrackets'

const NextDrawWrapper = styled(Flex)`
  padding: 24px;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const PreviousRoundCardFooter: React.FC<{ lotteryData: LotteryRound; lotteryId: string }> = ({
  lotteryData,
  lotteryId,
}) => {
  // console.log('EXPANDED PROPS', lotteryData, lotteryId)
  const { t } = useTranslation()
  const { amountCollectedInFarmingToken } = lotteryData
  const lotteryGraphData = useGetLotteryGraphDataById(lotteryId)
  const farmingTokenPriceUsd = usePriceFarmingTokenUsd()
  const prizeInBusd = amountCollectedInFarmingToken.times(farmingTokenPriceUsd)
  // console.log("GRAPH DATA", lotteryGraphData)

  const getTotalUsers = () => {
    if (lotteryGraphData) {
      return lotteryGraphData?.totalUsers?.toLocaleString()
    }

    return null
  }

  return (
    <NextDrawWrapper>
      <RewardBrackets lotteryData={lotteryData} isHistoricRound totalUsers={getTotalUsers()} />
    </NextDrawWrapper>
  )
}

export default PreviousRoundCardFooter

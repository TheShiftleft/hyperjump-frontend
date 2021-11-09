import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Text, Heading, Skeleton } from 'uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { LotteryRound } from 'state/types'
import { usePriceFarmingTokenUsd } from 'state/hooks'
import { formatNumber, getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import getNetwork from 'utils/getNetwork'

import BurnDetail from './BurnDetail'
import RewardBracketDetail from './RewardBracketDetail'

const { config } = getNetwork()
const rewardToken = config.farmingToken.symbol

const Wrapper = styled(Flex)`
  width: 100%;
  flex-direction: column;

`
const RewardsInner = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  row-gap: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(4, 1fr);
  }
`

const GridItem = styled.div`
  grid-column: span 2;
`

interface RewardMatchesProps {
  lotteryData: LotteryRound
  isHistoricRound?: boolean
  totalUsers: string | null
}

const RewardBrackets: React.FC<RewardMatchesProps> = ({ lotteryData, isHistoricRound, totalUsers }) => {
  const { t } = useTranslation()
  const { treasuryFee, amountCollectedInFarmingToken, rewardsBreakdown, countWinnersPerBracket } = lotteryData

  const feeAsPercentage = new BigNumber(treasuryFee).div(100)
  const farmingTokenToBurn = feeAsPercentage.div(100).times(new BigNumber(amountCollectedInFarmingToken))
  const amountLessTreasuryFee = new BigNumber(amountCollectedInFarmingToken).minus(farmingTokenToBurn)

  const farmingTokenPriceUsd = usePriceFarmingTokenUsd()
  const prizeInBusd = amountCollectedInFarmingToken.times(farmingTokenPriceUsd)

  const getFarmingTokenRewards = (bracket: number) => {
    const shareAsPercentage = new BigNumber(rewardsBreakdown[bracket]).div(100)
    return amountLessTreasuryFee.div(100).times(shareAsPercentage)
  }

  const getPrizeBalances = () => {
    return (
      <>
        {prizeInBusd.isNaN() ? (
          <Skeleton my="7px" height={40} width={160} />
        ) : (
          <Heading scale="xl" lineHeight="1" color="#49ceeb">
            ~${formatNumber(getBalanceNumber(prizeInBusd), 0, 0)}
          </Heading>
        )}
        {prizeInBusd.isNaN() ? (
          <Skeleton my="2px" height={14} width={90} />
        ) : (
          <Balance
            fontSize="14px"
            color="textSubtle"
            unit="{rewardToken}"
            value={getBalanceNumber(amountCollectedInFarmingToken)}
            decimals={0}
          />
        )}
      </>
    )
  }

  return (
    <Wrapper>
      <RewardsInner>
        <GridItem>
          <Heading scale="lg">{t('Prize pot')}</Heading>
          {getPrizeBalances()}
          <Text fontSize="14px">
            {t('Total players this round')}: {totalUsers || <Skeleton height={14} width={31} />}
          </Text>
        </GridItem>
        <GridItem>
          <BurnDetail farmingTokenAmount={farmingTokenToBurn}/>
        </GridItem>

        <RewardBracketDetail
          rewardBracket={0}
          farmingTokenAmount={getFarmingTokenRewards(0)}
          numberWinners={countWinnersPerBracket[0]}
          isHistoricRound={isHistoricRound}
        />
        <RewardBracketDetail
          rewardBracket={1}
          farmingTokenAmount={getFarmingTokenRewards(1)}
          numberWinners={countWinnersPerBracket[1]}
          isHistoricRound={isHistoricRound}
        />
        <RewardBracketDetail
          rewardBracket={2}
          farmingTokenAmount={getFarmingTokenRewards(2)}
          numberWinners={countWinnersPerBracket[2]}
          isHistoricRound={isHistoricRound}
        />
        <RewardBracketDetail
          rewardBracket={3}
          farmingTokenAmount={getFarmingTokenRewards(3)}
          numberWinners={countWinnersPerBracket[3]}
          isHistoricRound={isHistoricRound}
        />
      </RewardsInner>
    </Wrapper>
  )
}

export default RewardBrackets

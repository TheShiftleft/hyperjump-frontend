import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Box, Flex, Text, Heading, Skeleton } from 'uikit'
import { useLottery } from 'state/lottery/hooks'
import { usePriceFarmingTokenUsd } from 'state/hooks'
import getNetwork from 'utils/getNetwork'
import { fetchLottery } from 'state/lottery/helpers'
import { LotteryStatus } from 'config/constants/types'
import useTheme from 'hooks/useTheme'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { processLotteryResponse } from '../helpers'
import { BallWithNumber, MatchExampleA, MatchExampleB, PoolAllocationChart } from '../svgs'
import RewardBracketDetail from './RewardBracketDetail'

const { config } = getNetwork()
const rewardToken = config.farmingToken.symbol

const Divider = styled.div`
  background-color: white;
  height: 3px;
  margin: 20px 15px;
  width: 100%;
`

const DetailsFlex = styled(Flex)`
  width: 800px;

  @media (max-width: 1024px) {
    width: 700px;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    width: 600px;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`

const DetailsFooterFlex = styled(Flex)`
  flex-direction: column;
  margin-right: 40px;

  @media (max-width: 1024px) {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    margin-top: 20px;
  }
`

const DetailsFooterFlexItems = styled(Flex)`
  align-items: center;

  @media (max-width: 1024px) {
    align-items: end;
  }
`

const MatchTextStroke = styled(Text)`
  margin-left: -40px;
  font-size: 165px;
  text-transform: uppercase;
  color: transparent;
  writing-mode: vertical-lr;
  -webkit-text-stroke-width: 4px;
  -webkit-text-stroke-color: #49ceeb;

  @media (max-width: 640px) {
    font-size: 125px;
  }
`

const BurnTextStroke = styled(Text)`
  font-size: 150px;
  text-transform: uppercase;
  color: transparent;
  writing-mode: tb-rl;

  background: linear-gradient(90deg, rgba(240, 11, 8, 1) 0%, rgba(255, 252, 2, 1) 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-stroke: 8px transparent;

  @media (max-width: 1024px) {
    font-size: 100px;
    writing-mode: horizontal-tb;
  }

  @media (max-width: 768px) {
    font-size: 80px;
  }

  @media (max-width: 640px) {
    font-size: 60px;
  }
`

const NumberImg = styled.img`
  width: 90px;
  margin-right: 40px;
  height: auto;

  @media (max-width: 640px) {
    width: 50px;
    height: 50px;
  }
`

const RowFlex = styled(Flex)`
  margin: 15px 0;

  @media (max-width: 1024px) {
    width: 100%;
    width: 500px;
    justify-content: space-between;
  }

  @media (max-width: 768px) {
    width: 450px;
  }

  @media (max-width: 640px) {
    width: 300px;
  }

  @media (max-width: 500px) {
    width: 200px;
  }
`

const PrizeTotalBalance = styled(Balance)`
  background: #fe0001;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  font-size: 64px;
`

const HeadingContainer = styled.div`
  ${({ theme }) => theme.mediaQueries.sm} {
    white-space: nowrap;
    > * {
      display: inline-block;
    }
  }

  font-size: 24px;
  color: #fe0001;
`

const Highlight = styled.span`
  text-align: left;
  font-size: 24px;
  font-weight: 400;
  font-family: 'Bebas Neue', cursive;
  line-height: 1.1;
  color: #49ceeb;
`

const HowToPlay: React.FC = () => {
  const {
    currentLotteryId,
    currentRound: {
      status,
      isLoading,
      rewardsBreakdown,
      countWinnersPerBracket,
      amountCollectedInFarmingToken,
      treasuryFee,
    },
  } = useLottery()

  const feeAsPercentage = new BigNumber(treasuryFee).div(100)
  const farmingTokenToBurn = feeAsPercentage.div(100).times(new BigNumber(amountCollectedInFarmingToken)).toString()
  const amountLessTreasuryFee = new BigNumber(amountCollectedInFarmingToken).minus(farmingTokenToBurn)

  const getFarmingTokenRewards = (bracket: number) => {
    const shareAsPercentage = new BigNumber(rewardsBreakdown[bracket]).div(100)
    return amountLessTreasuryFee.div(100).times(shareAsPercentage)
  }

  const amountCollectedParsed = getBalanceNumber(amountCollectedInFarmingToken)
  const farmingTokenPriceUsd = usePriceFarmingTokenUsd()
  const burnAmount: number = Number(amountCollectedParsed) * 0.2
  const burnAmountInUsd = new BigNumber(burnAmount).times(farmingTokenPriceUsd)

  return (
    <Box width="100%">
      <Flex mb="40px" alignItems="center" flexDirection="column">
        <Flex width="100%" alignItems="center">
          <Divider />
          <Heading mt="5px" scale="xl" color="#44c4e2">
            Details
          </Heading>
          <Divider />
        </Flex>

        <Text textAlign="center">
          Match the winning number in the same order to share prizes. Current up for grabs:
        </Text>
      </Flex>

      <DetailsFlex justifyContent="space-between">
        <Flex>
          <MatchTextStroke>MATCH</MatchTextStroke>
          <Flex flexDirection="column" ml="-40px" justifyContent="space-between">
            <RowFlex>
              <NumberImg src="/images/lottery/1.png" />
              <RewardBracketDetail
                rewardBracket={0}
                farmingTokenAmount={getFarmingTokenRewards(0)}
                numberWinners={countWinnersPerBracket[0]}
                isHistoricRound={false}
              />
            </RowFlex>
            <RowFlex>
              <NumberImg src="/images/lottery/2.png" />
              <RewardBracketDetail
                rewardBracket={1}
                farmingTokenAmount={getFarmingTokenRewards(1)}
                numberWinners={countWinnersPerBracket[1]}
                isHistoricRound={false}
              />
            </RowFlex>
            <RowFlex>
              <NumberImg src="/images/lottery/3.png" />
              <RewardBracketDetail
                rewardBracket={2}
                farmingTokenAmount={getFarmingTokenRewards(2)}
                numberWinners={countWinnersPerBracket[2]}
                isHistoricRound={false}
              />
            </RowFlex>
            <RowFlex>
              <NumberImg src="/images/lottery/4.png" />
              <RewardBracketDetail
                rewardBracket={3}
                farmingTokenAmount={getFarmingTokenRewards(3)}
                numberWinners={countWinnersPerBracket[3]}
                isHistoricRound={false}
              />
            </RowFlex>
          </Flex>
        </Flex>

        <DetailsFooterFlex>
          <DetailsFooterFlexItems flexDirection="column" justifyContent="center">
            <HeadingContainer>
              {amountCollectedInFarmingToken !== null ? (
                <PrizeTotalBalance bold value={burnAmount} decimals={0} />
              ) : (
                <Skeleton my="7px" height={60} width={190} />
              )}
              <Heading color="#fe0001" scale="xxl">
                &nbsp;{rewardToken}
              </Heading>
            </HeadingContainer>

            {burnAmountInUsd.isNaN() ? (
              <Skeleton my="2px" height={12} width={70} />
            ) : (
              <Balance fontSize="20px" prefix="~$" value={Number(burnAmountInUsd)} decimals={0} />
            )}
          </DetailsFooterFlexItems>

          <DetailsFooterFlexItems flexDirection="column">
            <Heading>{feeAsPercentage.toString()}% of prize pot</Heading>
            <BurnTextStroke>BURN</BurnTextStroke>
          </DetailsFooterFlexItems>
        </DetailsFooterFlex>
      </DetailsFlex>
    </Box>
  )
}

export default HowToPlay

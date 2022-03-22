import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Heading, Card, CardBody, Flex, Text, Button } from 'uikit'
import { useFetchLottery, useLottery } from 'state/lottery/hooks'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import getNetwork from 'utils/getNetwork'
import { LotteryStatus } from 'config/constants/types'
import useGetNextLotteryEvent from '../../Lottery/hooks/useGetNextLotteryEvent'
import Countdown from '../../Lottery/components/Countdown'

const { config } = getNetwork()
const rewardToken = ` ${config.farmingToken.symbol}`

const WinCard = () => {
  useFetchLottery()
  const { t } = useTranslation()
  const {
    currentRound: { amountCollectedInFarmingToken, status, endTime },
    isTransitioning,
  } = useLottery()
  const endTimeAsInt = parseInt(endTime, 10)
  const { nextEventTime, postCountdownText, preCountdownText } = useGetNextLotteryEvent(endTimeAsInt, status)

  const openBeforeEndtime = status === LotteryStatus.OPEN && endTimeAsInt < Date.now()
  const openAfterEndtime = status === LotteryStatus.OPEN && endTimeAsInt >= Date.now()
  const d = new Date(endTimeAsInt * 1000)
  const amountCollectedParsed = getBalanceNumber(amountCollectedInFarmingToken).toFixed(0)
  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Flex justifyContent="space-between" alignItems="flex-end">
          <Flex flexDirection="column">
            <Heading fontFamily="Bebas neue" color="primary" scale="xl">
              {t('LOTTERY')}
            </Heading>
            <Heading>GOT YOUR TICKETS YET?</Heading>
          </Flex>

          {status === LotteryStatus.OPEN && (
            <>
              <Flex flexDirection="column">
                <Countdown
                  nextEventTime={nextEventTime}
                  postCountdownText={postCountdownText}
                  preCountdownText={preCountdownText}
                />
              </Flex>
            </>
          )}
        </Flex>

        <Flex justifyContent="space-between" alignItems="flex-end">
          {status === LotteryStatus.PENDING && (
            <>
              <Flex flexDirection="column">
                <Text color="primary" mt="15px">
                  Hyper Pot this Round
                </Text>
                <Heading scale="lg">
                  Next lottery starting soon...
                </Heading>
              </Flex>

              <NavLink to="/lottery">
                <EarningsButton>
                  <Text color="black" fontSize="14px">
                    CHECK YOUR
                  </Text>
                  EARNINGS
                </EarningsButton>
              </NavLink>
            </>
          )}

          {status === LotteryStatus.OPEN && (
            <>
              <Flex flexDirection="column">
                <Text color="primary" mt="15px">
                  Hyper Pot this Round
                </Text>
                <Heading scale="lg">
                  {amountCollectedParsed} {rewardToken}
                </Heading>
              </Flex>
              <NavLink to="/lottery">
                <EarningsButton>
                  <Text color="black" fontSize="14px">
                    CHECK YOUR
                  </Text>
                  EARNINGS
                </EarningsButton>
              </NavLink>
            </>
          )}

          {status === LotteryStatus.CLOSE && (
            <>
              <Flex flexDirection="column">
                <Text color="primary" mt="15px">
                  Hyper Pot this Round
                </Text>
                <Heading scale="lg">
                  {amountCollectedParsed} {rewardToken}
                </Heading>
                <Flex>
                  <Text ml="15px">Tickets are closed!</Text>
                </Flex>
              </Flex>

              <NavLink to="/lottery">
                <EarningsButton>
                  <Text color="black" fontSize="14px">
                    CHECK YOUR
                  </Text>
                  EARNINGS
                </EarningsButton>
              </NavLink>
            </>
          )}

          {status === LotteryStatus.CLAIMABLE && (
            <>
              <Flex flexDirection="column">
                <Text color="primary" mt="15px">
                  Hyper Pot this Round
                </Text>
                <Heading scale="lg">
                  {amountCollectedParsed} {rewardToken}
                </Heading>
                <Flex>
                  <Text ml="15px">Claim your prizes now!</Text>
                </Flex>
              </Flex>

              <NavLink to="/lottery">
                <EarningsButton>
                  <Text color="black" fontSize="14px">
                    CHECK YOUR
                  </Text>
                  EARNINGS
                </EarningsButton>
              </NavLink>
            </>
          )}
        </Flex>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default WinCard

const StyledFarmStakingCard = styled(Card)`
  background-color: rgba(2, 5, 11, 0.7);
  border-radius: 50px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;

  &::after {
    content: '';
    background-image: url('images/dashboard/roullete.png');
    background-repeat: no-repeat;
    background-size: 250px auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-position: right -50px top -10px;
    position: absolute;
    z-index: -1;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
`

const EarningsButton = styled(Button)`
  border-radius: 5px;
  color: black;
  font-size: 18px;
  padding: 10px 7px;
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

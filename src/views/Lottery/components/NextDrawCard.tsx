import React, { useState } from 'react'
import styled from 'styled-components'
import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Heading,
  Text,
  Skeleton,
  Button,
  useModal,
  Box,
  CardFooter,
  ExpandableLabel,
} from 'uikit'
import { useWeb3React } from '@web3-react/core'
import { LotteryStatus } from 'config/constants/types'
import { usePriceFarmingTokenUsd } from 'state/hooks'
import { useLottery } from 'state/lottery/hooks'
import getNetwork from 'utils/getNetwork'
import { fetchUserTicketsForOneRound } from 'state/lottery/getUserTicketsData'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import ViewTicketsModal from './ViewTicketsModal'
import BuyTicketsButton from './BuyTicketsButton'
import { dateTimeOptions } from '../helpers'
import RewardBrackets from './RewardBrackets'

const { config } = getNetwork()
const rewardToken = ` ${config.farmingToken.symbol}`

const Grid = styled.div`
  display: grid;
  grid-template-columns: auto;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-column-gap: 32px;
    grid-template-columns: auto 1fr;
  }
`

const StyledCard = styled(Card)`
  background-color: rgba(2, 5, 11, 0.5);
  border-radius: 20px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 520px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 756px;
  }
`

const StyledCardHeader = styled(CardHeader)`
  background: rgba(2, 5, 11, 0.7);
`

const NextDrawWrapper = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: 24px;
`

const NextDrawCard = () => {
  const { account } = useWeb3React()
  const { currentLotteryId, isTransitioning, currentRound } = useLottery()
  const { endTime, amountCollectedInFarmingToken, userTickets, status } = currentRound
  const [onPresentViewTicketsModal] = useModal(<ViewTicketsModal roundId={currentLotteryId} roundStatus={status} />)
  const [isExpanded, setIsExpanded] = useState(false)
  const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning

  const farmingTokenPriceBusd = usePriceFarmingTokenUsd()
  const prizeInBusd = amountCollectedInFarmingToken.times(farmingTokenPriceBusd)
  const endTimeMs = parseInt(endTime, 10) * 1000
  const endDate = new Date(endTimeMs)
  const isLotteryOpen = status === LotteryStatus.OPEN
  const userTicketCount = userTickets?.tickets?.length || 0

  const getPrizeBalances = () => {
    if (status === LotteryStatus.CLOSE || status === LotteryStatus.CLAIMABLE) {
      return (
        <Heading scale="xl" textAlign={['center', null, null, 'left']}>
          Pending...
        </Heading>
      )
    }
    return (
      <>
        {prizeInBusd.isNaN() ? (
          <Skeleton my="7px" height={40} width={160} />
        ) : (
          <Balance
            fontSize="40px"
            marginRight="15px"
            color="#44c4e2"
            textAlign={['center', null, null, 'left']}
            lineHeight="1"
            bold
            prefix="~$"
            value={getBalanceNumber(prizeInBusd)}
            decimals={0}
          />
        )}
        {prizeInBusd.isNaN() ? (
          <Skeleton my="2px" height={14} width={90} />
        ) : (
          <Balance
            fontSize="24px"
            color="white"
            textAlign={['center', null, null, 'left']}
            unit={rewardToken}
            value={getBalanceNumber(amountCollectedInFarmingToken)}
            decimals={0}
          />
        )}
      </>
    )
  }

  const getNextDrawId = () => {
    if (status === LotteryStatus.OPEN) {
      return `${currentLotteryId} |`
    }
    if (status === LotteryStatus.PENDING) {
      return ''
    }
    return parseInt(currentLotteryId, 10) + 1
  }

  const getNextDrawDateTime = () => {
    if (status === LotteryStatus.OPEN) {
      return `Draw: ${endDate.toLocaleString(undefined, dateTimeOptions)}`
    }
    return ''
  }

  return (
    <StyledCard>
      <StyledCardHeader p="16px 24px">
        <Flex>
          <Heading mr="12px">Next Draw</Heading>
          <Heading color="#44c4e2">
            {currentLotteryId && `#${getNextDrawId()}`} {Boolean(endTime) && getNextDrawDateTime()}
          </Heading>
        </Flex>
      </StyledCardHeader>
      <CardBody>
        <Grid>
          <Flex justifyContent={['center', null, null, 'flex-start']}>
            <Heading>Prize Pot</Heading>
          </Flex>
          <Flex mb="18px">{getPrizeBalances()}</Flex>
        </Grid>
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
          {isLotteryOpen && (
            <>
              {account && (
                <Flex justifyContent={['center', null, null, 'flex-start']}>
                  <Text display="inline">You have </Text>
                  {!userTickets.isLoading ? (
                    <Balance value={userTicketCount} decimals={0} unit="tickets" display="inline" bold mx="4px" />
                  ) : (
                    <Balance value={userTicketCount} decimals={0} unit="tickets" display="inline" bold mx="4px" />
                  )}
                  <Text display="inline"> this round</Text>
                </Flex>
              )}
              {!userTickets.isLoading && userTicketCount > 0 && (
                <Button
                  onClick={onPresentViewTicketsModal}
                  height="auto"
                  width="fit-content"
                  p="0"
                  mb="32px"
                  variant="text"
                  scale="sm"
                >
                  View your tickets
                </Button>
              )}
            </>
          )}
          <BuyTicketsButton disabled={ticketBuyIsDisabled} maxWidth="280px" />
        </Flex>
      </CardBody>
    </StyledCard>
  )
}

export default NextDrawCard

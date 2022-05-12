import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Flex, Heading, Skeleton } from 'uikit'
import { LotteryStatus } from 'config/constants/types'
import { useFetchLottery, useLottery } from 'state/lottery/hooks'
import useGetNextLotteryEvent from '../hooks/useGetNextLotteryEvent'
import Countdown from './Countdown'

const TicketCountdownFlex = styled(Flex)`
  align-items: center;
  justify-content: center;
  padding-top: 24px;
  width: 100%;

  @media (max-width: 1024px) {
    flex-direction: column;
    justify-content: space-between;
  }
`

const HeadingContainer = styled.div`
  white-space: nowrap;
  margin: 0 20px;
  > * {
    display: inline-block;
  }
  font-size: 24px;
`

const Highlight = styled.span`
  text-align: left;
  font-size: 24px;
  font-weight: 400;
  font-family: 'Bebas Neue', cursive;
  line-height: 1.1;
  color: #49ceeb;
`

const LotteryTicket = styled.img`
  transform: rotate(13deg);
  height: 200px;

  @media (max-width: 1024px) {
    height: 100px;
    margin: 10px 0;
  }
`

const TicketCountdown = () => {
  useFetchLottery()

  const {
    currentRound: { status, endTime },
  } = useLottery()
  const endTimeAsInt = parseInt(endTime, 10)
  const { nextEventTime, postCountdownText, preCountdownText } = useGetNextLotteryEvent(endTimeAsInt, status)

  const openBeforeEndtime = status === LotteryStatus.OPEN && endTimeAsInt < Date.now()
  const openAfterEndtime = status === LotteryStatus.OPEN && endTimeAsInt >= Date.now()

  return (
    <TicketCountdownFlex>
      {openBeforeEndtime && (
        <>
          <HeadingContainer>
            <Heading scale="lg">Lottery disabled until the next round!</Heading>
          </HeadingContainer>

          <LotteryTicket src="/images/lottery/lottery_ticket.png" />

          <HeadingContainer>
            {nextEventTime && (postCountdownText || preCountdownText) ? (
              <Countdown
                nextEventTime={nextEventTime}
                postCountdownText={postCountdownText}
                preCountdownText={preCountdownText}
              />
            ) : (
              <Skeleton height="41px" width="250px" />
            )}
          </HeadingContainer>
        </>
      )}

      {(status === LotteryStatus.CLOSE || openAfterEndtime) && (
        <>
          <HeadingContainer>
            <Heading scale="lg">{'Tickets are closed '}</Heading>
          </HeadingContainer>

          <LotteryTicket src="/images/lottery/lottery_ticket.png" />

          <HeadingContainer>
            <Highlight>Rewards&nbsp;</Highlight>
            <Heading scale="lg">{'claimable soon... '}</Heading>
          </HeadingContainer>
        </>
      )}

      {(status === LotteryStatus.CLAIMABLE || status === LotteryStatus.PENDING) && (
        <>
          <HeadingContainer>
            <Heading scale="lg">{'Claim your '}</Heading>
            <Highlight>&nbsp;Rewards&nbsp;</Highlight>
            <Heading scale="lg">now !!!</Heading>
          </HeadingContainer>

          <LotteryTicket src="/images/lottery/lottery_ticket.png" />

          <HeadingContainer>
            <Heading scale="lg">Next</Heading>
            <Highlight>&nbsp;lottery&nbsp;</Highlight>
            <Heading scale="lg">announced soon</Heading>
          </HeadingContainer>
        </>
      )}
    </TicketCountdownFlex>
  )
}

export default TicketCountdown

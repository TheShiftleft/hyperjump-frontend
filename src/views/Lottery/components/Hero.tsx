import React from 'react'
import styled, { keyframes } from 'styled-components'
// import { ethers, BigNumber } from 'ethers'
import { Box, Flex, Heading, Skeleton } from 'uikit'
import getNetwork from 'utils/getNetwork'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { usePriceFarmingTokenUsd } from 'state/hooks'
import { useLottery } from 'state/lottery/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
// import { TicketPurchaseCard } from '../svgs'
import BuyTicketsButton from './BuyTicketsButton'

const { config } = getNetwork()
const rewardToken = ` ${config.farmingToken.symbol}`

const mainTicketAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(0deg);
  }  
`

const PrizeTotalBalance = styled(Balance)`
  background: white;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const StyledBuyTicketButton = styled(BuyTicketsButton)<{ disabled: boolean }>`
  background: ${({ theme, disabled }) => (disabled ? theme.colors.disabled : 'light-blue')};
  width: 140px;
`

const Decorations = styled.img`
  height: 80px;
  width: auto;
  margin-top: -30px;
`

const HeadingContainer = styled.div`
  white-space: nowrap;
  margin: 10px 0 20px 0;
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

const AlloyHeadingContainer = styled.div`
  white-space: nowrap;
  margin: 30px 20px 50px 0;
  > * {
    display: inline-block;
  }
  font-size: 24px;
`

const AlloyHighlight = styled.span`
  text-align: left;
  font-size: 50px;
  font-weight: 400;
  font-family: 'Bebas Neue', cursive;
  line-height: 1.1;
  color: #49ceeb;
`

const Hero = () => {
  const { t } = useTranslation()
  const {
    currentRound: { amountCollectedInFarmingToken, status },
    isTransitioning,
  } = useLottery()

  // console.log('Amount collected', amountCollectedInFarmingToken.toString())
  const amountCollectedParsed = getBalanceNumber(amountCollectedInFarmingToken)
  const farmingTokenPriceUsd = usePriceFarmingTokenUsd()
  const prizeInBusd = amountCollectedInFarmingToken.times(farmingTokenPriceUsd)
  const prizeTotal = getBalanceNumber(prizeInBusd)
  const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning

  const getHeroHeading = () => {
    if (status === LotteryStatus.OPEN) {
      return (
        <>
          {amountCollectedInFarmingToken !== null ? (
            <PrizeTotalBalance fontSize="64px" bold value={amountCollectedParsed} mb="8px" decimals={0} />
          ) : (
            <Skeleton my="7px" height={60} width={190} />
          )}

          <AlloyHeadingContainer>
            <AlloyHighlight>{rewardToken}&nbsp;</AlloyHighlight>
            <Heading scale="xl">{t('in the prize pool')}</Heading>
          </AlloyHeadingContainer>
        </>
      )
    }
    return (
      <Heading mb="24px" scale="xl" color="#ffffff">
        {t('Tickets on sale soon')}
      </Heading>
    )
  }

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <Decorations src="/images/hyperjump-full-logo.png" />
      <HeadingContainer>
        <Highlight>Galactic&nbsp;</Highlight>
        <Heading scale="lg">{t('lottery')}</Heading>
      </HeadingContainer>
      {getHeroHeading()}
      <StyledBuyTicketButton disabled={ticketBuyIsDisabled} />
    </Flex>
  )
}

export default Hero

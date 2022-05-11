import React, { useState } from 'react'
import styled from 'styled-components'
import getNetwork from 'utils/getNetwork'
import { Box, Flex, Heading, Skeleton } from 'uikit'
import { LotteryStatus } from 'config/constants/types'
import PageSection from 'components/PageSection'
import useTheme from 'hooks/useTheme'
import { useFetchLottery, useLottery } from 'state/lottery/hooks'
import { TITLE_BG, GET_TICKETS_BG, TRANSPARENT_BG } from './pageSectionStyles'
import useGetNextLotteryEvent from './hooks/useGetNextLotteryEvent'
import useStatusTransitions from './hooks/useStatusTransitions'
import Hero from './components/Hero'
import TicketCountdownDisabled from './components/TicketCountdownDisabled'
import TicketCountdown from './components/TicketCountdown'
import NextDrawCard from './components/NextDrawCard'
import HistoryTabMenu from './components/HistoryTabMenu'
import YourHistoryCard from './components/YourHistoryCard'
import AllHistoryCard from './components/AllHistoryCard'
import CheckPrizesSection from './components/CheckPrizesSection'
import HowToPlay from './components/HowToPlay'

const LotteryPage = styled.div`
  min-height: calc(100vh - 64px);
`

const NextDrawSection = styled(PageSection)`
  background-image: url('images/lottery/tickets.png');
  background-position: left bottom;
  background-repeat: no-repeat;
  background-size: 120px auto;

  ${({ theme }) => theme.mediaQueries.sm} {
    background-size: auto 75%;
  }
`

const HeroSection = styled(PageSection)`
  background: url(/images/dashboard/roullete.png), url(/images/dashboard/roullete.png);
  background-size: 400px auto, 500px auto;
  background-position: -100px -10px, right -100px top -100px;
  background-repeat: no-repeat;

  @media (max-width: 768px) {
    background-position: -200px -10px, left 380px top -100px;
  }

  @media (max-width: 600px) {
    background-position: -200px -10px, left 260px top -100px;
  }
`

const HistoryFlex = styled(Flex)`
  @media (max-width: 600px) {
    width: 350px;
  }
`

const { chainId } = getNetwork()
const Lottery = () => {
  useFetchLottery()
  useStatusTransitions()

  const { theme } = useTheme()
  const {
    currentRound: { status, endTime },
  } = useLottery()
  const [historyTabMenuIndex, setHistoryTabMenuIndex] = useState(0)
  const endTimeAsInt = parseInt(endTime, 10)
  return (
    <LotteryPage>
      {chainId && chainId !== 666 ? (
        <>
          <HeroSection background={TITLE_BG} svgFill={theme.colors.overlay} index={1} hasCurvedDivider={false}>
            <Hero />
          </HeroSection>
          <PageSection background={GET_TICKETS_BG} curvePosition="both" index={2} width="100%">
            <TicketCountdown />
          </PageSection>
          <NextDrawSection index={2} hasCurvedDivider={false} background={TRANSPARENT_BG}>
            <NextDrawCard />
          </NextDrawSection>
          <PageSection hasCurvedDivider={false} background={TRANSPARENT_BG} index={2}>
            <HistoryFlex width="100%" flexDirection="column" alignItems="center" justifyContent="center">
              <CheckPrizesSection />
              <Heading mt="18px" mb="12px" scale="lg">
                Finished Rounds
              </Heading>
              <Box mb="24px">
                <HistoryTabMenu
                  activeIndex={historyTabMenuIndex}
                  setActiveIndex={(index) => setHistoryTabMenuIndex(index)}
                />
              </Box>
              {historyTabMenuIndex === 0 ? <YourHistoryCard /> : <AllHistoryCard />}
            </HistoryFlex>
          </PageSection>
          <PageSection background={TRANSPARENT_BG} hasCurvedDivider={false} index={2}>
            <HowToPlay />
          </PageSection>
        </>
      ) : (
        <>
          <HeroSection background={TITLE_BG} svgFill={theme.colors.overlay} index={1} hasCurvedDivider={false}>
            <TicketCountdownDisabled />
          </HeroSection>
        </>
      )}
    </LotteryPage>
  )
}

export default Lottery

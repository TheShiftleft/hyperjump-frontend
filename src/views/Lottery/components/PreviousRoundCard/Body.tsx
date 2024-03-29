import React from 'react'
import styled from 'styled-components'
import { CardBody, Heading, Flex, Skeleton, Text, Box, Button, useModal, CardRibbon, useMatchBreakpoints } from 'uikit'
import { LotteryRound } from 'state/types'
import { useGetUserLotteriesGraphData, useLottery } from 'state/lottery/hooks'
import { LotteryStatus } from 'config/constants/types'
import WinningNumbers from '../WinningNumbers'
import ViewTicketsModal from '../ViewTicketsModal'

const StyledCardBody = styled(CardBody)`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: auto;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-column-gap: 72px;
    grid-row-gap: 36px;
    grid-template-columns: auto 1fr;
  }
`

const StyedCardRibbon = styled(CardRibbon)`
  right: -20px;
  top: -20px;

  ${({ theme }) => theme.mediaQueries.xs} {
    right: -10px;
    top: -10px;
  }
`

const PreviousRoundCardBody: React.FC<{ lotteryData: LotteryRound; lotteryId: string }> = ({
  lotteryData,
  lotteryId,
}) => {
  const {
    currentLotteryId,
    currentRound: { status },
  } = useLottery()
  const userLotteryData = useGetUserLotteriesGraphData()
  const userDataForRound = userLotteryData.rounds.find((userLotteryRound) => userLotteryRound.lotteryId === lotteryId)
  // console.log("userDataForRound", userDataForRound)
  const { isLg, isXl } = useMatchBreakpoints()
  const isDesktop = isLg || isXl

  const currentLotteryIdAsInt = parseInt(currentLotteryId)
  const mostRecentFinishedRoundId =
    status === LotteryStatus.CLAIMABLE ? currentLotteryIdAsInt : currentLotteryIdAsInt - 1
  const isLatestRound = mostRecentFinishedRoundId.toString() === lotteryId

  const [onPresentViewTicketsModal] = useModal(
    <ViewTicketsModal roundId={lotteryId} roundStatus={lotteryData?.status} />,
  )

  return (
    <StyledCardBody>
      {isLatestRound && <StyedCardRibbon text="Latest" />}
      <Flex flexDirection="column" justifyContent="center" alignItems="center">
        <Heading mb="12px">Winning Numbers</Heading>
        <Flex maxWidth={['370px', null, null, '100%']} justifyContent={['center', null, null, 'flex-start']}>
          {lotteryData ? (
            <WinningNumbers
              rotateText={isDesktop || false}
              number={lotteryData?.finalNumber.toString()}
              mr={[null, null, null, '32px']}
              size="100%"
              fontSize={isDesktop ? '42px' : '16px'}
            />
          ) : (
            <Skeleton
              width={['240px', null, null, '450px']}
              height={['34px', null, null, '71px']}
              mr={[null, null, null, '32px']}
            />
          )}
        </Flex>
        {userDataForRound && (
          <>
            <Box display={['none', null, null, 'flex']} mt="10px">
              <Heading>Your tickets</Heading>
            </Box>
            <Flex flexDirection="column" alignItems="center">
              <Box mt={['32px', null, null, 0]}>
                <Text display="inline">You had </Text>
                <Text display="inline" bold>
                  {userDataForRound.totalTickets} {'tickets'}{' '}
                </Text>
                <Text display="inline">this round</Text>
              </Box>
              <Button
                onClick={onPresentViewTicketsModal}
                height="auto"
                width="fit-content"
                p="0"
                variant="text"
                scale="sm"
              >
                View your tickets
              </Button>
            </Flex>
          </>
        )}
      </Flex>
    </StyledCardBody>
  )
}

export default PreviousRoundCardBody

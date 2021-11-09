import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { CardHeader, Card, CardBody, Text, CardFooter, ArrowBackIcon, Flex, Heading, Skeleton, Box } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { LotteryStatus } from 'config/constants/types'
import { useGetUserLotteriesGraphData, useLottery } from 'state/lottery/hooks'
import { fetchLottery } from 'state/lottery/helpers'
import { LotteryRound } from 'state/types'
import useAuth from 'hooks/useAuth'
import UserBlock from 'uikit/widgets/Menu/components/UserBlock'
import FinishedRoundTable from './FinishedRoundTable'
import BuyTicketsButton from '../BuyTicketsButton'
import PreviousRoundCardBody from '../PreviousRoundCard/Body'
import { processLotteryResponse, getDrawnDate } from '../../helpers'
import PreviousRoundCardFooter from '../PreviousRoundCard/Footer'

const StyledCard = styled(Card)`
  width: 100%;
  background-color: rgba(2, 5, 11, 0.5);
  border-radius: 20px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 756px;
  }
`

const StyledCardBody = styled(CardBody)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 240px;
`

const LotteryCardHeader = styled(CardHeader)`
  background: rgba(2, 5, 11, 0.7);
  text-transform: uppercase;
  font-family: 'Coda';
  font-size: 28px;
`

const LotteryCardBody = styled(CardBody)`
  background: rgba(2, 5, 11, 0.7);
`

const LotteryCardFooter = styled(CardFooter)`
  background: rgba(2, 5, 11, 0.7);
  border:none;
`

const StyledHeader = styled(Text)`
  text-transform: uppercase;
  font-family: 'Coda';
  font-size: 16px;
  color: #44c4e2;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 24px;
  }
`


const YourHistoryCard = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const [shouldShowRoundDetail, setShouldShowRoundDetail] = useState(false)
  const [selectedLotteryInfo, setSelectedLotteryInfo] = useState<LotteryRound>(null)
  const [selectedLotteryId, setSelectedLotteryId] = useState<string>(null)

  const {
    isTransitioning,
    currentRound: { status },
  } = useLottery()
  const userLotteryData = useGetUserLotteriesGraphData()
  const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning

  const handleHistoryRowClick = async (lotteryId: string) => {
    setShouldShowRoundDetail(true)
    setSelectedLotteryId(lotteryId)
    const lotteryData = await fetchLottery(lotteryId)
    const processedLotteryData = processLotteryResponse(lotteryData)
    setSelectedLotteryInfo(processedLotteryData)
  }

  const clearState = () => {
    setShouldShowRoundDetail(false)
    setSelectedLotteryInfo(null)
    setSelectedLotteryId(null)
  }

  const getHeader = () => {
    if (shouldShowRoundDetail) {
      return (
        <Flex alignItems="center">
          <ArrowBackIcon cursor="pointer" onClick={() => clearState()} mr="20px" />
          <Flex flexDirection="column" alignItems="flex-start" justifyContent="center">
            <Flex alignItems="center">
              <StyledHeader mr="18px">
                {t('Round')} {selectedLotteryId || ''}
              </StyledHeader>
              {selectedLotteryInfo?.endTime ? (
                <Text fontSize="14px">
                  {t('Drawn')} {getDrawnDate(selectedLotteryInfo.endTime)}
                </Text>
              ) : (
                <Skeleton width="185px" height="21px" />
              )}
            </Flex>
          </Flex>
        </Flex>
      )
    }

    return <StyledHeader>{t('Rounds')}</StyledHeader>
  }

  const getBody = () => {
    if (shouldShowRoundDetail) {
      return <PreviousRoundCardBody lotteryData={selectedLotteryInfo} lotteryId={selectedLotteryId} />
    }

    const claimableRounds = userLotteryData?.rounds.filter((round) => {
      return round.status.toLowerCase() === LotteryStatus.CLAIMABLE
    })

    if (!account) {
      return (
        <StyledCardBody>
          <Text textAlign="center" color="textSubtle" mb="16px">
            {t('Connect your wallet to check your history')}
          </Text>
          <UserBlock account={account} login={login} logout={logout} />
        </StyledCardBody>
      )
    }
    if (claimableRounds.length === 0) {
      return (
        <StyledCardBody>
          <Box maxWidth="280px">
            <Text textAlign="center">{t('No lottery history found')}</Text>
            <Text textAlign="center" color="textSubtle" mb="16px">
              {t('Buy tickets for the next round!')}
            </Text>
            <BuyTicketsButton disabled={ticketBuyIsDisabled} width="100%" />
          </Box>
        </StyledCardBody>
      )
    }
    return <FinishedRoundTable handleHistoryRowClick={handleHistoryRowClick} />
  }

  const getFooter = () => {
    if (selectedLotteryInfo) {
      return <PreviousRoundCardFooter lotteryData={selectedLotteryInfo} lotteryId={selectedLotteryId} />
    }
    return (
      <>
      </>
    )
  }

  return (
    <StyledCard>
      <LotteryCardHeader>{getHeader()}</LotteryCardHeader>
      {getBody()}
      {getFooter()}
    </StyledCard>
  )
}

export default YourHistoryCard

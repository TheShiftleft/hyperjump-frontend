import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Card, Text, Skeleton, CardHeader, Box } from 'uikit'
import { useLottery } from 'state/lottery/hooks'
import { fetchLottery } from 'state/lottery/helpers'
import { LotteryStatus } from 'config/constants/types'
import RoundSwitcher from './RoundSwitcher'
import { processLotteryResponse } from '../../helpers'
import PreviousRoundCardBody from '../PreviousRoundCard/Body'
import PreviousRoundCardFooter from '../PreviousRoundCard/Footer'

const StyledCard = styled(Card)`
  width: 100%;
  background-color: rgba(2, 5, 11, 0.5);
  border-radius: 20px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 756px;
  }
`

const StyledCardHeader = styled(CardHeader)`
  z-index: 2;
  background: rgba(2, 5, 11, 0.7);
`

const AllHistoryCard = () => {
  const {
    currentLotteryId,
    currentRound: { status, isLoading },
  } = useLottery()
  const currentLotteryIdAsInt = parseInt(currentLotteryId)
  const mostRecentFinishedRoundId =
    status === LotteryStatus.CLAIMABLE ? currentLotteryIdAsInt : currentLotteryIdAsInt - 1
  const [selectedRoundId, setSelectedRoundId] = useState(mostRecentFinishedRoundId.toString())
  const [selectedLotteryInfo, setSelectedLotteryInfo] = useState(null)
  const timer = useRef(null)

  useEffect(() => {
    setSelectedLotteryInfo(null)

    const fetchLotteryData = async () => {
      const lotteryData = await fetchLottery(selectedRoundId)
      const processedLotteryData = processLotteryResponse(lotteryData)
      setSelectedLotteryInfo(processedLotteryData)
    }

    timer.current = setInterval(() => {
      if (selectedRoundId) {
        fetchLotteryData()
      }
      clearInterval(timer.current)
    }, 1000)

    return () => clearInterval(timer.current)
  }, [selectedRoundId])

  const handleInputChange = (event) => {
    const {
      target: { value },
    } = event
    if (value) {
      setSelectedRoundId(value)
      if (parseInt(value, 10) <= 0) {
        setSelectedRoundId('')
      }
      if (parseInt(value, 10) >= mostRecentFinishedRoundId) {
        setSelectedRoundId(mostRecentFinishedRoundId.toString())
      }
    } else {
      setSelectedRoundId('')
    }
  }

  const handleArrowButonPress = (targetRound) => {
    if (targetRound) {
      setSelectedRoundId(targetRound.toString())
    } else {
      // targetRound is NaN when the input is empty, the only button press that will trigger this func is 'forward one'
      setSelectedRoundId('1')
    }
  }

  return (
    <StyledCard>
      <StyledCardHeader>
        <RoundSwitcher
          isLoading={isLoading}
          selectedRoundId={selectedRoundId}
          selectedLotteryInfo={selectedLotteryInfo}
          mostRecentRound={mostRecentFinishedRoundId}
          handleInputChange={handleInputChange}
          handleArrowButonPress={handleArrowButonPress}
        />
      </StyledCardHeader>
      <PreviousRoundCardBody lotteryData={selectedLotteryInfo} lotteryId={selectedRoundId} />
      <PreviousRoundCardFooter lotteryData={selectedLotteryInfo} lotteryId={selectedRoundId} />
    </StyledCard>
  )
}

export default AllHistoryCard

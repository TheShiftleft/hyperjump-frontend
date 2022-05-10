import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, ExpandableLabel, CardFooter, Skeleton } from 'uikit'
import usePreviousValue from 'hooks/usePreviousValue'
import { LotteryRound } from 'state/types'
import FooterExpanded from './FooterExpanded'

interface PreviousRoundCardFooterProps {
  lotteryData: LotteryRound
  lotteryId: string
}

const Footer = styled(CardFooter)`
  border: none;
`

const PreviousRoundCardFooter: React.FC<PreviousRoundCardFooterProps> = ({ lotteryData, lotteryId }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const previousLotteryId = usePreviousValue(lotteryId)

  return (
    <Footer p="0">
      {isExpanded && lotteryData && <FooterExpanded lotteryData={lotteryData} lotteryId={lotteryId} />}
      <Flex p="8px 24px" alignItems="center" justifyContent="center">
        {lotteryData ? (
          <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Hide' : 'Details'}
          </ExpandableLabel>
        ) : (
          <Skeleton height="24px" width="83px" my="12px" />
        )}
      </Flex>
    </Footer>
  )
}

export default PreviousRoundCardFooter

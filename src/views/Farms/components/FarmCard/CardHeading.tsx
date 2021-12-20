import React from 'react'
import styled from 'styled-components'
import { Flex, Heading, Image } from 'uikit'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  farmImage?: string
  tokenSymbol?: string
  addLiquidityUrl?: string
  pairExchangeInfo?: string
  earnLabel?: string
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 0.25rem;
  }
`

const Container = styled.div`
  width: 100%;
`
const StyledHeading = styled(Heading)`
  margin: 16px 0px;
`

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  farmImage,
  tokenSymbol,
}) => {
  return (
    <Wrapper flexDirection="column" justifyContent="space-between" alignItems="center" mb="12px">
      <Image src={`/images/farms/${farmImage}.svg`} alt={tokenSymbol} width={64} height={64} mb="6px" />
      <Flex justifyContent="center">
        <StyledHeading size="lg" color="primary" fontFamily="Oswald">
          {lpLabel}
        </StyledHeading>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading

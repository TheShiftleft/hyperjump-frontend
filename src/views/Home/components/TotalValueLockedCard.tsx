import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from 'uikit'
import { useGetBscStats } from 'hooks/api'

const StyledTotalValueLockedCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.card};
  align-items: center;
  display: flex;
  flex: 1;
`

const StyledTVL = styled.div`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  border-radius: ${({ theme }) => theme.radii.card};
  margin-bottom: 8px;
  padding: 16px;
  text-align: center;
`
const HeadingColor = styled.div`
  color: ${({ theme }) => theme.colors.primary};
`

const TotalValueLockedCard = () => {
  const data = useGetBscStats()
  // set tvl to 69 if fail
  const tvl = data && data.tvl ? data.tvl.toLocaleString('en-US', { maximumFractionDigits: 0 }) : 'Available shortly!'
  return (
    <StyledTotalValueLockedCard>
      <CardBody style={{ width: '100%' }}>
        <Heading scale="xl" mb="24px">
          <HeadingColor>TOTAL VALUE LOCKED (TVL)</HeadingColor>
        </Heading>
        {data ? (
          <StyledTVL>
            <Heading scale="xl">{`$${tvl}`}</Heading>
            <Text color="textSubtle">ACROSS ALL LPS & MECH POOLS</Text>
          </StyledTVL>
        ) : (
          <Skeleton height={66} />
        )}
      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard

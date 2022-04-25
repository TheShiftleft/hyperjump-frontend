import React from 'react'
import { Card, CardBody, Heading, Text } from 'uikit'
import styled from 'styled-components'

const StyledAlloyStats = styled(Card)`
  background-color: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii.card};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  margin-left: auto;
  margin-right: auto;
`

const Row = styled.div`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  border-radius: ${({ theme }) => theme.radii.card};
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 16px;

  color: ${({ theme }) => theme.colors.primary};
`

const HeadingColor = styled.div`
  color: ${({ theme }) => theme.colors.primary};
`

const MissionMessage = () => {
  return (
    <StyledAlloyStats>
      <CardBody>
        <Heading scale="xl" mb="24px">
          <HeadingColor>HyperHeist</HeadingColor>
          <Text>COMING SOON...</Text>
        </Heading>
      </CardBody>
    </StyledAlloyStats>
  )
}

export default MissionMessage

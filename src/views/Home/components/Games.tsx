import React from 'react'
import { Card, CardBody, Heading, Image } from 'uikit'
import styled from 'styled-components'

const StyledAlloyStats = styled(Card)`
  background-color: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii.card};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  margin-left: auto;
  margin-right: auto;
`
const HeadingColor = styled.div`
  color: ${({ theme }) => theme.colors.primary};
`

const LogoStyle = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 80%;
`

const Games = () => {
  return (
    <StyledAlloyStats>
      <CardBody>
        <Heading scale="xl" mb="24px">
          <HeadingColor>LATEST MISSION</HeadingColor>
        </Heading>
        <LogoStyle>
          <Image src="images/games/hyper-heist-logo.png" width={444} height={100} />
        </LogoStyle>
      </CardBody>
    </StyledAlloyStats>
  )
}

export default Games

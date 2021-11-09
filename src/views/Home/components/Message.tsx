import React from 'react'
import { Card, CardBody, Heading, Image, Text } from 'uikit'
import styled from 'styled-components'

import { useTranslation } from 'contexts/Localization'

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

const DivRight = styled.div``
const DivLeft = styled.div`
  float: left;
`

const StyledTVL = styled.div`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  border-radius: ${({ theme }) => theme.radii.card};
  margin-bottom: 8px;
  padding: 16px;
`
const Message = () => {
  const { t } = useTranslation()

  return (
    <StyledAlloyStats>
      <CardBody>
        <Heading scale="xl" mb="24px">
          <HeadingColor>{t('WELCOME TO HYPERJUMP!')}</HeadingColor>
        </Heading>
        <StyledTVL>
          <Text>Thanks for coming to HyperJump!</Text>
          <Text>Have a look around on our new station, we have improved speed and quality of all of our services!</Text>
          <Text> Enjoy your stay and please be careful as Thargoids are rumored to be near!</Text>
          <br />
          <Heading scale="xl">ANGRY MECH</Heading>
          <Text color="textSubtle">{t('STATION MECH')}</Text>
        </StyledTVL>
      </CardBody>
    </StyledAlloyStats>
  )
}

export default Message

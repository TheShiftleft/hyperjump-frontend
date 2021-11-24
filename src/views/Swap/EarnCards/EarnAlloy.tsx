import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Flex, Text } from 'uikit'
import { NavLink } from 'react-router-dom'

const EarnCard = styled(Card)`
  flex: 1;
  margin-right: 15px;
  background-color: rgba(2,5,11,0.7);
  border-radius: ${({ theme }) => theme.radii.card};
  height: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: none;
    width: 180px;
  }
`

const AssetCardBody = styled(CardBody)`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px 12px 0 16px;
`

const ArrowIcon = styled.img`
  width: 50px;
`

const FooterFlex = styled(Flex)`
  margin: 5px -15px -5px auto;
`

const EarnAlloy = () => {
  return (
    <EarnCard>
      <NavLink exact activeClassName="active" to="/farms" id="pool-cta">
        <AssetCardBody>
          <Heading scale="lg">
            Earn
          </Heading>
          <Heading color="primary">Alloy</Heading>
          <Text fontSize="12px">(Used to Build )</Text>
          <Flex flexDirection="column" marginTop="5px">
            <Text fontSize="12px">
              Deposit LP tokens in
            </Text>
            <Text fontSize="12px" color="primary">
              Asteroid Field
            </Text>
          </Flex>
          <FooterFlex alignItems="center">
            <Text>EARN</Text>
            <ArrowIcon src="images/dashboard/arrow.png"/>
          </FooterFlex>
        </AssetCardBody>
      </NavLink>
    </EarnCard>
  )
}

export default EarnAlloy

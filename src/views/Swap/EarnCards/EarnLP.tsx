import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Flex, Text } from 'uikit'
import { NavLink } from 'react-router-dom'

const EarnCard = styled(Card)`
  flex: 1;
  margin-left: 15px;
  background-color: rgba(2,5,11,0.7);
  border-radius: ${({ theme }) => theme.radii.card};
  height: 100%;
  width: 180px;
  
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

const EarnLP = () => {
  return (
    <EarnCard>
      <NavLink exact activeClassName="active" to="/vaults" id="pool-cta">
        <AssetCardBody>
          <Heading scale="lg">
            Earn
          </Heading>
          <Heading color="primary">LP Tokens</Heading>
          <Text fontSize="12px">(Auto Compounding)</Text>
          <Flex flexDirection="column" marginTop="5px">
            <Text fontSize="12px">
              Deposit LP tokens in
            </Text>
            <Text fontSize="12px" color="primary">
              StarVaults
            </Text>
          </Flex>
          <FooterFlex mt="-15px" ml="auto" alignItems="center">
            <Text>EARN</Text>
            <ArrowIcon src="images/dashboard/arrow.png"/>
          </FooterFlex>
        </AssetCardBody>
      </NavLink>
    </EarnCard>
  )
}

export default EarnLP

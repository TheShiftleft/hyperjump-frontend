import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { useGetBscStats, useGetFtmStats } from 'hooks/api'
import getNetwork from 'utils/getNetwork'

const StyledTotalValueLockedCard = styled(Card)`
  background-color: rgba(2, 5, 11, 0.7);
  border-radius: 50px;
  align-items: center;
  display: flex;

  &::after {
    content: '';
    background-image: url('/images/dashboard/mech.png');
    background-repeat: no-repeat;
    background-size: 120px 120px;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-position: right 20px bottom 15px;
    position: absolute;
    z-index: -1;
  }
`

const HeadingColor = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-family: Bebas neue, cursive;
`

const Welcome = () => {
  const { chainId } = getNetwork()
  const network = chainId === 250 ? 'FTM' : 'BSC'
  return (
    <StyledTotalValueLockedCard>
      <CardBody style={{ width: '100%' }}>
        <Heading scale="xl">
          <HeadingColor>HYPERJUMP {network} STATION </HeadingColor>
        </Heading>
        <Text color="white" fontSize="24px">
          Welcome to the HyperJump Station!
        </Text>
        <Text>Our brand new multi-chain system offers many great opportinities, and extended functionality.</Text>
        <Text>Enjoy your stay!</Text>
      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default Welcome

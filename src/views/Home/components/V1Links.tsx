import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button, Link, Flex } from 'uikit'
import getNetwork from 'utils/getNetwork'

const StyledFarmingTokenStakingCard = styled(Card)`
  background-color: rgba(2, 5, 11, 0.7);
  border-radius: 50px;
  min-height: 200px;

  &::after {
    content: '';
    background-image: url('images/dashboard/mech.png');
    background-repeat: no-repeat;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-position: right -120px bottom -140px;
    position: absolute;
    z-index: -1;
  }
`

const CardButton = styled(Button)`
  border-radius: 5px;
  max-height: 25px;
  padding: 5px 5px !important;
  color: black;

  :disabled {
    color: black;
  }
`

const HeadingColor = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-family: Bebas neue, cursive;
`

const V1Links = () => {
  return (
    <StyledFarmingTokenStakingCard>
      <CardBody>
        <Heading scale="xl" mb="24px">
          <HeadingColor>HYPERJUMP V1 APP</HeadingColor>
        </Heading>

        <>
          <Flex justifyContent="space-between" alignItems="flex-end" mb="30px">
            <Flex flexDirection="column">
              <Heading>BSC</Heading>
              <Link href="https://bscv1.hyperjump.app">
                <CardButton id="bsc-go">BSCV1.HYPERJUMP.APP</CardButton>
              </Link>
            </Flex>
          </Flex>

          <Flex justifyContent="space-between" alignItems="flex-end">
            <Flex flexDirection="column">
              <Heading>FTM </Heading>
              <Link href="https://ftmv1.hyperjump.app">
                <CardButton id="ftm-go">FTMV1.HYPERJUMP.APP</CardButton>
              </Link>
              </Flex>
          </Flex>
        </>
      </CardBody>
    </StyledFarmingTokenStakingCard>
  )
}

export default V1Links

import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Card, CardBody, Heading, Text, Button, Flex } from 'uikit'
import styled from 'styled-components'
import getNetwork from 'utils/getNetwork'
import { useClaimLpRewards } from 'hooks/useClaimLpRewards'
import useClaimLpRewardsCanClaim from 'hooks/useClaimLpRewardsCanClaim'

const LpRewardsClaimer = () => {
  const { chainId } = getNetwork()
  const { account } = useWeb3React()
  const { onClaim } = useClaimLpRewards(account)
  const canClaim = useClaimLpRewardsCanClaim()

  return (
    <StyledFarmingTokenStats>
      <CardBody>
        <Flex justifyContent="space-between" mb="20px">
          <Flex flexDirection="column">
            <Heading scale="xl">
              <HeadingColor>V1 LP REWARD CLAIMER</HeadingColor>
            </Heading>
          </Flex>
          <Flex flexDirection="column" alignItems="flex-end">
            {account && canClaim && <BuyButton onClick={onClaim}>Claim</BuyButton>}
          </Flex>
        </Flex>
        {account && !canClaim && <Text>Nothing for you to claim, sorry.</Text>}
      </CardBody>
    </StyledFarmingTokenStats>
  )
}

export default LpRewardsClaimer

const StyledFarmingTokenStats = styled(Card)`
  background-color: rgba(2, 5, 11, 0.7);
  border-radius: ${({ theme }) => theme.radii.card};
  border-radius: 50px;

  &::after {
    content: '';
    background-image: url('jump.png');
    background-repeat: no-repeat;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-position: 180px 180px;
    background-position: right -50px bottom -50px;
    position: absolute;
    z-index: -1;
  }
`

const HeadingColor = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-family: Bebas neue, cursive;
`

const BuyButton = styled(Button)`
  max-height: 30px;
  padding: 5px !important;
  border-radius: 5px;
  color: black;
`

const MetamaskButton = styled(Button)`
  background-image: url('metamask.png');
  background-repeat: no-repeat;
  background-size: 25px 25px;
  background-position: center;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  transition: all 100ms ease;

  &:hover {
    width: 100px;
    border-radius: 5px;
    background-position: right 10px top 50%;
  }

  &:hover:before {
    content: 'Add to';
    padding-right: 30px;
    color: black;
  }
`

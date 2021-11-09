import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Card, CardBody, Heading, Text, Button, Flex } from 'uikit'
import styled from 'styled-components'
import getNetwork from 'utils/getNetwork'
import { getBalanceNumber } from 'utils/formatBalance'
import useTokenBalance from 'hooks/useTokenBalance'
import { getFarmingTokenAddress } from 'utils/addressHelpers'
import CardValue from './CardValue'
import BSCLogo from '../icons/BinanceChainWName'
import FTMLogo from '../icons/FantomChainWName'
import '../icons/style.css'

const Bridge = () => {
  const farmingTokenAddress = getFarmingTokenAddress()
  const { balance: farmingTokenBalance } = useTokenBalance(farmingTokenAddress)
  const balance = getBalanceNumber(farmingTokenBalance)
  const { chainId } = getNetwork()

  return (
    <StyledFarmingTokenStats>
      <CardBody>
        <Flex justifyContent="space-between" mb="20px">
          <Flex flexDirection="column">
            <Heading scale="xl">
              <HeadingColor>Bridge</HeadingColor>
            </Heading>
          </Flex>
          <Flex flexDirection="column" alignItems="flex-end">
            <BuyButton>Bridge</BuyButton>
          </Flex>
        </Flex>

        <Text color="primary">JUMP Balance</Text>
        <Heading mb="10px">{farmingTokenBalance && <CardValue value={balance} />}</Heading>
        <Text color="primary">Destination Chain</Text>

        <Flex justifyContent="space-between">{chainId === 250 ? <BSCLogo /> : <FTMLogo />}</Flex>
      </CardBody>
    </StyledFarmingTokenStats>
  )
}

export default Bridge

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

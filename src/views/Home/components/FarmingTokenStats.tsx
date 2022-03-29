import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { ChainId } from '@hyperjump-defi/sdk'
import BigNumber from 'bignumber.js'
import { Card, CardBody, Heading, Text, Button, Flex } from 'uikit'
import styled from 'styled-components'
import { usePriceFarmingTokenUsd } from 'state/hooks'
import { getFarmingTokenAddress } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import { useGetCirculatingSupplyStats } from 'hooks/api'
import getNetwork from 'utils/getNetwork'
import CardValue from './CardValue'
import BurnCardValue from './BurnCardValue'

const FarmingTokenStats = () => {
  const { config, chainId } = getNetwork()

  const circulatingSupplyData = useGetCirculatingSupplyStats()
  // we dont  have burn data from bsc yet
  const burnedBalance = circulatingSupplyData ? circulatingSupplyData.ftm.totalBurned : 0
  const farmingTokenTotalSupply: number = circulatingSupplyData ? circulatingSupplyData.ftm.totalSupply : 0
  const farmingTokenTotalCirculatingSupply = circulatingSupplyData ? circulatingSupplyData.totalCirculatingSupply : 0

  const farmingTokenPriceUsd = usePriceFarmingTokenUsd()
  const farmingTokenPriceUsdString = farmingTokenPriceUsd.gt(0)
    ? farmingTokenPriceUsd.toNumber().toLocaleString(undefined, { maximumFractionDigits: 4 })
    : '0'

  const farmingTokenMarketCap =
    farmingTokenPriceUsd.gt(0) && farmingTokenTotalSupply > 0
      ? farmingTokenPriceUsd.toNumber() * farmingTokenTotalSupply
      : 0

  const localCirculatingSupply = circulatingSupplyData
    ? chainId === ChainId.BSC_MAINNET
      ? circulatingSupplyData.bsc.totalCirculatingSupply
      : circulatingSupplyData.ftm.totalCirculatingSupply
    : 0

  const tokenAddress = getFarmingTokenAddress()
  const imageSrc = `images/tokens/${config.farmingToken.symbol.toLowerCase()}.png`
  const buyLink =
    chainId === 56
      ? '/swap?inputCurrency=BNB&outputCurrency=0x130025eE738A66E691E6A7a62381CB33c6d9Ae83'
      : 'swap?inputCurrency=BNB&outputCurrency=0x78de9326792ce1d6eca0c978753c6953cdeedd73'

  // make dynamic later, maybe add to api? -- mech
  const tokenPerBlockBSC = 1.583940258751902587
  const tokenPerBlockFTM = 1.585489599188229325

  const localEmissionRate = chainId ? (chainId === 56 ? tokenPerBlockBSC : tokenPerBlockFTM) : 0

  return (
    <StyledFarmingTokenStats>
      <CardBody>
        <Flex justifyContent="space-between" mb="20px">
          <Flex flexDirection="column">
            <Heading scale="xl">
              <HeadingColor>{`${config.farmingToken.symbol} STATS`}</HeadingColor>
            </Heading>
            <Heading scale="lg">${config.farmingToken.symbol}</Heading>
          </Flex>
          <Flex flexDirection="column" alignItems="flex-end">
            <Heading mt="5px" mb="5px">
              $ {farmingTokenPriceUsdString}
            </Heading>
            <NavLink to={buyLink}>
              <BuyButton>Buy Now</BuyButton>
            </NavLink>
          </Flex>
        </Flex>
        <Text color="primary">Market Cap</Text>
        <Heading mb="10px">
          {farmingTokenMarketCap ? <CardValue value={farmingTokenMarketCap} /> : <CardValue value={0} />}
        </Heading>

        <Text color="primary">Total Supply</Text>
        <Heading mb="10px">
          {farmingTokenTotalSupply ? <CardValue value={farmingTokenTotalSupply} /> : <CardValue value={0} />}
        </Heading>
        <Text color="primary">Total Circulating Supply</Text>
        <Heading mb="10px">
          {farmingTokenTotalCirculatingSupply && <CardValue value={farmingTokenTotalCirculatingSupply} />}({' '}
          {localCirculatingSupply && farmingTokenTotalSupply
            ? new BigNumber(farmingTokenTotalCirculatingSupply)
                .div(farmingTokenTotalSupply)
                .multipliedBy(100)
                .toFixed(2)
            : 0}
          % )
        </Heading>
        <>
          <Text color="primary">{config.name} Circulating Supply</Text>
          <Heading mb="10px">
            {localCirculatingSupply && <CardValue value={localCirculatingSupply} />} ({' '}
            {localCirculatingSupply && farmingTokenTotalCirculatingSupply
              ? new BigNumber(localCirculatingSupply)
                  .div(farmingTokenTotalCirculatingSupply)
                  .multipliedBy(100)
                  .toFixed(2)
              : 0}
            % )
          </Heading>
        </>
        <Text color="primary">Total {config.farmingToken.symbol} Burned</Text>
        <Heading mb="10px">
          <BurnCardValue decimals={0} value={burnedBalance} supply={farmingTokenTotalSupply + burnedBalance} />
        </Heading>

        <Text color="primary">{config.name} Emission Rate</Text>
        <Flex justifyContent="space-between">
          <Heading mb="10px">
            <CardValue decimals={3} value={Number(localEmissionRate)} postfix="/ SECOND" />
          </Heading>
          <MetamaskButton
            onClick={() =>
              registerToken(tokenAddress, config.farmingToken.symbol, config.farmingToken.decimals, imageSrc)
            }
          />
        </Flex>
      </CardBody>
    </StyledFarmingTokenStats>
  )
}

export default FarmingTokenStats

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

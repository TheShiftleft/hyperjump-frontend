import React, {useMemo} from 'react'
import { NavLink } from 'react-router-dom'
import { ChainId } from '@hyperjump-defi/sdk'
import BigNumber from 'bignumber.js'
import { Card, CardBody, Heading, Text, Button, Flex } from 'uikit'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance, useMainDistributorBalance, useBridgeDistributorBalance, useTotalSupplyMultiChain } from 'hooks/useTokenBalance'
import { usePriceFarmingTokenUsd } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { getFarmingTokenAddress } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import { NETWORK_URL } from 'config'
import getNetwork from 'utils/getNetwork'
import CardValue from './CardValue'
import BurnCardValue from './BurnCardValue'


const FarmingTokenStats = () => {
  const { t } = useTranslation()
  const totalSupply = useTotalSupply()

  const burnedBalance = getBalanceNumber(useBurnedBalance(getFarmingTokenAddress()))
  // change the calc of totalsupply as new token correctly deducts it from totalsupply - angry mech
  const farmingTokenSupply = totalSupply ? getBalanceNumber(totalSupply) : 0 //  - burnedBalance : 0
  const farmingCirculatingSupply = farmingTokenSupply * 0.10
  const farmingTokenPriceUsd = usePriceFarmingTokenUsd()

  const farmingTokenPriceUsdString =
    farmingTokenPriceUsd.isNaN() || farmingTokenPriceUsd.isZero()
      ? 'Loading...'
      : farmingTokenPriceUsd.toNumber().toLocaleString(undefined, { maximumFractionDigits: 4 })
  const farmingTokenMarketCap =
    (farmingTokenPriceUsd.isNaN() || farmingTokenPriceUsd.isZero()) && farmingTokenSupply !== 0
      ? 0
      : farmingTokenPriceUsd.toNumber() * farmingTokenSupply
  const { config, chainId } = getNetwork()

  const mainDistBalance = useMainDistributorBalance(chainId)
  const bridgeDistBalance = useBridgeDistributorBalance(ChainId.BSC_MAINNET)
  const totalSupplyMultiChain = useTotalSupplyMultiChain(ChainId.BSC_MAINNET)
  const circulatingSupply = useMemo(() => {
    if(chainId === ChainId.BSC_MAINNET){
      return (totalSupply && bridgeDistBalance.balance ? getBalanceNumber(totalSupply.minus(bridgeDistBalance.balance)) : 0 ) 
    }
    
    const bscCircSupply = (totalSupplyMultiChain && bridgeDistBalance.balance ? totalSupplyMultiChain.minus(bridgeDistBalance.balance) : 0 ) 
    return (totalSupply && mainDistBalance.balance && bridgeDistBalance.balance ? getBalanceNumber(totalSupply.minus(mainDistBalance.balance).minus(bscCircSupply)) : 0 ) 
  }, [chainId, mainDistBalance, bridgeDistBalance, totalSupply, totalSupplyMultiChain])

  const tokenAddress = getFarmingTokenAddress()
  const imageSrc = `images/tokens/${config.farmingToken.symbol.toLowerCase()}.png`
  const buyLink =
    chainId === 56
      ? '/swap?inputCurrency=BNB&outputCurrency=0x130025eE738A66E691E6A7a62381CB33c6d9Ae83'
      : 'swap?inputCurrency=BNB&outputCurrency=0x78de9326792ce1d6eca0c978753c6953cdeedd73'

  return (
    <StyledFarmingTokenStats>
      <CardBody>
        <Flex justifyContent="space-between" mb="20px">
          <Flex flexDirection="column">
            <Heading scale="xl">
              <HeadingColor>{t(`${config.farmingToken.symbol} STATS`)}</HeadingColor>
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
        <Heading mb="10px">{farmingTokenMarketCap && <CardValue value={farmingTokenMarketCap} />}</Heading>

        <Text color="primary">Total Supply</Text>
        <Heading mb="10px">{farmingTokenSupply && <CardValue value={farmingTokenSupply} />}</Heading>
      
        <>
          <Text color="primary">{config.name} Circulating Supply</Text>
          <Heading mb="10px">{circulatingSupply && <CardValue value={circulatingSupply} />} ( {(circulatingSupply && totalSupply ? new BigNumber(circulatingSupply).div(getBalanceNumber(totalSupply)).multipliedBy(100).toFixed(2) : 0 )}% )</Heading>
        </>

        <Text color="primary">Total {config.farmingToken.symbol} Burned</Text>
        <Heading mb="10px">
          <BurnCardValue decimals={0} value={burnedBalance} supply={farmingTokenSupply + burnedBalance} />
        </Heading>

        <Text color="primary">Emission Rate</Text>
        <Flex justifyContent="space-between">
          <Heading mb="10px">
            <CardValue decimals={2} value={3.141592653589793238} postfix="/ SECOND" />
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

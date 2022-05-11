import React from 'react'
import { NavLink } from 'react-router-dom'
import { Card, CardBody, Heading, Text, Flex, Button } from 'uikit'
import styled from 'styled-components'
import { registerToken } from 'utils/wallet'
import { NETWORK_URL } from 'config'
import getNetwork from 'utils/getNetwork'
import { getBalanceNumber } from 'utils/formatBalance'
import { useGovTokenBurnedBalance, useGovTokenBurnRate, useGovTokenTotalSupply } from 'hooks/useTokenBalance'
import { usePriceGovTokenUsd } from 'state/hooks'
import { getGovTokenAddress } from 'utils/addressHelpers'
import CardValue from './CardValue'
import BurnCardValue from './BurnCardValue'

const { config } = getNetwork()
const govToken = ` ${config.govToken.symbol}`

const GovTokenStats = () => {
  const totalSupply = useGovTokenTotalSupply()

  const burnedBalance = getBalanceNumber(useGovTokenBurnedBalance(getGovTokenAddress()))
  const hyprSupply = totalSupply ? getBalanceNumber(totalSupply) : 0
  const hyprBurnRate = getBalanceNumber(useGovTokenBurnRate(getGovTokenAddress()))
  const hyprPriceUsd = usePriceGovTokenUsd()
  const hyprPriceString =
    hyprPriceUsd.isNaN() || hyprPriceUsd.isZero()
      ? 'Loading'
      : hyprPriceUsd.toNumber().toLocaleString(undefined, { maximumFractionDigits: 2 })
  const hyprMarketCap =
    (hyprPriceUsd.isNaN() || hyprPriceUsd.isZero()) && hyprSupply !== 0 ? 0 : hyprPriceUsd.toNumber() * hyprSupply

  const tokenAddress = getGovTokenAddress()
  const imageSrc = `/images/tokens/${config.govToken.symbol.toLowerCase()}.png`

  return (
    <StyledGovTokenStats>
      <CardBody>
        <Flex justifyContent="space-between" mb="20px">
          <Flex flexDirection="column">
            <Heading scale="xl">
              <HeadingColor>
                {govToken} {' STATS'}
              </HeadingColor>
            </Heading>
            <Heading scale="lg">{govToken}</Heading>
          </Flex>
          <Flex flexDirection="column" alignItems="flex-end">
            <Heading mt="5px" mb="5px">
              $ {hyprPriceString}
            </Heading>
            <NavLink to="/swap?inputCurrency=BNB&outputCurrency=0x03D6BD3d48F956D783456695698C407A46ecD54d">
              <BuyButton>Buy Now</BuyButton>
            </NavLink>
          </Flex>
        </Flex>

        <Text color="primary">Market Cap</Text>
        <Heading mb="10px">{hyprMarketCap && <CardValue value={hyprMarketCap} />}</Heading>

        <Text color="primary">Current Supply</Text>
        <Heading mb="10px">{hyprSupply && <CardValue value={hyprSupply} />}</Heading>

        <Text color="primary">Supply Burned</Text>
        <Heading mb="10px">
          <BurnCardValue decimals={0} value={burnedBalance} supply={hyprSupply} />
        </Heading>

        <Text color="primary">Current {govToken} Burn Rate</Text>
        <Flex justifyContent="space-between">
          <Heading mb="10px">
            <CardValue decimals={2} value={hyprBurnRate} postfix="%" />
          </Heading>
          <MetamaskButton
            onClick={() => registerToken(tokenAddress, config.govToken.symbol, config.govToken.decimals, imageSrc)}
          />
        </Flex>
      </CardBody>
    </StyledGovTokenStats>
  )
}

export default GovTokenStats

const StyledGovTokenStats = styled(Card)`
  background-color: ${({ theme }) => theme.colors.background};
  background-color: rgba(2, 5, 11, 0.7);
  border-radius: 50px;

  &::after {
    content: '';
    background-image: url('/images/tokens/0x03d6bd3d48f956d783456695698c407a46ecd54d.png');
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

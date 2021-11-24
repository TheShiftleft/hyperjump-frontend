import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Card, CardBody, Heading, Text, Button, Flex } from 'uikit'
import styled from 'styled-components'
import getNetwork from 'utils/getNetwork'
import { getBalanceNumber } from 'utils/formatBalance'
import { registerToken } from 'utils/wallet'
import useTokenBalance from 'hooks/useTokenBalance'
import { useMechToken } from 'hooks/useContract'
import { getFarmingTokenAddress, getMechAddress } from 'utils/addressHelpers'
import useMechMigratorAllowance from 'hooks/useMechMigratorAllowance'
import { useMechMigrate } from 'hooks/useMechMigrate'
import { useMechMigratorApprove } from 'hooks/useApprove'
import CardValue from './CardValue'

const Converter = () => {
  const mechToken = useMechToken()
  const { onApprove: handleApprove } = useMechMigratorApprove(mechToken)
  const allowance = useMechMigratorAllowance()
  const needsApproval = !allowance.gt(0)
  const { config } = getNetwork()
  const mechTokenAddress = getMechAddress()
  const farmingTokenAddress = getFarmingTokenAddress()
  const { balance: mechTokenBalance } = useTokenBalance(mechTokenAddress)
  const { balance: jumpTokenBalance } = useTokenBalance(farmingTokenAddress)
  const jumpBalanceInNumber = jumpTokenBalance.toNumber() / 10 ** 18
  const hasJumpBalance = jumpTokenBalance.gt(0)
  const convertionRatio = 1 // so not used
  const convertedmechTokenValue = getBalanceNumber(mechTokenBalance)
  const balance = getBalanceNumber(mechTokenBalance)
  const { account } = useWeb3React()
  const imageSrc = 'https://tokens.hyperswap.fi/images/0x78DE9326792ce1d6eCA0c978753c6953Cdeedd73.png'
  const { onMigrate } = useMechMigrate(account)

  return (
    <StyledFarmingTokenStats>
      <CardBody>
        <Flex justifyContent="space-between" mb="20px">
          <Flex flexDirection="column">
            <Heading scale="xl">
              <HeadingColor>$MECH CONVERTER</HeadingColor>
            </Heading>
          </Flex>
          <Flex flexDirection="column" alignItems="flex-end">
            {account && needsApproval ? (
              <BuyButton onClick={handleApprove}>Approve</BuyButton>
            ) : (
              <BuyButton onClick={onMigrate}>Convert</BuyButton>
            )}
          </Flex>
        </Flex>

        {convertedmechTokenValue > 0 ? (
          <>
            <Text color="primary">MECH Balance</Text>
            <Heading mb="10px">{mechTokenBalance && <CardValue value={balance} />}</Heading>
            <Text color="primary">JUMP value</Text>
            <Heading mb="10px">{mechTokenBalance && <CardValue value={convertedmechTokenValue} />}</Heading>
          </>
        ) : (
          <Flex justifyContent="space-between">
            <Text>Nothing to convert!</Text>
          </Flex>
        )}
        {hasJumpBalance ? (
          <>
            <Text color="primary">JUMP Balance</Text>
            <Heading mb="10px">
              <CardValue value={jumpBalanceInNumber} />
            </Heading>
          </>
        ) : null}
        <Text color="primary">Conversion Rate</Text>
        <Flex justifyContent="space-between">
          <Heading mb="10px">
            <CardValue decimals={0} value={convertionRatio} postfix="to 1" />
          </Heading>

          <MetamaskButton
            onClick={() =>
              registerToken(farmingTokenAddress, config.farmingToken.symbol, config.farmingToken.decimals, imageSrc)
            }
          />
        </Flex>
      </CardBody>
    </StyledFarmingTokenStats>
  )
}

export default Converter

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

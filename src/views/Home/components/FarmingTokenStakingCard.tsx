

import React, { useState, useCallback } from 'react'
import { NavLink } from "react-router-dom";
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Heading, Card, CardBody, Button, Text, Flex } from 'uikit'
import { harvest, soushHarvest } from 'utils/callHelpers'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import usePoolsWithBalance from 'hooks/usePoolsWithBalance'
import { useMasterchef, usePoolContract } from 'hooks/useContract'
import UnlockButton from 'components/UnlockButton'
import getNetwork from 'utils/getNetwork'
import { BIG_ZERO } from 'utils/bigNumber'

import { useSousHarvest } from 'hooks/useHarvest'

import FarmingTokenHarvestBalance from './FarmingTokenHarvestBalance'
import FarmingTokenWalletBalance from './FarmingTokenWalletBalance'

const StyledFarmingTokenStakingCard = styled(Card)`
  background-color: rgba(2,5,11,0.7);
  border-radius: 50px;
  min-height: 200px;

  &::after {
    content: "";
    background-image: url("jump.png");
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

const FarmingTokenStakingCard = () => {
  const [pendingTx, setPendingTx] = useState(false)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const farmsWithBalance = useFarmsWithBalance()
  const poolsWithBalance = usePoolsWithBalance()

  const masterChefContract = useMasterchef()
  const { config } = getNetwork()
  const poolContract = usePoolContract(config.wrappedFarmingTokenPid)
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)  
  const poolsWithValue    = poolsWithBalance.filter((balanceType) => (balanceType.userData?.pendingReward ?? undefined ? new BigNumber(balanceType.userData?.pendingReward.toString()).isGreaterThan(0) : undefined))

  console.log('poolsWithBalance', poolsWithBalance)
  console.log('poolsWithValue', poolsWithValue)
  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    // eslint-disable-next-line no-restricted-syntax
    for (const farmWithBalance of balancesWithValue) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await harvest(masterChefContract, farmWithBalance.pid, account)
      } catch (error) {
        // TODO: find a way to handle when the user rejects transaction or it fails
      }
    }

    // if( BigNumber(poolsWithValue[0].userData?.pendingReward.toString()).isGreaterThan(0) ){   
    // await soushHarvest(poolContract, account)
    // }  

    if( poolsWithValue ){
     await soushHarvest(poolContract, account) 
    }

    setPendingTx(false)
  }, [account, balancesWithValue, poolsWithValue, poolContract, masterChefContract])

  const poolHarvestBalanceLength = balancesWithValue.length + poolsWithValue.length

  console.log(poolsWithValue)

  const { onReward } = useSousHarvest(6, false)
  const harvestAllPools = async () => {
    setPendingTx(true)
    try {
      await onReward()
      setPendingTx(false)
    } catch (e) {
      setPendingTx(false)
    }
  }

  return (
    <StyledFarmingTokenStakingCard>
      <CardBody>
        <Heading scale="xl" mb="24px">
          <HeadingColor>{t('FARMS AND STAKING')}</HeadingColor>
        </Heading>

        {account ? (
          <>
          <Flex justifyContent="space-between" alignItems="flex-end" mb="30px">
          <Flex flexDirection="column">
            <Heading>
              <FarmingTokenHarvestBalance />
            </Heading>
            <Text color="primary">{config.farmingToken.symbol} to Harvest</Text>
          </Flex>

          <CardButton id="harvest-all" onClick={harvestAllFarms}>
            HARVEST ALL
          </CardButton>
          
        </Flex>

        <Flex justifyContent="space-between" alignItems="flex-end">
          <Flex flexDirection="column">
            <Heading>
              <FarmingTokenWalletBalance />
            </Heading>
            <Text color="primary">{config.farmingToken.symbol} in Wallet</Text>
          </Flex>
          
          <NavLink to="/pools">
            <CardButton>STAKE JUMP</CardButton>
          </NavLink>
        </Flex>
        </>
        ) : (
          <UnlockButton width="100%"/>
        )}
      </CardBody>
    </StyledFarmingTokenStakingCard>
  )
}

export default FarmingTokenStakingCard

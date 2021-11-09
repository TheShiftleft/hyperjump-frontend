import React from 'react'
import { Network } from '@hyperjump-defi/sdk'
import styled from 'styled-components'
import orderBy from 'lodash/orderBy'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon, Text } from 'uikit'
import { NavLink } from 'react-router-dom'
import pools from 'config/constants/pools'
import { Pool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { poolsConfig } from 'config/constants'
import getNetwork from 'utils/getNetwork'

const StyledFarmStakingCard = styled(Card)`
  flex: 1;
  margin-right: 15px;
  background-color: rgba(2,5,11,0.7);
  border-radius: ${({ theme }) => theme.radii.card};
  height: 100%;
  
  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: none;
  }

  &::after {
    content: "";
    background-image: url("images/dashboard/mechs-icon.png");
    background-repeat: no-repeat;
    background-size: 150px 150px;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-position: right -40px top -40px;
    position: absolute;
    z-index: -1;
  }
`

const AssetCardBody = styled(CardBody)`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px 12px 0 24px;
`

const ArrowIcon = styled.img`
  width: 50px;
`

const EarnAssetCard = () => {
  const { t } = useTranslation()
  const { config } = getNetwork()

  const activePools = poolsConfig[Network.BSC].filter(pool => !pool.isFinished && pool.earningToken !== config.farmingToken)
  const latestPools: Pool[] = orderBy(activePools, ['sortOrder', 'pid'], ['desc', 'desc']).slice(0, 3)
  const assets = [config.farmingToken.symbol, ...latestPools.map(pool => pool.earningToken.symbol)].join(', ')

  const assetText = t('Earn %assets% in Pools', { assets })
  const [earn, InPools] = assetText.split(assets)

  return (
    <StyledFarmStakingCard>
      <NavLink exact activeClassName="active" to="/pools" id="pool-cta">
        <AssetCardBody>
          <Heading color="primary" scale="lg">
            {earn}
          </Heading>
          <Heading>{assets}</Heading>
          <Flex justifyContent="space-between" marginTop="auto">
            <Text color="primary">
              {InPools}
            </Text>
          </Flex>
          <Flex mt="-15px" ml="auto" alignItems="center">
            <Text>EARN</Text>
            <ArrowIcon src="images/dashboard/arrow.png"/>
          </Flex>
        </AssetCardBody>
      </NavLink>
    </StyledFarmStakingCard>
  )
}

export default EarnAssetCard

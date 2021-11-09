import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Flex, Text, Box } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { PoolCategory } from 'config/constants/types'
import { Pool } from 'state/types'
import HarvestActions from './HarvestActions'
import StakeActions from './StakeActions'
import ApprovalAction from './ApprovalAction'

const InlineText = styled(Text)`
  display: inline;
`

interface CardActionsProps {
  pool: Pool
  stakedBalance: BigNumber
}

const StyledFlex = styled(Flex)`
  border-radius: ${({ theme }) => theme.radii.card};
  background-color: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 10px 20px;
`

const CardActions: React.FC<CardActionsProps> = ({ pool, stakedBalance }) => {
  const { sousId, stakingToken, earningToken, harvest, userData, earningTokenPrice, poolCategory } = pool
  const { t } = useTranslation()
  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const isStaked = stakedBalance.gt(0)
  const isLoading = !userData
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  return (
    <StyledFlex flexDirection="column">
      <Flex flexDirection="column">
        {harvest && (
          <>
            <Box display="inline">
              <InlineText color="primary" textTransform="uppercase" bold fontSize="12px">
                {t('Harvest rewards')}
              </InlineText>
            </Box>
            <HarvestActions
              earnings={earnings}
              earningToken={earningToken}
              sousId={sousId}
              earningTokenPrice={earningTokenPrice}
              isLoading={isLoading}
            />
          </>
        )}
        <Box display="inline">
          <InlineText color="primary" textTransform="uppercase" bold fontSize="12px">
            {isStaked ? 'MECHS ' : t('Stake')}
          </InlineText>
          <InlineText color={isStaked ? 'textSubtle' : 'secondary'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? t('Working') : `${stakingToken.symbol}`}
          </InlineText>
        </Box>
        <StakeActions
          isLoading={isLoading}
          pool={pool}
          stakingTokenBalance={stakingTokenBalance}
          stakedBalance={stakedBalance}
          isStaked={isStaked}
        />
      </Flex>
    </StyledFlex>
  )
}

export default CardActions

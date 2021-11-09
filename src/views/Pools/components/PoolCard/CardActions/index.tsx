import BigNumber from 'bignumber.js'
import React, { useState } from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Flex, Text, Box } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { Pool } from 'state/types'
import ApprovalAction from './ApprovalAction'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'

const InlineText = styled(Text)`
  display: inline;
`

const StyledFlex = styled(Flex)`
  border-radius: ${({ theme }) => theme.radii.card};
  background-color: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 10px 20px;
`

interface CardActionsProps {
  pool: Pool
  stakedBalance: BigNumber
}

const CardActions: React.FC<CardActionsProps> = ({ pool, stakedBalance }) => {
  const { sousId, stakingToken, earningToken, harvest, userData, earningTokenPrice } = pool

  const { t } = useTranslation()
  const [pendingTx, setPendingTx] = useState(false)

  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const needsApproval = !allowance.gt(0)
  const isStaked = stakedBalance.gt(0)
  const isLoading = !userData

  return needsApproval ? (
    <ApprovalAction pool={pool} isLoading={isLoading} />
  ) : (
    <StyledFlex flexDirection="column">
      <Flex flexDirection="column">
        {harvest && (
          <>
            <Box display="inline">
              <InlineText color="primary" textTransform="uppercase" bold fontSize="12px">
                {`${earningToken.symbol} `}
              </InlineText>
              <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
                {t('Earned')}
              </InlineText>
            </Box>
            <HarvestActions
              earnings={earnings}
              earningToken={earningToken}
              sousId={sousId}
              earningTokenPrice={earningTokenPrice}
              isLoading={isLoading}
              isPending={pendingTx}
              setIsPending={setPendingTx}
            />
          </>
        )}
        <Box display="inline">
          <InlineText color={isStaked ? 'primary' : 'textSubtle'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? `${stakingToken.symbol}s` : t('Stake')}{' '}
          </InlineText>
          <InlineText color={isStaked ? 'textSubtle' : 'primary'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? t('Working') : `${stakingToken.symbol}`}
          </InlineText>
        </Box>
        {needsApproval ? (
          <ApprovalAction pool={pool} isLoading={isLoading} />
        ) : (
          <StakeActions
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
            stakedBalance={stakedBalance}
            isStaked={isStaked}
            isLoading={isLoading}
            isPending={pendingTx}
            setIsPending={setPendingTx}
          />
        )}
      </Flex>
    </StyledFlex>
  )
}

export default CardActions

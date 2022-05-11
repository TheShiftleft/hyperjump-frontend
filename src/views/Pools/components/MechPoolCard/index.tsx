import BigNumber from 'bignumber.js'
import React from 'react'
import { CardBody, Flex, Text, CardRibbon } from 'uikit'
import UnlockButton from 'components/UnlockButton'
import { BIG_ZERO } from 'utils/bigNumber'
import { Pool } from 'state/types'
import AprRow from '../PoolCard/AprRow'
import { StyledCard, StyledCardInner } from './StyledCard'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'

const MechPoolCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const { sousId, earningToken, isFinished, userData } = pool
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)

  return (
    <StyledCard
      isFinished={isFinished && sousId !== 0}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text="Finished" />}
    >
      <StyledCardInner>
        <StyledCardHeader isStaking={accountHasStakedBalance} earningTokenSymbol={earningToken.symbol} />
        <CardBody>
          <AprRow pool={pool} />
          <Flex mt="24px" flexDirection="column">
            {account ? (
              <CardActions pool={pool} stakedBalance={stakedBalance} />
            ) : (
              <>
                <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                  Start earning
                </Text>
                <UnlockButton />
              </>
            )}
          </Flex>
        </CardBody>
      </StyledCardInner>
    </StyledCard>
  )
}

export default MechPoolCard

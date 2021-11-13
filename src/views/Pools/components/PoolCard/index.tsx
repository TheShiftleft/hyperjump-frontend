import BigNumber from 'bignumber.js'
import React from 'react'
import { CardBody, Flex, Text, CardRibbon } from 'uikit'
import UnlockButton from 'components/UnlockButton'
import getNetwork from 'utils/getNetwork'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { Pool } from 'state/types'
import AprRow from './AprRow'
import { StyledCard, StyledCardInner } from './StyledCard'
import CardFooter from './CardFooter'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'

const PoolCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const { config } = getNetwork()
  const { sousId, stakingToken, earningToken, isFinished, userData } = pool
  const { t } = useTranslation()
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)

  console.log('config.wrappedFarmingTokenPid) 3', config.wrappedFarmingTokenPid)
  return (
    <StyledCard
      isFinished={isFinished && sousId !== config.wrappedFarmingTokenPid} // dont hide xjump pool
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    >
      <StyledCardInner>
        <StyledCardHeader
          isStaking={accountHasStakedBalance}
          tokenLink={earningToken.projectLink}
          earningTokenSymbol={earningToken.symbol}
          stakingTokenSymbol={stakingToken.symbol}
          isFinished={isFinished && sousId !== config.wrappedFarmingTokenPid} // dont hide xjump pool
        />
        <CardBody>
          <AprRow pool={pool} />
          <Flex mt="24px" flexDirection="column">
            {account ? (
              <CardActions pool={pool} stakedBalance={stakedBalance} />
            ) : (
              <>
                <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                  {t('Start earning')}
                </Text>
                <UnlockButton />
              </>
            )}
          </Flex>
        </CardBody>
        <CardFooter pool={pool} account={account} />
      </StyledCardInner>
    </StyledCard>
  )
}

export default PoolCard

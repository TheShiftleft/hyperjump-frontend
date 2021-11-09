import { Image, Text, useMatchBreakpoints } from 'uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { Pool } from 'state/types'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import getNetwork from 'utils/getNetwork'
import BaseCell, { CellContent } from './BaseCell'

interface NameCellProps {
  pool: Pool
}

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 32px;
  }
`

const NameCell: React.FC<NameCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { isXs, isSm } = useMatchBreakpoints()
  const { sousId, stakingToken, earningToken, userData, isFinished } = pool
  const { config } = getNetwork()

  const stakingTokenSymbol = stakingToken.symbol
  const earningTokenSymbol = earningToken.symbol
  let iconFile = `${earningTokenSymbol}.png`.toLocaleLowerCase()

  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const isStaked = stakedBalance.gt(0)
  const isMasterPool = sousId === 0

  const showStakedTag = isStaked

  const title = `${earningTokenSymbol}${t(' Pool')} `
  let subtitle = `${t('Stake')} ${stakingTokenSymbol}S`
  const showSubtitle = sousId !== 0 || (sousId === 0 && !isXs && !isSm)

  // FIXME DJ TJ use translation
  if (isMasterPool) {
    iconFile = 'mech.png'
    subtitle = `Build MECHs to earn ${config.farmingToken.symbol}`
  }

  return (
    <StyledCell role="cell">
      <Image src={`/images/tokens/${iconFile}`} alt="icon" width={40} height={40} mr="8px" />
      <CellContent>
        {showStakedTag && (
          <Text fontSize="12px" bold color={isFinished ? 'failure' : 'primary'} textTransform="uppercase">
            {t('STAKED')}
          </Text>
        )}
        <Text bold={!isXs && !isSm} small={isXs || isSm}>
          {title}
        </Text>
        {showSubtitle && (
          <Text fontSize="12px" color="textSubtle">
            {subtitle}
          </Text>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default NameCell

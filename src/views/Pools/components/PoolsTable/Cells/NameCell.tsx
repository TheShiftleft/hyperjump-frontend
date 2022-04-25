import { Image, Text, useMatchBreakpoints } from 'uikit'
import BigNumber from 'bignumber.js'
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
  const { isXs, isSm } = useMatchBreakpoints()
  const { sousId, stakingToken, earningToken, userData, isFinished } = pool
  const { config } = getNetwork()

  const stakingTokenSymbol = stakingToken.symbol
  const earningTokenSymbol = earningToken.symbol
  let iconFile = `${earningTokenSymbol}.png`.toLocaleLowerCase()

  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const isStaked = stakedBalance.gt(0)
  const isMasterPool = sousId === config.wrappedFarmingTokenPid // xjump pool

  const showStakedTag = isStaked

  const title = `${earningTokenSymbol}${' Pool'} `
  let subtitle = `${'Stake'} ${stakingTokenSymbol}s`
  const showSubtitle = sousId !== 0 || (sousId === 0 && !isXs && !isSm)

  // FIXME DJ TJ use translation
  if (isMasterPool) {
    const chain_id = config.id
    const jump_img = config.farmingToken.address[chain_id]
    iconFile = `${jump_img}.png`
    subtitle = `${'Stake'} ${config.farmingToken.symbol}s`
  }

  return (
    <StyledCell role="cell">
      <Image src={`/images/tokens/${iconFile}`} alt="icon" width={40} height={40} mr="8px" />
      <CellContent>
        {showStakedTag && (
          <Text fontSize="12px" bold color={isFinished ? 'failure' : 'primary'} textTransform="uppercase">
            STAKED
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

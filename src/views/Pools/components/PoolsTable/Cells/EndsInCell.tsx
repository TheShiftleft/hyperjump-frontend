import React from 'react'
import styled from 'styled-components'
import { Flex, Link, Skeleton, Text, TimerIcon } from 'uikit'
import { Network } from '@hyperjump-defi/sdk'
import { getScannerBlockCountdownUrl } from 'utils/bscscan'
import { Pool } from 'state/types'
import { useBlock } from 'state/hooks'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import getNetwork from 'utils/getNetwork'
import usePoolTimingInfo from 'hooks/usePoolTimingInfo'
import BaseCell, { CellContent } from './BaseCell'

interface FinishCellProps {
  pool: Pool
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 100px;
`

const EndsInCell: React.FC<FinishCellProps> = ({ pool }) => {
  const { sousId, totalStaked, endBlock, isFinished } = pool
  const { config } = getNetwork()
  const { currentBlock } = useBlock()
  const { t } = useTranslation()

  const { shouldShowCountdown, untilStart, remaining, hasPoolStarted, toDisplay } =
    usePoolTimingInfo(pool)

  const isMasterPool = sousId === 0

  const renderBlocks = shouldShowCountdown ? (
    <Flex alignItems="center">
      <Flex flex="1.3">
        <Balance fontSize="16px" value={toDisplay / 60} decimals={0} />
        <Text ml="4px" textTransform="lowercase">
          {t('MINUTES')}
        </Text>
      </Flex>
      {config.network === Network.BSC && (
        <Flex flex="1">
          <Link external href={getScannerBlockCountdownUrl(endBlock)} onClick={(e) => e.stopPropagation()}>
            <TimerIcon ml="4px" />
          </Link>
        </Flex>
      )}
    </Flex>
  ) : (
    <Text>-</Text>
  )

  // A bit hacky way to determine if public data is loading relying on totalStaked
  // Opted to go for this since we don't really need a separate publicDataLoaded flag
  // anywhere else
  const isLoadingPublicData = !totalStaked.gt(0) || !currentBlock || (!remaining && !untilStart)
  const showLoading = isLoadingPublicData && !isMasterPool && !isFinished
  return (
    <StyledCell role="cell">
      {!isMasterPool ? (
        <CellContent>
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            {hasPoolStarted || !shouldShowCountdown ? t('Ends in') : t('Starts in')}
          </Text>
          {showLoading ? <Skeleton width="80px" height="16px" /> : renderBlocks}
        </CellContent>
      ) : (
        <CellContent />
      )}
    </StyledCell>
  )
}

export default EndsInCell

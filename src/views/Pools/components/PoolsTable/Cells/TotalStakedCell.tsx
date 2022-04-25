import React, { useMemo } from 'react'
import { Flex, Skeleton, Text } from 'uikit'
import styled from 'styled-components'
import Balance from 'components/Balance'
import { Pool } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import BaseCell, { CellContent } from './BaseCell'

interface TotalStakedCellProps {
  pool: Pool
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 100px;
`

const TotalStakedCell: React.FC<TotalStakedCellProps> = ({ pool }) => {
  const { stakingToken, totalStaked } = pool

  const totalStakedBalance = useMemo(() => {
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }, [totalStaked, stakingToken.decimals])

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          TOTAL STAKED
        </Text>
        {totalStakedBalance ? (
          <Flex height="100%" alignItems="center">
            <Balance fontSize="16px" value={totalStakedBalance} decimals={0} unit={` ${stakingToken.symbol}`} />
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default TotalStakedCell

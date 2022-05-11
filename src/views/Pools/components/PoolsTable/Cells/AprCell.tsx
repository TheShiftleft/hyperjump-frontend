import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints } from 'uikit'
import { Pool } from 'state/types'
import BaseCell, { CellContent } from './BaseCell'
import Apr from '../Apr'

interface AprCellProps {
  pool: Pool
}

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0 0 120px;
  }
`

const AprCell: React.FC<AprCellProps> = ({ pool }) => {
  const { isXs, isSm } = useMatchBreakpoints()
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          APR
        </Text>
        <Apr pool={pool} performanceFee={0} showIcon={!isXs && !isSm} alignItems="flex-start" />
      </CellContent>
    </StyledCell>
  )
}

export default AprCell

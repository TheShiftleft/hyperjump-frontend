import React from 'react'
import styled from 'styled-components'
import { Text } from 'uikit'
import BigNumber from 'bignumber.js'
import BaseCell, { CellContent } from './BaseCell'
import Apy from '../Apy'

interface ApyCellProps {
  apy: BigNumber
  title: string
}

const StyledCell = styled(BaseCell)`
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0 0 120px;
  }
`

const AprCell: React.FC<ApyCellProps> = ({ apy, title }) => {
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="16px" color="textSubtle" textAlign="left">
          {title}
        </Text>
        <Apy apy={apy} alignItems="flex-start" />
      </CellContent>
    </StyledCell>
  )
}

export default AprCell

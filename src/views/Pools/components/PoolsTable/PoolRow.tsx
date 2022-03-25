import React, { useState } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'uikit'
import { Pool } from 'state/types'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import NameCell from './Cells/NameCell'
import EarningsCell from './Cells/EarningsCell'
import AprCell from './Cells/AprCell'
import TotalStakedCell from './Cells/TotalStakedCell'
import EndsInCell from './Cells/EndsInCell'
import ExpandActionCell from './Cells/ExpandActionCell'
import ActionPanel from './ActionPanel/ActionPanel'

interface PoolRowProps {
  pool: Pool
  account: string
  userDataLoaded: boolean
}

const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`

const StyledRowContainer = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background-color: rgba(13, 29, 54, 0.4);

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 20px;
  }
  padding: 8px 0 8px 2px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`

const PoolRow: React.FC<PoolRowProps> = ({ pool, account, userDataLoaded }) => {
  const { isXs, isSm, isMd, isLg, isXl } = useMatchBreakpoints()
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }
  return (
    <StyledRowContainer>
      <StyledRow role="row" onClick={toggleExpanded}>
        <NameCell pool={pool} />
        <EarningsCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
        <AprCell pool={pool} />
        {(isLg || isXl) && <TotalStakedCell pool={pool} />}
        {isXl && <EndsInCell pool={pool} />}
        <ExpandActionCell expanded={expanded} isFullLayout={isMd || isLg || isXl} />
      </StyledRow>
      {shouldRenderActionPanel && (
        <ActionPanel
          account={account}
          pool={pool}
          userDataLoaded={userDataLoaded}
          expanded={expanded}
          breakpoints={{ isXs, isSm, isMd, isLg, isXl }}
        />
      )}
    </StyledRowContainer>
  )
}

export default PoolRow

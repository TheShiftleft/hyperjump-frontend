import React, { useRef } from 'react'
import styled from 'styled-components'
import { Button, ChevronUpIcon } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { Pool } from 'state/types'
import PoolRow from './PoolRow'

interface PoolsTableProps {
  pools: Pool[]
  userDataLoaded: boolean
  account: string
}
const PoolsTable: React.FC<PoolsTableProps> = ({ pools, userDataLoaded, account }) => {
  const { t } = useTranslation()
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }
  return (
    <StyledTableBorder>
      <StyledTable role="table" ref={tableWrapperEl}>
        {pools.map((pool) =>
          pool.sousId === 0 ? null : (
            <PoolRow key={pool.sousId} pool={pool} account={account} userDataLoaded={userDataLoaded} />
          ),
        )}
        <ScrollButtonContainer>
          <Button variant="text" onClick={scrollToTop}>
            {t('TO TOP')}
            <ChevronUpIcon color="primary" />
          </Button>
        </ScrollButtonContainer>
      </StyledTable>
    </StyledTableBorder>
  )
}

export default PoolsTable

const StyledTable = styled.div`
  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  }
`

const StyledTableBorder = styled.div`
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

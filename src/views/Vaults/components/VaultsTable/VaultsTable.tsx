import React, { useRef } from 'react'
import styled from 'styled-components'
import { Button, ChevronUpIcon, ColumnType, useTable } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import VaultRow, { VaultRowProps } from './VaultRow'

interface VaultsTableProps {
  data: VaultRowProps[]
  columns: ColumnType<VaultRowProps>[]
  sortColumn?: string
}

const Container = styled.div`
  filter: ${({ theme }) => theme.card.dropShadow};
  width: 100%;
  margin: 16px 0px;
`

const TableWrapper = styled.div`
  overflow: visible;

  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTable = styled.div`
  background-color: transparent;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 8px;
  padding-bottom: 8px;
`

const TableContainer = styled.div`
  position: relative;
`

const VaultsTable: React.FC<VaultsTableProps> = (props) => {
  const { data, columns } = props
  const { t } = useTranslation()
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }
  const { rows } = useTable(columns, data, { sortable: true, sortColumn: 'vault' })

  return (
    <Container>
      <TableContainer>
        <TableWrapper ref={tableWrapperEl}>
          <StyledTable>
            {rows.map((row) => {
              return <VaultRow {...row.original} key={`table-row-${row.id}`} />
            })}
          </StyledTable>
        </TableWrapper>
        <ScrollButtonContainer>
          <Button variant="text" onClick={scrollToTop}>
            {t('TO TOP')}
            <ChevronUpIcon color="primary" />
          </Button>
        </ScrollButtonContainer>
      </TableContainer>
    </Container>
  )
}

export default VaultsTable

import Loader from 'components/Loader';
import { PoolData } from 'hooks/useGetPools';
import React from 'react'
import styled from "styled-components";
import { Heading, Text } from 'uikit';
import TableRow from './TableRow';

interface EmergencyTableProps {
  data: PoolData[],
  isLoading: boolean
}

const TableWrapper = styled.div`
  overflow: visible;

  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTable = styled.table`
  border-collapse: collapse;
  font-size: 14px;
  border-radius: 4px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`

const TableBody = styled.tbody`
  & tr {
    td {
      font-size: 16px;
      vertical-align: middle;
    }
  }
`

const TableContainer = styled.div`
  position: relative;
`

const RowContainer = styled.tr`
  padding: 8px 20px;
  display: flex;
`

const TdContainer = styled.td`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const EmergencyTable = ({data, isLoading} : EmergencyTableProps) => {
  const getKey = (address: string) => {
    return `poolrow-${address}`
  }
  return (
    <TableContainer>
      <TableWrapper>
        <StyledTable>
          <TableBody>
            { data ? 
              data.map((pool: PoolData) => <TableRow key={getKey(pool.address)} pool={pool} />)
              :
              <RowContainer>
                <TdContainer>
                  <Heading scale='xl' color='primary'>{isLoading ? <Loader size='48px' />  : 'Enter a masterchef address to get started'}</Heading>
                </TdContainer>
              </RowContainer>
            }
          </TableBody>
        </StyledTable>
      </TableWrapper>
    </TableContainer>
  )
}

export default EmergencyTable
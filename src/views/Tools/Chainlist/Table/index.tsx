import React from 'react'
import styled from "styled-components";
import TableRow from './TableRow';

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


const ChainlistTable = () => {
  return (
    <TableContainer>
      <TableWrapper>
        <StyledTable>
          <TableBody>
            <TableRow/>
          </TableBody>
        </StyledTable>
      </TableWrapper>
    </TableContainer>
  )
}

export default ChainlistTable
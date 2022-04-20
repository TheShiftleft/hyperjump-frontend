import React from 'react'
import styled from "styled-components";
import { ApprovedTransaction } from '../index';

const TableItem = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 10px;
  font-weight: normal;
`

const TableRow = ({row}: {row: ApprovedTransaction}) => {
  return (
    <>
    <TableItem>
      JUMP
    </TableItem>
    <TableItem>
      {row.contract}
    </TableItem>
    <TableItem>
      {row.approved}
    </TableItem>
    <TableItem>
      {row.allowance}
    </TableItem>
    <TableItem>
      Revoke
    </TableItem>
    </>
  )
}

export default TableRow
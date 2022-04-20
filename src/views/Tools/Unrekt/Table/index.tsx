import React from 'react'
import styled from "styled-components"
import { ApprovedTransaction } from '../index'
import TableHeader from './TableHeader'
import TableRow from './TableRow'


const TableContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  row-gap: 15px;
`

const Table = ({data} : {data:[ApprovedTransaction]}) => {
  console.log('data', data)
  
  return (
    <TableContainer>
      <TableHeader />

      {data?.map((row) => <TableRow row={row}/>)}     
    </TableContainer>
  )
}

export default Table
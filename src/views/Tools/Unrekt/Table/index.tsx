import React from 'react'
import Loader from 'components/Loader'
import styled from "styled-components"
import { Text } from 'uikit'
import { ApprovedTransaction } from '../index'
import TableHeader from './TableHeader'
import TableRow from './TableRow'


const TableContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  row-gap: 15px;
`
const LoaderText = styled(Text)`
  grid-column: 1 / span 5;
  text-align: center;
  font-size: 20px;
`
const Table = ({data} : {data:[ApprovedTransaction] | []}) => {
  const getKey = (row, index) => {
    return `${row.approved}-${index}`
  }
  // console.log('data', data)
  return (
    <TableContainer>
      <TableHeader />
      {data?.length > 0 ? 
        data?.map((row, index) => <TableRow key={getKey(row,index)} row={row}/>) 
      : data?.length === 0 ?
        <LoaderText>No addresses to revoke found</LoaderText>
      :
        <LoaderText>Loading table data... <Loader/></LoaderText>
      }     
    </TableContainer>
  )
}

export default Table
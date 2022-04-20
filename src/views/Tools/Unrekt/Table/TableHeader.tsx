import React from 'react'
import { Heading } from 'uikit';
import styled from "styled-components";

const TableHeaderItem = styled.div<{gridColumn?: string, first?: boolean, last?: boolean}>`
  ${({gridColumn}) => gridColumn ? `grid-column: ${gridColumn};`: ''}
  border-radius: ${({first, last}) => first ? '10px 0 0 10px;' : last ? '0px 10px 10px 0px;' : 'none;'}
  text-align: center;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.75);
  padding: 10px;
`

const TableHeader = () => {

  return (
    <>
      <TableHeaderItem gridColumn='1 / span 2' first>
        <Heading>
          Token
        </Heading>
      </TableHeaderItem>
      <TableHeaderItem>
        <Heading>
          Authorized Spender
        </Heading>
      </TableHeaderItem>
      <TableHeaderItem gridColumn='4 / span 2' last>
        <Heading>
          Allowance
        </Heading>
      </TableHeaderItem>
    </>
  )
}

export default TableHeader
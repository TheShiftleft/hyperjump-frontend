import { Currency } from '@hyperjump-defi/sdk';
import { useActiveWeb3React } from 'hooks';
import { useChains } from 'hooks/api';
import useAuth from 'hooks/useAuth';
import React from 'react'
import styled from "styled-components";
import TableRow from './TableRow';

export interface Chain {
  chain: string
  chainId: number
  chainSlug: string
  infoUrl: string
  name: string
  networkId: number
  shortName: string
  nativeCurrency: Currency
  rpc: string[]
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


const ChainlistTable = () => {
  const chains:Chain[] = useChains()
  const { account } = useActiveWeb3React()
  const { login, logout } = useAuth()
  return (
    <TableContainer>
      <TableWrapper>
        <StyledTable>
          <TableBody>
            {
              chains && 
              chains.map(chain => {
                return <TableRow key={chain.chainId} chainData={chain} login={login} logout={logout} account={account} />
              })
            }
          </TableBody>
        </StyledTable>
      </TableWrapper>
    </TableContainer>
  )
}

export default ChainlistTable
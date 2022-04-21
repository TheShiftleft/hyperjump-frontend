import React, { useMemo, useState } from 'react'
import ItemLink from 'components/Tools/ItemLink';
import { BASE_BSC_SCAN_URL, BASE_FTM_SCAN_URL } from 'config';
import { useActiveWeb3React } from 'hooks';
import { useTokenContract } from 'hooks/useContract';
import styled from "styled-components";
import { Button } from 'uikit';
import { ApprovedTransaction } from '../index';

const TableItem = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 10px;
  font-weight: 600;
  align-self: center;
`

const TableItemHide = styled(TableItem)`
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: block
  }
`

const TableItemRevoke = styled(TableItem)`
  text-align: center;
  grid-column: 4 / span 2;
  ${({ theme }) => theme.mediaQueries.md} {
    text-align: start;
    grid-column: auto;
  }
`

const StyledItemLink = styled(ItemLink)`
  font-weight: 400;
  padding: 10px;
  align-self:center;
`

const TableItemTokenSymbolLink = styled(StyledItemLink)`
  grid-column: 1 / span 2;
  ${({ theme }) => theme.mediaQueries.md} {
    grid-column: auto;
  }
`

const HideItemLink = styled(StyledItemLink)`
  display: none;
    ${({ theme }) => theme.mediaQueries.md} {
      display: block
    }
`

const TableRow = ({row}: {row: ApprovedTransaction}) => {
  const {account, chainId} = useActiveWeb3React()
  const blockUrl = chainId === 250 ? BASE_FTM_SCAN_URL : BASE_BSC_SCAN_URL
  const tokenBlockUrl = `${blockUrl}/address/${row.contract}`
  const spenderBlockUrl = `${blockUrl}/address/${row.approved}`
  const tokenContract = useTokenContract(row.contract)
  const [symbol, setSymbol] = useState()
  useMemo(() => {
    let isMounted = true
    const fetchSymbol = async () => {
      const resSymbol = await tokenContract.symbol()
      if(isMounted){
        
        setSymbol(resSymbol)
      }
    }

    fetchSymbol()

    return () => {
      isMounted = false
    }
  },[tokenContract])
  return (
    <>
    <TableItemTokenSymbolLink href={tokenBlockUrl} target='_blank'>
        {symbol}
    </TableItemTokenSymbolLink>
    <HideItemLink href={tokenBlockUrl} target='_blank' ellipsis>
        {row.contract}
    </HideItemLink>
    <StyledItemLink href={spenderBlockUrl} target='_blank' ellipsis>
        {row.approved}
    </StyledItemLink>
    <TableItemHide style={row.allowance.toLowerCase() === 'unlimited' ? {color: 'red'}: {}}>
      {row.allowance}
    </TableItemHide>
    <TableItemRevoke>
      <Button height='30px'>
        Revoke
      </Button>
    </TableItemRevoke>
    </>
  )
}

export default TableRow
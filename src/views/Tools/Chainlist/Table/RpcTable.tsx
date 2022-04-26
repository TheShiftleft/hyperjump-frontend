import React from 'react'
import styled from "styled-components";

const TableContainer = styled.table`
  position: relative;
  width: 100%;
`

const RpcTableRow = styled.tr`
`

const RpcTableTbody = styled.tbody`
`

const RpcTableTh = styled.th`
  text-align:center;
  padding: 5px 0px;
`

const RpcTableTd = styled.td<{center?: boolean}>`
  text: 2px;
  padding: 5px 0px;
  ${({center}) => center ? 'text-align: center' : ''}
`

const RpcRow = ({rpc} : {rpc: string}) => {

  return (
    <RpcTableRow>
      <RpcTableTd>{rpc}</RpcTableTd>
      <RpcTableTd center>14660776</RpcTableTd>
      <RpcTableTd center>0.165s</RpcTableTd>
      <RpcTableTd center>score</RpcTableTd>
    </RpcTableRow>
  )
}

const RpcTable = ({rpcs, alt}: {rpcs: string[], alt: string}) => {
  const getKey = (index) => {
    return `${alt}-${index}`
  }
  return (
    <TableContainer>
      <RpcTableTbody>
        <RpcTableRow>
          <RpcTableTh>RPC Server Address</RpcTableTh>
          <RpcTableTh>Height</RpcTableTh>
          <RpcTableTh>Latency</RpcTableTh>
          <RpcTableTh>Score</RpcTableTh>
        </RpcTableRow>
        {rpcs && 
          rpcs.map((rpc, index) => <RpcRow key={getKey(index)} rpc={rpc} />)
        }
      </RpcTableTbody>
    </TableContainer>
  )
}

export default RpcTable
import useRPCData, { RPCData } from 'hooks/useRPCData';
import React, { useMemo } from 'react'
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

const Trust = styled.div<{color?: string}>`
  width: 15px;
  height: 15px;
  border-radius: 100px;
  background-color: ${({color}) => color};
  margin: auto;
`

const RpcRow = ({rpcs} :  {rpcs: RPCData}) => {
  return (
    <RpcTableRow>
      <RpcTableTd>{rpcs.isLoading ? 'Loading...' : rpcs.data.url}</RpcTableTd>
      <RpcTableTd center>{rpcs.isLoading ? 'Loading...' : rpcs.data.height}</RpcTableTd>
      <RpcTableTd center>{rpcs.isLoading ? 'Loading...' : rpcs.data.latency}</RpcTableTd>
      <RpcTableTd center>{rpcs.isLoading ? 'Loading...' : <Trust color={rpcs.data.trust}/>}</RpcTableTd>
    </RpcTableRow>
  )
}

const RpcTable = ({rpcs, alt}: {rpcs: string[], alt: string}) => {
  const rpcData = useRPCData(rpcs)
  const rpcList = useMemo(() => {
    const sortedData = rpcData?.sort((a: RPCData, b: RPCData) => {
      if (a.isLoading)  return 1;

      const h1 = a?.data?.height;
      const h2 = b?.data?.height;
      const l1 = a?.data?.latency;
      const l2 = b?.data?.latency;

      if (!h2) {
        return -1;
      }

      if (h2 - h1 > 0) {
        return 1;
      }
      if (h2 - h1 < 0) {
        return -1;
      }
      if (h1 === h2) {
        if (l1 - l2 < 0) {
          return -1;
        }
        return 1;
      }
      return 1
    })

    const topRpc:RPCData = sortedData[0] ?? {};

    return sortedData.map(({ data, ...rest }) => {
      const { height = null, latency = null, url = '' } = data || {};

      let trust = 'transparent';
      let disableConnect = false;

      if (!height || !latency || topRpc.data.height - height > 3 || topRpc.data.latency - latency > 5000) {
        trust = 'red';
      } else if (topRpc.data.height - height < 2 && topRpc.data.latency - latency > -600) {
        trust = 'green';
      } else {
        trust = 'orange';
      }

      if (url.includes('wss://') || url.includes('API_KEY')) disableConnect = true;

      const lat = latency ? `${(latency / 1000).toFixed(3)}s`: null;

      return { ...rest, data: { ...data, height, latency: lat, trust, disableConnect } };
    });
  }, [rpcData]);

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
        {rpcList && 
          rpcList.map((rpc, index) => <RpcRow key={getKey(index)} rpcs={rpc} />)
        }
      </RpcTableTbody>
    </TableContainer>
  )
}

export default RpcTable
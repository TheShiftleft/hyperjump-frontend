import React, { useCallback, useState } from 'react'
import { Text, ChevronDownIcon, Button, useWalletModal, Heading } from 'uikit';
import styled from "styled-components";
import CellLayout from 'views/Farms/components/FarmTable/CellLayout'
import { Login } from "uikit/widgets/WalletModal/types";
import { addToNetwork } from 'utils/wallet';
import { useActiveWeb3React } from 'hooks';
import NetworkCell from './NetworkCell';
import { Chain } from '.';
import RpcTable from './RpcTable';

interface TableRowProps {
  chainData: Chain
  login: Login
  logout: () => void
  account: string
}
const InfoContainer = styled.td`
  padding: 10px 0px;
  display: flex;
  align-items: center;
`
const RpcContainer = styled(InfoContainer)`
  grid-column: 1 / span 5;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const StyledRowContainer = styled.tr`
  border-radius: ${({ theme }) => theme.radii.card};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background-color: rgba(13, 29, 54, 0.4);

  padding: 0 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  grid-template-rows: auto auto
  cursor: pointer;
`

const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 20px;
`

const TableRow = ({chainData, login, logout, account}: TableRowProps) => {
  const { onPresentConnectModal } = useWalletModal(login, logout, account)
  const [isRpcToggled, setIsRpcToggled] = useState(false)
  const { chainId, name, nativeCurrency, shortName, rpc } = chainData

  const handleAddNetwork = useCallback(
    () => {
      try {
        addToNetwork(account, chainData)
      }catch(e) {
        console.error(e)
      }
    },
    [account, chainData]
  )
  
  return (
    <StyledRowContainer >
      <InfoContainer>
        <NetworkCell chain={chainData} label={name} alt={shortName}/>
      </InfoContainer>
      <InfoContainer>
        <CellLayout label='Chain ID'>
        <Text>{chainId}</Text>
        </CellLayout>
      </InfoContainer>
      <InfoContainer>
        <CellLayout label='Currency'>
        <Text>{nativeCurrency.symbol}</Text>
        </CellLayout>
      </InfoContainer>
      <InfoContainer>
        {account ? 
          <Button 
            scale='sm' 
            onClick={() => {
              handleAddNetwork(account, chainData)
            }}
          >
            Add To Metamask
          </Button>
          :
          <Button 
            scale='sm' 
            onClick={() => {
              onPresentConnectModal()
            }}
          >
            Connect Wallet
          </Button>
        }
      </InfoContainer>
      <InfoContainer  onClick={() => {
        setIsRpcToggled(!isRpcToggled)
      }}>
        <ArrowIcon toggled={isRpcToggled}/>
      </InfoContainer>
      {isRpcToggled && 
        <RpcContainer style={{paddingTop: '0'}}>
          <Heading color='primary'>{name} RPC URL List</Heading>
          <RpcTable rpcs={rpc} alt={shortName}/>
        </RpcContainer>
      }
    </StyledRowContainer>
    
  )
}

export default TableRow
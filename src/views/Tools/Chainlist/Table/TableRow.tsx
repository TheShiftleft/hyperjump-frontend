import React, { useState } from 'react'
import { Text, ChevronDownIcon, Button } from 'uikit';
import styled from "styled-components";
import BSCIcon from 'uikit/widgets/Menu/icons/BSCNetwork'
import FTMIcon from 'uikit/widgets/Menu/icons/FTMNetwork'
import EthereumIcon from 'uikit/widgets/Menu/icons/EthereumNetwork'
import CellLayout from 'views/Farms/components/FarmTable/CellLayout'

const networkIcon = {
  BSC: BSCIcon,
  FTM: FTMIcon,
  ETH: EthereumIcon,
}

const networkIconStyle = {
  borderRadius: '50%',
  border: '0px solid',
  color: '#44C4E2',
  marginRight: '10px',
  padding: '1px',
  width: '34px',
  height: '34px',
}

const InfoContainer = styled.div`
  padding: 12px 0px;
  display: flex;
  align-items: center;
  padding-right: 8px;
`

const NetworkCell = styled(InfoContainer)`
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 300px;
    display: flex;
  }
`

const StyledRowContainer = styled.tr`
  border-radius: ${({ theme }) => theme.radii.card};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background-color: rgba(13, 29, 54, 0.4);

  padding: 0 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`

const StyledRow = styled.td`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`

const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 20px;
`

const TableRow = () => {
  const [isRpcToggled, setIsRpcToggled] = useState(false)
  const IconBSC = networkIcon.BSC
  const IconETH = networkIcon.ETH
  const IconFTM = networkIcon.FTM
  return (
    <>
      <StyledRowContainer>
          <StyledRow>
            <InfoContainer>
              <NetworkCell>
                <IconBSC style={networkIconStyle} />
                <Text>Binance Smart Chain Mainnet</Text>
              </NetworkCell>
            </InfoContainer>
            <InfoContainer>
              <CellLayout label='Chain ID'>
              <Text>56</Text>
              </CellLayout>
            </InfoContainer>
            <InfoContainer>
              <CellLayout label='Currency'>
              <Text>BSC</Text>
              </CellLayout>
            </InfoContainer>
            <InfoContainer>
              <Button>Add To Metamask</Button>
            </InfoContainer>
            <InfoContainer  onClick={() => {
              setIsRpcToggled(!isRpcToggled)
              console.log('isRpcToggled', isRpcToggled)
            }}>
              <ArrowIcon toggled={isRpcToggled}/>
            </InfoContainer>
          </StyledRow>
      </StyledRowContainer>
      <StyledRowContainer>
          <StyledRow>
            <InfoContainer>
              <NetworkCell>
                <IconETH style={networkIconStyle} />
                <Text>Ethereum Mainnet</Text>
              </NetworkCell>
            </InfoContainer>
            <InfoContainer>
              <CellLayout label='Chain ID'>
              <Text>1</Text>
              </CellLayout>
            </InfoContainer>
            <InfoContainer>
              <CellLayout label='Currency'>
              <Text>ETH</Text>
              </CellLayout>
            </InfoContainer>
            <InfoContainer>
              <Button>Add To Metamask</Button>
            </InfoContainer>
            <InfoContainer>
              <ArrowIcon toggled={isRpcToggled}/>
            </InfoContainer>
          </StyledRow>
      </StyledRowContainer>
      <StyledRowContainer>
          <StyledRow>
            <InfoContainer>
              <NetworkCell>
                <IconFTM style={networkIconStyle} />
                <Text>Fantom Mainnet</Text>
              </NetworkCell>
            </InfoContainer>
            <InfoContainer>
              <CellLayout label='Chain ID'>
              <Text>250</Text>
              </CellLayout>
            </InfoContainer>
            <InfoContainer>
              <CellLayout label='Currency'>
              <Text>FTM</Text>
              </CellLayout>
            </InfoContainer>
            <InfoContainer>
              <Button>Add To Metamask</Button>
            </InfoContainer>
            <InfoContainer>
              <ArrowIcon toggled={isRpcToggled}/>
            </InfoContainer>
          </StyledRow>
      </StyledRowContainer>
    </>
    
  )
}

export default TableRow
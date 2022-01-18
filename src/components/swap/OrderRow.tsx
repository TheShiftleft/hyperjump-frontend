import React, { useState } from 'react'
import styled from 'styled-components'
import {Text, Button, ChevronDownIcon, ArrowForwardIcon, Link} from 'uikit'
import LimitOrdersApi, {OpenLimitOrder, CancelLimitOrderTxRequest} from '@unidexexchange/sdk'
import {useToken} from 'hooks/Tokens'
import { toNumber } from 'lodash'
import BigNumber from 'bignumber.js'
import getNetwork from 'utils/getNetwork'
import { BASE_FTM_SCAN_URL, BASE_BSC_SCAN_URL } from 'config'
import useWeb3 from "hooks/useWeb3"

interface OrderRowProps {
 order: OpenLimitOrder,
 account: string,
 chainId: number
}

const Row = styled.div`
  margin: 0px 20px 5px 20px;
  border-radius: 20px;
  border: 1px solid ${(props) => props.theme.colors.primary};
  background-color: rgba(13,29,54,0.6);
  padding: 10px 0;
`
const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  margin: 0 20px;
`

const StyledLinkExternal = styled(Link)`
  font-weight: 400;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-right: 0px;
  }
`
const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 20px;
`

const DetailContainer = styled.div`
  margin: 10px 20px 0px 20px;
`

const DetailsText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
  display: flex;
  flex-direction: row;
  align-items:center;
  padding-bottom: 5px;
`
const DetailsTextContent = styled.div`
  font-family: 'Oswald';
  font-size: 14px;
  color: ${({theme}) => theme.colors.primary};
  margin-left: 5px;
`

const TokenContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export default function OrderRow({order, account, chainId} : OrderRowProps) {
    const { config } = getNetwork()
    const web3 = useWeb3()
    const [detailsToggle, setDetailsToggle] = useState(false)

    const inputToken = useToken(order?.inputToken)
    const inputDecimals = (inputToken?.decimals * -1) > 0 ? inputToken?.decimals * -1 : -18
    const inAmount = order?.inputAmount
    const outAmount = order?.minReturn
    const outputToken = useToken(order?.outputToken)
    const outputDecimals = (outputToken?.decimals * -1) > 0 ? outputToken?.decimals * -1 : -18
    const parsedInputAmount = new BigNumber(inAmount).shiftedBy(inputDecimals).toPrecision(4)
    const parsedMinReturn = new BigNumber(outAmount).shiftedBy(outputDecimals).toPrecision(4)
    const transactionURL = config.network === 'FTM' ? `${BASE_FTM_SCAN_URL}/tx/${order?.createdTxHash}` : `${BASE_BSC_SCAN_URL}/tx/${order?.createdTxHash}`
    const createdDate = new Date(toNumber(order?.createdAt) * 1000).toLocaleString('en-GB', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })

    const cancelOrder = async (cancelRequest: CancelLimitOrderTxRequest) => {
        try{
          const cancelledOrder = await LimitOrdersApi.cancelOrder(cancelRequest);
          web3.eth.sendTransaction(cancelledOrder, (error: Error, hash: string) => {
              if(error){
                  console.log('error',error)
              }
          })
        }catch(e){
          console.log(e)
        }
    }

    return(
        <Row>
            <RowContainer>
              <TokenContainer>
                <Text fontSize='14px' bold>{order.inputToken === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" ? config.network : inputToken?.symbol}</Text><ArrowForwardIcon color="primary" marginLeft="10px" marginRight="10px" width="24px" /><Text fontSize="14px" bold>{outputToken?.symbol}</Text>
              </TokenContainer>
            
              <ButtonContainer onClick={() => {
                  setDetailsToggle(!detailsToggle)
              }}>
                  <Text>Details</Text>
                  <ArrowIcon color="primary" toggled={detailsToggle} />
              </ButtonContainer>
              </RowContainer>
              {detailsToggle &&
              <DetailContainer>
                  <DetailsText>Date Created: <DetailsTextContent>{createdDate}</DetailsTextContent></DetailsText>
                  <DetailsText>Amount: <DetailsTextContent>{parsedInputAmount}</DetailsTextContent></DetailsText>
                  <DetailsText>Minimum Return: <DetailsTextContent>{parsedMinReturn}</DetailsTextContent></DetailsText>
                  <StyledLinkExternal href={transactionURL} target="_blank">{config.network === 'FTM' ? 'FTM Scan' : "BSC Scan"}</StyledLinkExternal>
                  <Button width="100%" marginTop="10px" onClick={() => cancelOrder({account, chainId, ...order})}>
                      Cancel Order
                  </Button>
              </DetailContainer>
              }
        </Row>
    )
}
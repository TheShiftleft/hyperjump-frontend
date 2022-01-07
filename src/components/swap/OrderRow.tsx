import React, { useState } from 'react'
import styled from 'styled-components'
import {Text, Button, ChevronDownIcon} from 'uikit'
import {OpenLimitOrder, CancelLimitOrderTxRequest} from '@unidexexchange/sdk'

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
  flex: 1;
  margin: 0 20px;
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
  color: ${({ theme }) => theme.colors.textSubtle}
`

const cancelOrder = (cancelRequest: CancelLimitOrderTxRequest) => {
    console.log('cancel order', cancelRequest)
}

export default function OrderRow({order, account, chainId} : OrderRowProps) {
    const [detailsToggle, setDetailsToggle] = useState(false)
    const cancelRequest = {
        account,
        chainId,
        module: order.module,
        inputToken: order.inputToken,
        outputToken: order.outputToken,
        minReturn: order.minReturn,
        owner: order.owner,
        witness: order.witeness,
    }
    return(
        <Row>
            <RowContainer>
            <Text>This token to that token</Text>
            <ButtonContainer onClick={() => {
                setDetailsToggle(!detailsToggle)
            }}>
                <Text>Details</Text>
                <ArrowIcon color="primary" toggled={detailsToggle} />
            </ButtonContainer>
            </RowContainer>
            {detailsToggle &&
            <DetailContainer>
                <DetailsText>Order Details Here</DetailsText>
                <Button width="100%" marginTop="10px" onClick={() => cancelOrder(cancelRequest)}>
                    Cancel Order
                </Button>
            </DetailContainer>
            }
        </Row>
    )
}
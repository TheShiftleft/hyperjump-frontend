import React from 'react'
import styled from 'styled-components'
import { OpenLimitOrder } from '@unidexexchange/sdk'
import Card from 'components/Card'
import OrderRow from './OrderRow'
import AppBody from '../../views/Swap/AppBody'

interface OrderListProps {
  show: boolean
  orders: OpenLimitOrder[]
  account: string
  chainId: number
}

const TextTitle = styled.div`
  font-size: 16px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  padding-bottom: 1rem;
`
const Container = styled.div<{ hideInput: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
`

const OrderContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const TextContainer = styled.div`
  align-self: center;
  font-weight: bold;
`

export default function OrderLimit({ show, orders, account, chainId }: OrderListProps) {
  return (
    <Container hideInput={!show}>
      {show && (
        <AppBody>
          <Card>
            <TextTitle>Orders</TextTitle>
          </Card>
          <OrderContainer>
            {orders.length <= 0 ? (
              <TextContainer>No Open Orders</TextContainer>
            ) : (
              orders.map((order: OpenLimitOrder, i: number) => {
                let key = `item${i}`
                return <OrderRow key={key} order={order} account={account} chainId={chainId} />
              })
            )}
          </OrderContainer>
        </AppBody>
      )}
    </Container>
  )
}

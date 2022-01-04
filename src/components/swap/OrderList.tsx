import React from 'react'
import styled from 'styled-components'
import Card from 'components/Card'
import AppBody from '../../views/Swap/AppBody'

interface OrderListProps {
  show: boolean
}

const TextTitle = styled.div`
    font-size: 14px;
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
    padding-bottom: 1rem;
`
const Container = styled.div<{ hideInput: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function OrderLimit({show} : OrderListProps) {

  return (
    <Container hideInput={!show}>
      {show && (
        <AppBody>
              <Card>
                  <TextTitle>Orders</TextTitle>
              </Card>
          </AppBody>
      )
      }
    </Container>
  )
}

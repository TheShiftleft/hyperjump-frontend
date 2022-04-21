import React from 'react'
import Container from 'components/Container'
import { AppBody, PageHeader, CardBody } from 'components/Tools'
import { useApprovedTransaction } from 'hooks/api'
import { Button } from 'uikit'
import Table from './Table'

export interface ApprovedTransaction {
  allowance: string
  approved: string
  contract: string
}

const Unrekt = () => {
  const approvedTransactions: [ApprovedTransaction] = useApprovedTransaction()

  return (
    <Container>
      <AppBody>
        <PageHeader type='unrekt' description="Find & revoke all the addresses that can spend your tokens!" />
        <CardBody>
          <Button height='30px' mb='10px' disabled={!approvedTransactions}>Revoke All</Button>
          <Table data={approvedTransactions} />
        </CardBody>
      </AppBody>
    </Container>
  )
}

export default Unrekt

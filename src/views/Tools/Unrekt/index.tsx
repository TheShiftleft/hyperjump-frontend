import React, { useEffect, useState } from 'react'
import Container from 'components/Container'
import { AppBody, PageHeader, CardBody } from 'components/Tools'
import { useActiveWeb3React } from 'hooks'
import { useApprovedTransaction } from 'hooks/api'
import Table from './Table'

export interface ApprovedTransaction {
  allowance: string
  approved: string
  contract: string
}

const Unrekt = () => {
  const {account, chainId} = useActiveWeb3React()
  const approvedTransactions: [ApprovedTransaction] = useApprovedTransaction()

  // console.log('approvedTransactions',approvedTransactions)
  return (
    <Container>
      <AppBody>
        <PageHeader type='unrekt' description="Find & revoke all the addresses that can spend your tokens!" />
        <CardBody>
          <Table data={approvedTransactions} />
        </CardBody>
      </AppBody>
    </Container>
  )
}

export default Unrekt

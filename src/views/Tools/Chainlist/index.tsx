import React from 'react'
import Container from 'components/Container'
import { AppBody, PageHeader, CardBody } from 'components/Tools'
import ChainlistTable from './Table'

const Chainlist = () => {
  return (
    <Container>
      <AppBody>
        <PageHeader type='chainlist' description="" />
        <CardBody>
          <ChainlistTable/>
        </CardBody>
      </AppBody>
    </Container>
  )
}

export default Chainlist
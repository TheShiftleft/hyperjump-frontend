import React, { useCallback, useMemo, useState } from 'react'
import Container from 'components/Container'
import { AppBody, PageHeader, CardBody } from 'components/Tools'
import { useApprovedTransaction } from 'hooks/api'
import { useActiveWeb3React } from 'hooks'
import { Button } from 'uikit'
import { getApproveABI } from 'config/abi'
import { getContract } from 'utils'
import useToast from 'hooks/useToast'
import Table from './Table'

export interface ApprovedTransaction {
  allowance: string
  approved: string
  contract: string
  allowanceAmount: number
}

const Unrekt = () => {
  const approvedTransactions: [ApprovedTransaction] | [] = useApprovedTransaction()
  const { library, account } = useActiveWeb3React()
  const {toastError, toastSuccess} = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleRevokeAll = useCallback(() => {
    setIsLoading(true)
    
    const promiseArr = approvedTransactions?.map((v) => {
      const contract = getContract(v.contract, getApproveABI(), library, account)
      return contract.approve(v.approved, 0)
    })
    Promise.all(promiseArr)
    .then((result) => {
      const resultsArr = result.map(r => r.wait)
      Promise.all(resultsArr)
      .then(confirmations => {
        toastSuccess('Revoked', 'All addresses has been revoked!')
        setIsLoading(false)
      })
    })
    .catch((error) => {
      console.error(error)
      let msg = 'An error occured while processing transaction.'
      let title = 'Revoke Error'
      if(error.code === 4001){
        title = 'Transaction Cancelled'
        msg = 'User cancelled the transaction.'
      }
      setIsLoading(false)
      toastError(title, msg)
    })
  },[approvedTransactions, library, account, toastSuccess, toastError])
  return (
    <Container>
      <AppBody>
        <PageHeader type='unrekt' description="Find & revoke all the addresses that can spend your tokens!" />
        <CardBody>
          <Button height='30px' mb='10px' disabled={!approvedTransactions} onClick={handleRevokeAll} isLoading={isLoading}>Revoke All</Button>
          <Table data={approvedTransactions} />
        </CardBody>
      </AppBody>
    </Container>
  )
}

export default Unrekt

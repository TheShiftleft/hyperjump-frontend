import React, { useCallback, useState } from 'react'
import Container from 'components/Container'
import { AppBody, PageHeader, CardBody } from 'components/Tools'
import { Input, Flex, Button } from 'uikit'
import { GetPoolsStatus, useGetPools } from 'hooks/useGetPools'
import useToast from 'hooks/useToast'
import EmergencyTable from './Table'

const Unrekt = () => {
  const [inputAddress, setInputAddress] = useState('')
  const { toastError, toastSuccess } = useToast()
  const [ tableData, setTableData ] = useState()
  const {status, callback, error} = useGetPools(inputAddress)
  const handleGetPools = useCallback(
    async () => {
      if(error){
        toastError('Error', error)
        return
      }
      if(status === GetPoolsStatus.VALID){
        const result = await callback()
        if(result){
          setTableData(result)
        }else{
          setTableData(undefined)
          toastError('Unable to fetch masterchef', 'Make sure the address and network is correct')
        }
      }
  },[callback, error, status, toastError])
  return (
    <Container>
      <AppBody>
        <PageHeader type='emergency' description="Find & revoke all the addresses that can spend your tokens!" />
        <CardBody>
          <Flex justifyContent='space-between' mb="10px">
            <Input 
            value={inputAddress}
            onInput={
              (data) => {
                const target = data.target as HTMLTextAreaElement
                setInputAddress(target.value)
            }} 
            placeholder='Enter Masterchef Address' style={{flex: '1', height: '48px'}}/>
            <Button 
              scale='md' 
              ml='5px'
            onClick={() => handleGetPools()}
              >
              Start
            </Button>
          </Flex>
          <EmergencyTable data={tableData} masterchefAddress={inputAddress}/>
        </CardBody>
      </AppBody>
    </Container>
  )
}

export default Unrekt

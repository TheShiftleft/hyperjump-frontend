import React, { useCallback, useState } from 'react'
import Container from 'components/Container'
import { AppBody, PageHeader, CardBody } from 'components/Tools'
import { Input, Flex, Button } from 'uikit'
import useGetPools, { GetPoolsStatus } from 'hooks/useGetPools'

const Unrekt = () => {
  const [inputAddress, setInputAddress] = useState('')
  const [ tableData, setTableData ] = useState()
  const {status, callback, error} = useGetPools(inputAddress)
  const handleGetPools = useCallback(
    async () => {
      if(error){
        console.error('error', error)
        return
      }
      if(status === GetPoolsStatus.VALID){
        setTableData( await callback())
      }
  },[callback, error, status])
  console.log('tableData', tableData)
  return (
    <Container>
      <AppBody>
        <PageHeader type='emergency' description="Find & revoke all the addresses that can spend your tokens!" />
        <CardBody>
          <Flex justifyContent='space-between'>
            <Input 
            value={inputAddress}
            onInput={
              (data) => {
                const target = data.target as HTMLTextAreaElement
                console.log('val', target.value)
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
          Emergency
        </CardBody>
      </AppBody>
    </Container>
  )
}

export default Unrekt

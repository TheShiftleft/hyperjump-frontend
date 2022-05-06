import React, { useCallback, useState } from 'react'
import Container from 'components/Container'
import { AppBody, PageHeader, CardBody } from 'components/Tools'
import { Input, Flex, Button } from 'uikit'
import { GetPoolsStatus, PoolData, useGetPools } from 'hooks/useGetPools'
import useToast from 'hooks/useToast'
import EmergencyTable from './Table'

const Unrekt = () => {
  const [inputAddress, setInputAddress] = useState('')
  const { toastError, toastSuccess } = useToast()
  const [ tableData, setTableData ] = useState<PoolData[]>()
  const {status, callback, error} = useGetPools(inputAddress)
  const [ isLoading, setIsLoading ] = useState(false)
  const isDataLoaded = !tableData
  const handleGetPools = useCallback(
    async () => {
      setIsLoading(true)
      if(error){
        toastError('Error', error)
        setIsLoading(false)
        return
      }
      if(status === GetPoolsStatus.VALID){
        const result = await callback()
        if(result){
          setTableData(result)
          setIsLoading(false)
        }else{
          setTableData(undefined)
          setIsLoading(false)
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
                setInputAddress(target.value.trim())
            }} 
            placeholder='Enter Masterchef Address' style={{flex: '1', height: '48px'}}/>
            <Button 
              ml='5px'
            onClick={() => handleGetPools()}
              >
              Start
            </Button>
            <Button 
              ml='5px'
              onClick={() => console.log('Emergency Withdraw All clicked')}
              disabled={isDataLoaded}
              >
              Emergency Withdraw All
            </Button>
            <Button 
              ml='5px'
              onClick={() => console.log('Revoke All clicked')}
              disabled={isDataLoaded}
              >
              Revoke All
            </Button>
          </Flex>
          <EmergencyTable data={tableData} isLoading={isLoading}/>
        </CardBody>
      </AppBody>
    </Container>
  )
}

export default Unrekt
